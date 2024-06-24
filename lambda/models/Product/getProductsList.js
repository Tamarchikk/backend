const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async function (event) {
  console.log('Incoming request:', JSON.stringify(event));
  const productsTable = process.env.PRODUCTS_TABLE;
  const stocksTable = process.env.STOCKS_TABLE;

  try {
    const productsData = await dynamoDB.scan({ TableName: productsTable }).promise();
    const stocksData = await dynamoDB.scan({ TableName: stocksTable }).promise();

    const products = productsData.Items;
    const stocks = stocksData.Items;

    const result = products.map(product => {
      const stock = stocks.find(stock => stock.product_id === product.id);
      return {
        ...product,
        count: stock ? stock.count : 0,
      };
    });
    console.log('Products list:', JSON.stringify(result));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
