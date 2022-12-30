const getChannelListOfUser = require('../utils/getChannelListOfUser');
const getToken = require('../utils/getToken');
const axios = require("axios");
const getDb = require('../utils/dbconnection');
const { WebClient, LogLevel } = require("@slack/web-api");


const getHeaders = async () => {
  return { headers: { authorization: `Bearer ${await getToken()}` } }
};

exports.standupBtnByTeamLeader = async (jsonData) => {
  try {
    const slackClient = new WebClient(
      await getToken(),
      {
        logLevel: LogLevel.DEBUG,
      }
    );
    const channels = await getChannelListOfUser(jsonData.user.id)
    if (jsonData.actions[0].value === "standup_tmlds") {
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
          "options": channels.map(ch => {
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
              "block_id": `${jsonData.response_url}`
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
              },
              "block_id": `${jsonData.actions[0].value}`
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
    } else {
      const userid = jsonData.user.id;
      for (ch of channels) {
        const url = "https://slack.com/api/chat.postMessage";
        await axios.post(
          url,
          {
            channel: ch.channelId,
            username: "sup",
            type: "section",
            text: `<@${userid}|cal> is not working today.`
          },
          await getHeaders()
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
  } catch (err) { throw err }


}


exports.standupBtnByHr = async (jsonData) => {
  try {
    const slackClient = new WebClient(
      await getToken(),
      {
        logLevel: LogLevel.DEBUG,
      }
    );
    const channels = await getChannelListOfUser(jsonData.user.id)
    if (jsonData.actions[0].value === "standup_hrs" || jsonData.actions[0].value === "report_hrs") {
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
          "options": channels.map(ch => {
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
                "text": "What task have you finished yesterday?"
              },
              "block_id": `${jsonData.response_url}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "What are you working on today?"
              },
              "block_id": `${jsonData.actions[0].value}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "What(if anything) is blocking your progress / Where are you stuck?"
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
                "text": "What should we not do, stop or change?"
              }
            },
            channelsToSend,
          ]
        }
      });
    } else {
      const userid = jsonData.user.id;
      for (ch of channels) {
        const url = "https://slack.com/api/chat.postMessage";
        await axios.post(
          url,
          {
            channel: ch.channelId,
            username: "sup",
            type: "section",
            text: `<@${userid}|cal> is not working today.`
          },
          await getHeaders()
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
  } catch (err) { throw err }


}

exports.standupBtnByEmployee = async (jsonData) => {
  try {
    const slackClient = new WebClient(
      await getToken(),
      {
        logLevel: LogLevel.DEBUG,
      }
    );
    const channels = await getChannelListOfUser(jsonData.user.id)
    if (jsonData.actions[0].value === "standup_emps") {
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
          "options": channels.map(ch => {
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
                "text": "What you worked on yesterday?"
              },
              "block_id": `${jsonData.response_url}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "What will you work on today?"
              },
              "block_id": `${jsonData.actions[0].value}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "Any Blockers?"
              }
            },
            channelsToSend,
          ]
        }
      });
    }else if(jsonData.actions[0].value === "report_emps"){
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
          "options": channels.map(ch => {
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
                "text": "What did you finish today?"
              },
              "block_id": `${jsonData.response_url}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "What is remaining?"
              },
              "block_id": `${jsonData.actions[0].value}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "How many hours did you spend on project tracker?"
              }
            },
            channelsToSend,
          ]
        }
      });
    }else {
      const userid = jsonData.user.id;
      for (ch of channels) {
        const url = "https://slack.com/api/chat.postMessage";
        await axios.post(
          url,
          {
            channel: ch.channelId,
            username: "sup",
            type: "section",
            text: `<@${userid}|cal> is not working today.`
          },
          await getHeaders()
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
  } catch (err) { throw err }


}

exports.standupBtnByAnuj = async (jsonData) => {
  try {
    const slackClient = new WebClient(
      await getToken(),
      {
        logLevel: LogLevel.DEBUG,
      }
    );
    const channels = await getChannelListOfUser(jsonData.user.id)
    if (jsonData.actions[0].value === "standup_anuj" || jsonData.actions[0].value === "report_anuj") {
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
          "options": channels.map(ch => {
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
                "text": "How many client interview were done today? Mention per technology."
              },
              "block_id": `${jsonData.response_url}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "On which profile did you bid on today?"
              },
              "block_id": `${jsonData.actions[0].value}`
            },
            {
              "type": "input",
              "element": {
                "type": "plain_text_input",
                "action_id": "sl_input",
              },
              "label": {
                "type": "plain_text",
                "text": "Any client close to converting?"
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
                "text": "Any project closed to today? whats feedback and reason?"
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
                "text": "Any clients converted today? If yes details"
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
    } else {
      const userid = jsonData.user.id;
      for (ch of channels) {
        const url = "https://slack.com/api/chat.postMessage";
        await axios.post(
          url,
          {
            channel: ch.channelId,
            username: "sup",
            type: "section",
            text: `<@${userid}|cal> is not working today.`
          },
          await getHeaders()
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
  } catch (err) { throw err }


}


exports.formSubmission = async (jsonData) => {
  try {
    const response_url = jsonData.view.blocks[0].block_id;
    const response = {};
    response.type = jsonData.view.blocks[1].block_id.split('_')[0];

    response.selectedChannels = jsonData.view.state.values.section678['actionId-0'].selected_options.map(option => {
      return {
        channelName: option.text.text,
        channelId: option.value
      }
    });
    const keys = Object.keys(jsonData.view.state.values);
    console.log(jsonData.view.blocks)
    const qa = [];
    jsonData.view.blocks.forEach((block, i) => {
      if (block.type === 'input') {
        qa.push({ question: block.label.text, answer: jsonData.view.state.values[keys[i]].sl_input.value })
      }
    })
    response.qA = qa;

    const db = await getDb()
    const userInDb = await db.collection('users').findOne({ "slack_id": jsonData.user.id });
    if(userInDb){
      response.user = userInDb._id;
    }else{
      response.user = jsonData.user.id;
    }
    response['created_at'] = new Date();
    if (response.type === 'standup') {
      await db.collection("supStandup").insertOne(response)
    } else {
      await db.collection("supReport").insertOne(response)
    }

    const user = (await axios.get(`https://slack.com/api/users.info?user=${jsonData.user.id}`, await getHeaders())).data;
    for (ch of response.selectedChannels) {
      await run(ch.channelId);
    }



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
      const qas = [{
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${response.type}:`,
        },
      }];
      qa.forEach(q => {
        qas.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: q.question,
          },
        });
        qas.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `>${q.answer}`,
          },
        },)
      })
      const url = "https://slack.com/api/chat.postMessage";
      console.log(await axios.post(
        url,
        {
          channel: channel_id,
          username: `${user.user.profile.display_name}`,
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
            ...qas
          ],
        },
        await getHeaders()
      ));

    }
  } catch (err) { throw err }

}