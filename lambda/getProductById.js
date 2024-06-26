const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { productResponse } = require("./utility");

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;
const client = new DynamoDBClient({ region: "eu-central-1" });
const dynamoDB = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log("Received event:", event);

  const id = event.pathParameters?.id;
  if (!id) {
    return productResponse(400, { message: "Product ID is required" });
  }

  try {
    const productData = await dynamoDB.send(
      new GetCommand({
        TableName: PRODUCTS_TABLE_NAME,
        Key: { id },
      })
    );
    const stockData = await dynamoDB.send(
      new GetCommand({
        TableName: STOCKS_TABLE_NAME,
        Key: { product_id: id },
      })
    );
    if (!productData.Item) {
      return productResponse(404, { message: "Product not found" });
    }
    const combinedData = {
      ...productData.Item,
      stockCount: stockData.Item ? stockData.Item.count : 0,
    };

    return productResponse(200, combinedData);
  } catch (error) {
    console.error("Error fetching product:", error);
    return productResponse(500, { message: "Internal server error" });
  }
};
