const {ObjectId} = require('mongodb')
const getDb = require('./dbconnection');
module.exports = async (user)=>{
    const db = await getDb();
    const reports = await db.collection('supStandup').find({"slack_id":user["slack_id"]},{_id : { $gt : ObjectId(Math.floor(new Date(new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+new Date().getDate())/1000).toString(16)+"0000000000000000") }}).toArray()
    if(reports && reports.length){
        return true;
    }
    return false;
}