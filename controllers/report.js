const axios = require("axios");
require('dotenv').config();
const { WebClient, LogLevel } = require("@slack/web-api");
const { MongoClient } = require("mongodb");
const slackClient = new WebClient(
  process.env.BOTTOKEN,
  {
    logLevel: LogLevel.DEBUG,
  }
);
const url =
  "mongodb+srv://xmage:xmage@cluster0-xooqb.mongodb.net/slack_settings_test?retryWrites=true";
const client = new MongoClient(url);
const dbName = "test";
module.exports.sendReport = async (req, res) => {
  
  let jsonData = JSON.parse(req.body.payload);
  const response = {};
  response.selectedChannels = jsonData.state.values.section678["actionId-0"].selected_options.map(option=>{
    return {
      channelName: option.text.text,
      channelId: option.value
    }
  });
  const keys= Object.keys(jsonData.state.values)
  response.user  = jsonData.user;
  response.q1 = jsonData.state.values[keys[0]].plain_text_input.value;
  response.q2 = jsonData.state.values[keys[1]].plain_text_input.value;
  response.q3 = jsonData.state.values[keys[2]].plain_text_input.value;
  response.q4 = jsonData.state.values[keys[3]].plain_text_input.value;
  response.q5 = jsonData.state.values[keys[4]].plain_text_input.value;
  response.q6 = jsonData.state.values[keys[5]].plain_text_input.value;
  await client.connect();
  const db = client.db(dbName);
  await db.collection("repots").insertOne(response)
  for( ch of response.selectedChannels){
    await run(ch.channelId).catch((err) => console.log("err=====================>",err));
  }

  
  res.status(200).send("message saved");
    
  async function run(channel_id) {
    const url = "https://slack.com/api/chat.postMessage";
    await axios.post(
      url,
      {
        channel: channel_id,
        username:"sup",
        type: "modal",
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
            type: "header",
            text: {
              type: "plain_text",
              text: "Did you add any new projects this week? If yes provide details",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.q1}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "How is your new project pipeline looking like? How many clients in progress",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.q2}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Did any projects get closed this week? If yes, provide details on feedback and reason.",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.q3}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Are you hiring more people for your team? If yes, how is your hiring pipeline looking like? Did anyone join your team this week",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.q4}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Did you add any small tech upgrade in your team? If yes what? If not why?",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.q5}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "How are you feeling today?",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.q6}`,
              emoji: true,
            },
          },
        ],
      },
      { headers: { authorization: `Bearer ${process.env.BOTTOKEN}` } }
    )
  }
};
