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
const tableName = "apiCacheTable";

export const lambda_handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };
  console.log(event);
  try {
    switch (event.routeKey) {
      case "GET /cache-state":
        let scanParams = {
          TableName: tableName
        };
        body = await dynamo.send(new ScanCommand(scanParams));
        // body = {
        //   items: body.Items
        // };
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
