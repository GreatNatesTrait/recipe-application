const { DynamoDBClient, GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const dynamoDBClient = new DynamoDBClient();

exports.handler = async (event, context) => {
  const records = event.Records;
  const putItemCommands = records.map(async (record) => {
    if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
      const recipeId = record.dynamodb.Keys.idMeal;
  console.log(recipeId);
      // Fetch the updated recipe from the RecipeTable
      const getParams = {
        TableName: 'RecipeTable',
        Key: {
          idMeal: recipeId 
        }
      };
      const recipe = await client.send(new GetItemCommand(getParams));

      if (recipe) {
        // Store the updated recipe in the cache table
        const putParams = {
          TableName: 'apiCacheTable',
          Item: {
            endpoint: recipeId ,
            response: { S: JSON.stringify(recipe) }
          }
        };

        await client.send(new PutItemCommand(putParams));
        console.log(`Cached response for ${recipeId}`);
      }
    }
  });

  await Promise.all(putItemCommands);
};
