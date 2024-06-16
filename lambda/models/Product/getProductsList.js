exports.handler = async function (event) {
    const products = [
      { id: 1, name: "Iphone 15 Pro Max", price: 2000 },
      { id: 2, name: "Samsung Galaxy S24 Ultra", price: 1900 },
      { id: 3, name: "Samsung Galaxy S22 Ultra", price: 1200 },
    ];
      return {
        statusCode: 200,
        body: JSON.stringify(products),
    };
}