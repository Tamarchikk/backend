const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    const body = JSON.parse(event.body);
    const {
        title,
        description,
        price
    } = body;

    if (!title || !price) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                message: 'Title and price are required'
            }),
        };
    }

    const id = uuid.v4();

    const newProduct = {
        id,
        title,
        description,
        price,
    };

    const params = {
        TableName: PRODUCTS_TABLE_NAME,
        Item: newProduct,
    };

    try {
        await dynamoDb.put(params).promise();
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify(newProduct),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                message: 'Could not create product',
                error
            }),
        };
    }
};