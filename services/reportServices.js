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
  console.log(jsonData)
  const channels = await getChannelListOfUser(jsonData.user.id)
  if(jsonData.actions[0].value ==="report"){
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
        "text": "Select channels"
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
  const result = await slackClient.views.open({
    trigger_id: jsonData.trigger_id,
    view: {
      "type": "modal",
      "title": {
        "type": "plain_text",
        "text": "Sup Bot",
        "emoji": true
      },
      "submit": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true,
      },
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "blocks": [
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "sl_input",
          },
          "label": {
            "type": "plain_text",
            "text": "Did you add any new projects this week? If yes provide details"
          },
          "block_id":`${jsonData.response_url}`
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "sl_input",
          },
          "label": {
            "type": "plain_text",
            "text": "How is your new project pipeline looking like? How many clients in progress"
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "sl_input",
          },
          "label": {
            "type": "plain_text",
            "text": "Did any projects get closed this week? If yes, provide details on feedback and reason"
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "sl_input",
          },
          "label": {
            "type": "plain_text",
            "text": "Are you hiring more people for your team? If yes, how is your hiring pipeline looking like? Did anyone join your team this week"
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "sl_input",
          },
          "label": {
            "type": "plain_text",
            "text": "Did you add any small tech upgrade in your team? If yes what? If not why?"
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "sl_input",
          },
          "label": {
            "type": "plain_text",
            "text": "How are you feeling today?"
          }
        },
        channelsToSend,
      ]
    }
  });
  }else{
    console.log(jsonData.user)
    const userid = jsonData.user.id;
    for (ch of channels){
      const url = "https://slack.com/api/chat.postMessage";
      console.log(ch)
      await axios.post(
        url,
        {
          channel: ch.channelId,
          username:"sup",
          type: "section",
          text: `<@${userid}|cal> is not working today.`
        },
        { headers: { authorization: `Bearer ${process.env.BOTTOKEN}` } }
      )
    }
    await axios.post(
      jsonData.response_url,
      {
        "replace_original": true,
        type: "section",
        text: `Thank you for your response.`
      },
   );
  }
  
}

exports.formSubmission = async (jsonData)=>{
    const response = {};
    response.selectedChannels = jsonData.view.state.values.section678['actionId-0'].selected_options.map(option=>{
      return {
        channelName: option.text.text,
        channelId: option.value
      }
    });
    const keys= Object.keys(jsonData.view.state.values);
    // console.log(jsonData.view.state.values)
    // return
    response.user  = jsonData.user;
    response.q1 = jsonData.view.state.values[keys[0]].sl_input.value;
    response.q2 = jsonData.view.state.values[keys[1]].sl_input.value;
    response.q3 = jsonData.view.state.values[keys[2]].sl_input.value;
    response.q4 = jsonData.view.state.values[keys[3]].sl_input.value;
    response.q5 = jsonData.view.state.values[keys[4]].sl_input.value;
    response.q6 = jsonData.view.state.values[keys[5]].sl_input.value;
    const db = await getDb()
    await db.collection("repots").insertOne(response)
    const user = (await axios.get(`https://slack.com/api/users.info?user=${jsonData.user.id}`,{ headers: { authorization: `Bearer ${process.env.BOTTOKEN}` } })).data;
    for( ch of response.selectedChannels){
      await run(ch.channelId).catch((err) => console.log("err=====================>",err));
    }
    const response_url = jsonData.view.blocks[0].block_id
    await axios.post(
      response_url,
      {
        "replace_original": true,
        type: "section",
        text: `Thank you for your response.`
      },
   );
    return true;
    async function run(channel_id) {
      const url = "https://slack.com/api/chat.postMessage";
      console.log(await axios.post(
        url,
        {
          channel: channel_id,
          username:`${user.user.profile.display_name}`,
          icon_url: `${user.user.profile.image_original}`,
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
              "type": "divider"
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*1. Did you add any new projects this week? If yes provide details.*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${response.q1}`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*2. How is your new project pipeline looking like? How many clients in progress.*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${response.q2}`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*3. Did any projects get closed this week? If yes, provide details on feedback and reason.*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${response.q3}`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*4. Are you hiring more people for your team? If yes, how is your hiring pipeline looking like? Did anyone join your team this week.*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${response.q4}`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*5. Did you add any small tech upgrade in your team? If yes what? If not why?*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${response.q5}`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "*6. How are you feeling today?*",
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `>${response.q6}`,
              },
            },
          ],
        },
        { headers: { authorization: `Bearer ${process.env.BOTTOKEN}` } }
      ));

    }
}