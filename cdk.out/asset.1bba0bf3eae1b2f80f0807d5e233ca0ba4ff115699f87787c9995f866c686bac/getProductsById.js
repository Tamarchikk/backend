const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event) {
  const productsTable = process.env.PRODUCTS_TABLE;
  const stocksTable = process.env.STOCKS_TABLE;
  const productId = event.pathParameters.productId;

  try {
    const productData = await dynamoDB.get({
      TableName: productsTable,
      Key: { id: productId },
    }).promise();

    if (!productData.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ message: 'Product not found' }),
      };
    }

    const stockData = await dynamoDB.get({
      TableName: stocksTable,
      Key: { product_id: productId },
    }).promise();

    const product = {
      ...productData.Item,
      count: stockData.Item ? stockData.Item.count : 0,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
