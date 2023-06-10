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
  console.log("event: " + event);
  try {
    switch (event.routeKey) {
      case "GET /recipes":
        const pageSize = 40;       
        const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey;
        const scanParams = {
          TableName: tableName,
          Limit: pageSize,
          ExclusiveStartKey: lastEvaluatedKey ? JSON.parse(lastEvaluatedKey) : undefined
        };
        console.log('testing automated lambda update with terraform in jenkins pipeline');
        body = await dynamo.send(new ScanCommand(scanParams));
        body = {
          items: body.Items,
          lastEvaluatedKey: body.LastEvaluatedKey ? JSON.stringify(body.LastEvaluatedKey) : null
        };
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
          Limit: 40,
        };
        body = await dynamo.send(new ScanCommand(searchParams));
        body = body.Items;
        break;
        case "GET /recipesByCategory":
          let keywordd = event.queryStringParameters.keyword;
        let searchParamss = {
          TableName: tableName,
          FilterExpression: "contains(#strCategory, :keyword)",
          ExpressionAttributeNames: {
            "#strCategory": "strCategory",
          },
          ExpressionAttributeValues: {
            ":keyword": keywordd,
          },
        };
        body = await dynamo.send(new ScanCommand(searchParamss));
        body = body.Items;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
