import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const lambda_handler = async (event) => {
  try {
    // Parse the request body from API Gateway
    const { body } = event;
    const { logData } = JSON.parse(body);

    // Create an instance of the S3 client
    const s3Client = new S3Client({ region: 'us-east-1' }); // Replace with your desired region

    // Set the S3 bucket name and key
    const bucketName = 'recipe-app-code'; // Replace with your S3 bucket name
    const key = 'logs/logfile.txt'; // Replace with your desired S3 bucket key/path

    // Prepare the parameters for the S3 PutObject command
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: logData,
    };

    // Execute the S3 PutObject command
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return a success response
    return {
      statusCode: 200,
      body: 'Log data written to S3',
    };
  } catch (error) {
    // Return an error response if any exception occurs
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error writing log data to S3',
        error: error.message,
      }),
    };
  }
};
