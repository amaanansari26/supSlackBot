const axios = require("axios");
const getToken = require('./getToken')
module.exports =  async (userId) =>{
  try{
    let channels = []
    const url = "https://slack.com/api/users.conversations";
    const params = new URLSearchParams();
    params.append('user', userId);
    params.append('types', 'public_channel,private_channel');
    
     const data =  await axios.post(
        url,
        params,
        { headers: { authorization: `Bearer ${await getToken()}`,
      "Content-Type":"application/x-www-form-urlencoded"
      } }
     );
     if(data.data.channels){
      channels = data.data.channels.map(ch=>{
        return {
          channelName:ch.name,
          channelId:ch.id,
        }
      })
     }
     return channels
  }catch(err){throw err}
   
  }