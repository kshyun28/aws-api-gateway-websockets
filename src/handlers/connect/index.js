const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const docClient = DynamoDBDocument.from(new DynamoDB());

const handler = async (event) => {
  try {
    await docClient.put({
      TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
      Item: {
        connectionId: event.requestContext.connectionId,
      },
    });

    return {
      statusCode: 200,
      body: "Connected",
    };
  } catch (error) {
    console.error("Failed to connect", { error });
    return {
      statusCode: 500,
      body: "Failed to connect",
    };
  }
};

module.exports = { handler };
