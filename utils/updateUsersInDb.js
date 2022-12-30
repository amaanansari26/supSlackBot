const axios = require("axios");
const getDb = require('../utils/dbconnection');
const getToken = require('./getToken')
const getHeaders = async () => {
    return { headers: { authorization: `Bearer ${await getToken()}` } }
  };
module.exports =  async () =>{
  try{
    const data = await axios.get('https://slack.com/api/users.list',await getHeaders())
    const newUsers = data.data.members;
    const db= await getDb();
    const users = await db.collection('users').find({}).toArray();
    users.forEach((user,i)=>{
      newUsers.every(nuser=>{
        if(user.name === nuser['real_name']){

          users[i]['slack_id'] = nuser.id;
        }
        return true;
      })
    })
     await db.collection('supUsers').deleteMany({});
     await db.collection('supUsers').insertMany(users);
    

        //const users = await collection.find({"slack_id":"U0405L5FN2G"}).toArray();
     return []
  }catch(err){throw err}
   
  }