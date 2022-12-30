const axios = require("axios");
const getDb = require('../utils/dbconnection');
const getToken = require('./getToken')
module.exports =  async () =>{
  try{
    const db= await getDb();
        const collection = db.collection('supUsers');
        const users = await collection.find().toArray();
        users.forEach(user=>{
          if(user.jobtitle === "HR Executive" && user.name === "Sanskriti Bhatnagar") user['slack_id'] = "U040M644EKT"
          if(user.jobtitle === "HR Executive" && user.name === "Isha Tadhiyal") user['slack_id'] = "U04031UQKQT"
          if(user['slack_id'] === "UC48M1TAT") user.role = ""
          if(user.role === "manager" && user.username === "deepak") user["slack_id"] = "U0FJSLHB3"
          if(user.role === "manager" && user.username === "saurabhk_etech") user["slack_id"] = "U3NR87BDY"
          if(user.role === "manager" && user.username === "aayush_saini") user["slack_id"] = "UGH20TBN2"

        })
     return users
  }catch(err){throw err}
   
  }