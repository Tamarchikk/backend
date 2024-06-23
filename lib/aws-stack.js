const { Stack, RemovalPolicy } = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');

class AwsStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);


    const productsTable = new dynamodb.Table(this, 'ProductsTable', {
      tableName: 'Product',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });


    const stocksTable = new dynamodb.Table(this, 'StocksTable', {
      tableName: 'Stock',
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const getProductsList = new lambda.Function(this, 'GetProductsList', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda/models/Product'),
      handler: 'getProductsList.handler',
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      },
    });

    const getProductsById = new lambda.Function(this, 'GetProductsById', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda/models/Product'),
      handler: 'getProductsById.handler',
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
        STOCKS_TABLE: stocksTable.tableName,
      },
    });

    const createProduct = new lambda.Function(this, 'CreateProduct', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda/models/Product'),
      handler: 'createProduct.handler',
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
      },
    });

    productsTable.grantReadData(getProductsList);
    stocksTable.grantReadData(getProductsList);
    productsTable.grantReadData(getProductsById);
    stocksTable.grantReadData(getProductsById);
    productsTable.grantReadWriteData(createProduct);

    const api = new apigateway.RestApi(this, 'ProductApi', {
      restApiName: 'Product Service',
      description: 'This service serves products.'
    });

    const products = api.root.addResource('products');
    const getProductsIntegration = new apigateway.LambdaIntegration(getProductsList, {
      requestTemplates: { 'application/json': '{"statusCode": "200" }'}
    });
    products.addMethod('GET', getProductsIntegration);

    const product = products.addResource('{productId}');
    const getProductsByIdIntegration = new apigateway.LambdaIntegration(getProductsById, {
      requestTemplates: { 'application/json': '{"statusCode": "200" }'}
    });
    product.addMethod('GET', getProductsByIdIntegration);

     const createProductIntegration = new apigateway.LambdaIntegration(createProduct, {
      requestTemplates: { 'application/json': '{"statusCode": "200" }' },
    });
    products.addMethod('POST', createProductIntegration);
  }
}

module.exports = { AwsStack };
