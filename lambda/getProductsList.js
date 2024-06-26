const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { productResponse } = require("./utility");

const client = new DynamoDBClient({ region: "eu-central-1" });
const dynamoDB = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;

exports.handler = async (event) => {
  console.log(event);

  try {
    const productsData = await dynamoDB.send(
      new ScanCommand({ TableName: PRODUCTS_TABLE_NAME })
    );
    const products = productsData.Items;

    if (!products || !products.length) {
      return productResponse(404, { message: "Products not found" });
    }

    for (const product of products) {
      const stockData = await dynamoDB.send(
        new GetCommand({
          TableName: STOCKS_TABLE_NAME,
          Key: { product_id: product.id },
        })
      );

      product.count = stockData.Item ? stockData.Item.count : 0;
    }

    return productResponse(200, products);
  } catch (error) {
    return productResponse(500, error);
  }
};
