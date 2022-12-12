const axios = require("axios");
const { WebClient, LogLevel } = require("@slack/web-api");
const { MongoClient } = require("mongodb");
const slackClient = new WebClient(
  "xoxb-4469953600193-4503682360148-0pCufKAIrciAYb5Ilb8PBCoy",
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
  response.standUp = jsonData.state.values[keys[0]].plain_text_input.value;
  response.report = jsonData.state.values[keys[1]].plain_text_input.value;
  response.remaining = jsonData.state.values[keys[2]].plain_text_input.value;
  await client.connect();
  const db = client.db(dbName);
  await db.collection("repots").insertOne(response)
  for( ch of response.selectedChannels){
    await run(ch.channelId).catch((err) => console.log("err=====================>",err));
  }
  await slackClient.chat.postMessage({
    channel:response.user.id,
    text: "Your report is submitted"

  });
  res.status(200).send("message saved");
    
  async function run(channel_id) {
    const url = "https://slack.com/api/chat.postMessage";
    await axios.post(
      url,
      {
        channel: channel_id,
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
              text: "Stand Up",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.standUp}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Report",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.report}`,
              emoji: true,
            },
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Remaining Work",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "plain_text",
              text: `${response.remaining}`,
              emoji: true,
            },
          },
        ],
      },
      { headers: { authorization: `Bearer xoxb-4469953600193-4503682360148-0pCufKAIrciAYb5Ilb8PBCoy` } }
    )
  }
};
