import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "RecipeTable";

export const lambda_handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "GET /recipes":
        let pageSize = 40;
        let lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey;
        let scanParams = {
          TableName: tableName,
          Limit: pageSize,
          ExclusiveStartKey: lastEvaluatedKey
            ? JSON.parse(lastEvaluatedKey)
            : undefined,
        };
        body = await dynamo.send(new ScanCommand(scanParams));
        body = {
          items: body.Items,
          lastEvaluatedKey: body.LastEvaluatedKey
            ? JSON.stringify(body.LastEvaluatedKey)
            : null,
        };
        break;
      case "GET /recipe":
        let id = event.queryStringParameters.id;
        let recipeParams = {
          TableName: tableName,
          ExpressionAttributeNames: {
            "#idMeal": "idMeal",
          },
          ExpressionAttributeValues: {
            ":id": id,
          },
          KeyConditionExpression: "#idMeal = :id"
        };
        body = await dynamo.send(new ScanCommand(recipeParams));
        body = body.Items;
        break;
      case "GET /recipes/search":
        let keyword = event.queryStringParameters.keyword;
        let searchParams = {
          TableName: tableName,
          FilterExpression: "contains(#strMeal, :keyword)",
          ExpressionAttributeNames: {
            "#strMeal": "strMeal",
          },
          ExpressionAttributeValues: {
            ":keyword": keyword,
          },
        };
        body = await dynamo.send(new ScanCommand(searchParams));
        body = body.Items;
        break;
      case "GET /recipesByCategory":
        let category = event.queryStringParameters.keyword;
        let searchByCategoryParams = {
          TableName: tableName,
          FilterExpression: "contains(#strCategory, :keyword)",
          ExpressionAttributeNames: {
            "#strCategory": "strCategory",
          },
          ExpressionAttributeValues: {
            ":keyword": category,
          },
        };
        body = await dynamo.send(new ScanCommand(searchByCategoryParams));
        body = body.Items;
        break;
      case "PUT /recipe":
        let requestJSON = JSON.parse(event.body);
        console.log(requestJSON);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: requestJSON,
          })
        );
        body = `Put item ${requestJSON.id}`;
        break;
      case "GET /existing-primary-keys":
        let Params = {
          TableName: tableName,
          Select: "SPECIFIC_ATTRIBUTES",
          ProjectionExpression: "idMeal",
        };
        body = await dynamo.send(new ScanCommand(Params));
        body = body.Items;
        break;
      default:
        console.log(event);
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    console.log(body);
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
