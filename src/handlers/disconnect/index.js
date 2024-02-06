const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const docClient = DynamoDBDocumentClient.from(new DynamoDB());

const handler = async (event) => {
  try {
    await docClient.delete({
      TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
      Key: {
        connectionId: event.requestContext.connectionId,
      },
    });

    return {
      statusCode: 200,
      body: "Disconnected",
    };
  } catch (error) {
    console.error("Failed to disconnect", { error });
    return {
      statusCode: 500,
      body: "Failed to disconnect",
    };
  }
};

module.exports = { handler };
