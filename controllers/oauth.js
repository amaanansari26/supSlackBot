const getDb = require('../utils/dbconnection');
const axios = require('axios');
exports.auth = async(req,res)=>{
    const code = req.query.code;
    const client_id = '4469953600193.4523027525831';
    const client_secret = '193d12f7a82d2aad353d66cc3f3eada3';
    const data = await axios.get(`https://slack.com/api/oauth.v2.access?code=${code}&client_id=${client_id}&client_secret=${client_secret}`);
    const oauth = data.data;
    if(oauth['access_token']){
        const db= await getDb();
        const collection = await db.collection('supSlackToken');
        const token = await collection.findOne();
        token.slack_token = oauth['access_token']
        console.log(await collection.updateOne({_id:token._id},{$set:token},{ upsert: true }))
        return res.status(200).send('app is installed')
    }
    return res.status(500).send('internal server error')
}