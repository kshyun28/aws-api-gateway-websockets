const { ApiGatewayManagementApi } = require("@aws-sdk/client-apigatewaymanagementapi");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const docClient = DynamoDBDocument.from(new DynamoDB());

const handler = async (event) => {
  try {
    const connections = await docClient.scan({
      TableName: process.env.WEBSOCKET_CONNECTIONS_TABLE,
      ProjectionExpression: "connectionId",
    });

    const api = new ApiGatewayManagementApi({
      endpoint: process.env.WEBSOCKET_ENDPOINT,
    });

    if (!connections.Items) {
      return { statusCode: 500 };
    }

    const postCalls = connections.Items.map(async ({ connectionId }) => {
      await api.postToConnection({
        ConnectionId: connectionId,
        Data: event.body,
      });
    });

    await Promise.all(postCalls);

    return { statusCode: 200, body: "Event sent" };
  } catch (error) {
    console.error("Failed to send event", { error });
    return { statusCode: 500, body: "Failed to send even." };
  }
};

module.exports = { handler };