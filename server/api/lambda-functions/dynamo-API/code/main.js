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
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName, Limit: 40 })
        );
        body = body.Items;
        break;
      case "GET /recipes/search":
        const keyword = event.queryStringParameters.keyword;
        const searchParams = {
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
