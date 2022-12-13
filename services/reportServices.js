const getChannelListOfUser = require('../utils/getChannelListOfUser');
const axios = require("axios");
const getDb = require('../utils/dbconnection');
const { MongoClient } = require("mongodb");
const { WebClient, LogLevel } = require("@slack/web-api");
const slackClient = new WebClient(
    process.env.BOTTOKEN,
    {
      logLevel: LogLevel.DEBUG,
    }
  );
exports.btnPress = async (jsonData)=>{
    const channels = await getChannelListOfUser(jsonData.user.id)
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
  const data =  await axios.post(
    jsonData.response_url,
    {
      "response_type": "ephemeral",
      "replace_original": false,
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
              text: "Did you add any new projects this week? If yes provide details",
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
              text: "How is your new project pipeline looking like? How many clients in progress",
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
              text: "Did any projects get closed this week? If yes, provide details on feedback and reason.",
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
              text: "Are you hiring more people for your team? If yes, how is your hiring pipeline looking like? Did anyone join your team this week",
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
              text: "Did you add any small tech upgrade in your team? If yes what? If not why?",
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
              text: "How are you feeling today?",
              emoji: true,
            }, 
          },
          channelsToSend
        ],
      
    },
 );
}

exports.formSubmission = async (jsonData)=>{
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
    const db = await getDb()
    await db.collection("repots").insertOne(response)
    for( ch of response.selectedChannels){
      await run(ch.channelId).catch((err) => console.log("err=====================>",err));
    }
  
    
  
      
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
}