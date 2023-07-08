import { mockClient } from 'aws-sdk-client-mock';
import { lambda_handler } from './main';
import {
  DynamoDBDocumentClient,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";


it('GET /recipe should return some recipe data', async () => {

  const ddbMock = mockClient(DynamoDBDocumentClient);
  ddbMock.on(ScanCommand).resolves({
    Items: [{value:'some recipe data'}],
  });

  const event = { routeKey: 'GET /recipe', queryStringParameters: { id: 'some recipe id' } };

  const result = await lambda_handler(event);

  expect(result).toStrictEqual({
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{value:'some recipe data'}])
  });
});

