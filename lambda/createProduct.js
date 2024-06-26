const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
const { productResponse } = require("./utility");

const client = new DynamoDBClient({ region: "eu-central-1" });
const dynamoDB = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;

exports.handler = async (event) => {
  console.log("Received event:", event);

  try {
    const { title, description, price, count } = JSON.parse(event.body || "{}");

    if (!title || !description || !price || !count) {
      return productResponse(400, {
        message: "Missing parameters: title, description, price, count",
      });
    }

    const id = randomUUID();
    const productItem = {
      TableName: PRODUCTS_TABLE_NAME,
      Item: {
        id: id,
        title,
        description,
        price,
      },
    };

    const stockItem = {
      TableName: STOCKS_TABLE_NAME,
      Item: {
        product_id: id,
        count,
      },
    };

    const transactItems = [{ Put: productItem }, { Put: stockItem }];

    await dynamoDB.send(
      new TransactWriteCommand({ TransactItems: transactItems })
    );

    return productResponse(201, {
      message: "Product created successfully",
      product: productItem.Item,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return productResponse(500, {
      message: "Internal server error",
      error: error.message,
    });
  }
};
