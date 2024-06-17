exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const products = [
  { id: 1, name: "Iphone 15 Pro Max", price: 2000, imageUrl: 'https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/tile/Apple-iPhone-15-Pro-lineup-hero-230912.jpg.news_app_ed.jpg' },
  { id: 2, name: "Samsung Galaxy S24 Ultra", price: 1900, imageUrl: 'https://images.samsung.com/in/smartphones/galaxy-s24-ultra/buy/product_color_gray.png' },
  { id: 3, name: "Samsung Galaxy S22 Ultra", price: 1200, imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ph/2202/gallery/ph-galaxy-s22-ultra-s908-sm-s908edrhphl-thumb-530760457?$480_480_PNG$' },
];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products),
    };
}