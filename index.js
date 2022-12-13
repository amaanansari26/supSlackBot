const { WebClient, LogLevel } = require("@slack/web-api");
const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { App } = require("@slack/bolt");
const route = require("./routes/routes");
const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://xmage:xmage@cluster0-xooqb.mongodb.net/slack_settings_test?retryWrites=true";
const client = new MongoClient(url);
const dbName = "test";
async function main() {
  await client.connect();
  const db = client.db(dbName);
  let collection = await db.collection("users").find().toArray();
  return collection;
}

require("dotenv").config();
app.use(
  express.json({
    limit: "500mb",
    extended: true,
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    parameterLimit: 50000,
    extended: true,
  })
);
app.use(
  cors({
    origin: true,
  })
);

app.use("/", route);

async function run(team, channels) {
  const channelsToSend = {
    "type": "section",
    "block_id": "section678",
    "text": {
      "type": "mrkdwn",
      "text": "Select channels to send"
    },
    "accessory": {
      "action_id": "actionId-0",
      "type": "multi_static_select",
      "placeholder": {
        "type": "plain_text",
        "text": "Select items"
      },
      "options": channels.map(ch=>{
        return {
          "text": {
            "type": "plain_text",
            "text": ch.channelName
          },
          "value": ch.channelId,
        }
      })
    }
  };
  const client = new WebClient(
    "xoxb-4469953600193-4503682360148-KflaxaUcL0yu586u9hdFlWkO",
    {
      logLevel: LogLevel.DEBUG,
    }
  );
  const channelId = "U04CSJHC23X";

  try {
    const result = await client.chat.postMessage({
      channel: team,
      username: "sup",
      text: "Hello Whatsup",
      title: {
        type: "plain_text",
        text: "My App",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Submit Report",
          },
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
            multiline: true,
            action_id: "plain_text_input",
          },
          label: {
            type: "plain_text",
            text: "Standup",
            emoji: true,
          },
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
            multiline: true,
            action_id: "plain_text_input",
          },
          label: {
            type: "plain_text",
            text: "Report",
            emoji: true,
          },
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
            multiline: true,
            action_id: "plain_text_input",
          },
          label: {
            type: "plain_text",
            text: "Remaining",
            emoji: true,
          }, 
        },
        
        channelsToSend
      ],
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

const getChannelListOfUser = async (userId) =>{
  let channels = []
  const url = "https://slack.com/api/users.conversations";
  const params = new URLSearchParams();
  params.append('user', userId);
  console.log(userId)
  
   const data =  await axios.post(
      url,
      params,
      { headers: { authorization: `Bearer xoxb-4469953600193-4503682360148-KflaxaUcL0yu586u9hdFlWkO`,
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
}

// cron.schedule("0 10 * * 1-5", function () {
  (async () => {
    let data = await main();
    console.log(data, "dddd");
    for (let i = 0; i <= data.length - 1; i++) {
      console.log('==============================')
      const channels = await getChannelListOfUser(data[i].slack_id)
      run(data[i].slack_id, channels).catch((err) => console.log(err));
    }
  })();
// });

cron.schedule("30 18 * * 1-5", function () {
  (async () => {
    let data = await main();
    console.log(data, "dddd");
    for (let i = 0; i <= data.length - 1; i++) {
      run(data[i].slack_id).catch((err) => console.log(err));
    }
  })();
});

app.listen(8000);
