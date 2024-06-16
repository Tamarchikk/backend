const { Stack } = require('aws-cdk-lib');
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
    // Define the Lambda function for getProductsList
    const getProductsList = new lambda.Function(this, 'GetProductsList', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler',
    });
    // Define the Lambda function for getProductsById
    const getProductsById = new lambda.Function(this, 'GetProductsById', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsById.handler'
    })
    // Define the API Gateway REST API
      const api = new apigateway.RestApi(this, 'ProductApi', {
        restApiName: 'Product Service',
        description: 'This service serves products.'
      });
    // Integrate the Lambda function with API Gateway for /products endpoint
    const products = api.root.addResource('products');
    const getProductsIntegration = new apigateway.LambdaIntegration(getProductsList, {
      requestTemplates: { 'application/json': '{"statusCode": "200" }'}
    });
    products.addMethod('GET', getProductsIntegration);
    // Integrate the Lambda function with API Gateway for /products/{productId} endpoint
    const product = products.addResource('{productId}');
    const getProductsByIdIntegration = new apigateway.LambdaIntegration(getProductsById, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }'}
    });
    product.addMethod('GET', getProductsByIdIntegration);
  }
}

module.exports = { AwsStack };

