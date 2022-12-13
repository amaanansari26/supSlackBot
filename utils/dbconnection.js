const url = process.env.MONGO_URI
const { MongoClient } = require("mongodb");
const client = new MongoClient(url);


module.exports = async()=>{
    await client.connect();
    const db = client.db(process.env.DBNAME);
    return db
}