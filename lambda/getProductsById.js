exports.handler = async function (event) {
  const products = [
    { id: 1, name: "Iphone 15 Pro Max", price: 2000 },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 1900 },
    { id: 3, name: "Samsung Galaxy S22 Ultra", price: 1200 },
  ];
  const productId = event.pathParameters.productId;
  const product = products.find((p) => p.id == productId);
  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Product not found" }),
    };
  }
};
