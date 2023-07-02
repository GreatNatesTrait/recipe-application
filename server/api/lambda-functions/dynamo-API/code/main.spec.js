import { mockClient } from 'aws-sdk-client-mock';
import { lambda_handler } from './main';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";


it('should write log to s3 bucket', async () => {

  const ddbMock = mockClient(DynamoDBDocumentClient);
  ddbMock.on(ScanCommand).resolves({
    Items: [{ pk: 'a', sk: 'b' }],
  });

  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);

  const event = { routeKey: 'GET /recipe', queryStringParameters: { id: 'some recipe id' }, body: JSON.stringify({ value: 'some value' }) };

  const result = await lambda_handler(event);

  expect(result).toStrictEqual({
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ pk: 'a', sk: 'b' }])
  });
});

