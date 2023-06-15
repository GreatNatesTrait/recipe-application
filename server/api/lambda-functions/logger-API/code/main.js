import AWS from 'aws-sdk';

export const handler = async (event) => {
  try {
    // Parse the request body from API Gateway
    const { logData } = JSON.parse(event.body);

    // Configure the AWS SDK with your desired region
    AWS.config.update({ region: 'us-east-1' }); // Replace with your desired region

    // Create an instance of the S3 service
    const s3 = new AWS.S3();

    // Set the S3 bucket name and key
    const bucketName = 'recipe-app-code'; // Replace with your S3 bucket name
    const key = 'logs/logfile.txt'; // Replace with your desired S3 bucket key/path

    // Prepare the parameters for the S3 PutObject operation
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: logData,
    };

    // Put the log data into the S3 bucket
    await s3.putObject(params).promise();

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
