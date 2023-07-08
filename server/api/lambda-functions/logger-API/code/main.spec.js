import {mockClient} from 'aws-sdk-client-mock';
import { lambda_handler } from './main';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Mock = mockClient(S3Client);

beforeEach(() => {
  s3Mock.reset();
});

it('should write log to s3 bucket', async () => {
  s3Mock.on(PutObjectCommand).resolves({
    statusCode: 200,
    body: "Log data written to S3",
  });

  const result = await lambda_handler({
    body: 'some log'
  });

  
  expect(result).toStrictEqual({
    statusCode: 200,
    body: "Log data written to S3",
  });
});

