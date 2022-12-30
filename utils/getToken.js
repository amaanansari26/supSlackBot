const getDb = require('./dbconnection');

module.exports = async ()=>{
    const db = await getDb();
    const token = await db.collection('supSlackToken').findOne();
    return token.slack_token;
}