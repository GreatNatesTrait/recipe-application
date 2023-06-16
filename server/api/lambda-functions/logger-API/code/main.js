import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const lambda_handler = async (event) => {
  try {
    const s3Client = new S3Client({ region: "us-east-1" });
    const { body } = event;
    const requestBody = JSON.parse(body);

    const bucketName = "recipe-app-code";
    
    //const decodedFile = Buffer.from(requestBody, "base64");
    const now = new Date();
    const milliseconds = now.getMilliseconds();
    const timestamp = now.toISOString().replace('T', ' ').replace('Z', '');

    const fileTimestamp =  `${timestamp}.${milliseconds}`;
    const key = `logs/${fileTimestamp} logfile.txt`;

    const params = {
      Bucket: bucketName,
      Key: key,
      //Body: decodedFile
      Body: requestBody,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // Return a success response
    return {
      statusCode: 200,
      body: "Log data written to S3",
    };
  } catch (error) {
      console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error writing log data to S3",
        error: error.message,
      }),
    };
  }
};
