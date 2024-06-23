const AWS = require("aws-sdk");
const {
    v4: uuidv4
} = require("uuid");


const dynamodb = new AWS.DynamoDB.DocumentClient();

const productsTable = "Product";
const stocksTable = "Stock";

const products = [{
        id: uuidv4(),
        title: "Iphone 15 Pro Max",
        description: "Latest model of Iphone",
        price: 2000,
    },
    {
        id: uuidv4(),
        title: "Samsung Galaxy S24 Ultra",
        description: "Latest model of Samsung Galaxy",
        price: 1900,
    },
    {
        id: uuidv4(),
        title: "Samsung Galaxy S22 Ultra",
        description: "Previous model of Samsung Galaxy",
        price: 1200,
    },
];

const stocks = products.map((product) => ({
    product_id: product.id,
    count: Math.floor(Math.random() * 100) + 1,
}));

const insertData = async () => {
    try {
        for (const product of products) {
            await dynamodb
                .put({
                    TableName: productsTable,
                    Item: product,
                })
                .promise();
            console.log(`Inserted product: ${product.title}`);
        }

        for (const stock of stocks) {
            await dynamodb
                .put({
                    TableName: stocksTable,
                    Item: stock,
                })
                .promise();
            console.log(`Inserted stock for product_id: ${stock.product_id}`);
        }
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

insertData();