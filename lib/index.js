const { Stack, CfnOutput } = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const apigateway = require('aws-cdk-lib/aws-apigatewayv2');
const integrations = require('aws-cdk-lib/aws-apigatewayv2-integrations');

class ProductService extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const lambdaGetProductsList = new lambda.Function(this, 'listProducts', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler',
      environment: {
        PRODUCTS_TABLE_NAME: "Product",
        STOCKS_TABLE_NAME: "Stock",
      },
    });

    const createProductFunction = new lambda.Function(this, 'createProduct', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'createProduct.handler',
      environment: {
        PRODUCTS_TABLE_NAME: "Product",
        STOCKS_TABLE_NAME: "Stock",
      },
    });

    const LambdaGetProductById = new lambda.Function(this, 'getProductById', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductById.handler',
      environment: {
        PRODUCTS_TABLE_NAME: "Product",
        STOCKS_TABLE_NAME: "Stock",
      },
    });

    const policy = new iam.PolicyStatement({
      actions: [
        'dynamodb:Scan',
        'dynamodb:Query',
        'dynamodb:UpdateItem',
        'dynamodb:PutItem',
        'dynamodb:GetItem',
      ],
      resources: [
        'arn:aws:dynamodb:eu-central-1:590184139356:table/Product',
        'arn:aws:dynamodb:eu-central-1:590184139356:table/Stock',
      ],
    });

    const api = new apigateway.HttpApi(this, 'Api', {
      description: 'products',
      corsPreflight: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: [apigateway.CorsHttpMethod.GET, apigateway.CorsHttpMethod.POST, apigateway.CorsHttpMethod.OPTIONS],
      },
    });

    lambdaGetProductsList.addToRolePolicy(policy);
    createProductFunction.addToRolePolicy(policy);
    LambdaGetProductById.addToRolePolicy(policy);

    api.addRoutes({
      path: '/products',
      methods: [apigateway.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration('getListProducts', lambdaGetProductsList),
    });

    api.addRoutes({
      path: '/products/{id}',
      methods: [apigateway.HttpMethod.GET],
      integration: new integrations.HttpLambdaIntegration('GetByIdProducts', LambdaGetProductById),
    });

    api.addRoutes({
      path: '/products',
      methods: [apigateway.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration('createProduct', createProductFunction),
    });

    new apigateway.HttpStage(this, 'prod', {
      httpApi: api,
      stageName: 'prod',
      autoDeploy: true,
    });

    new CfnOutput(this, 'ApiUrl', {
      value: api.apiEndpoint,
    });
  }
}

module.exports = { ProductService };
