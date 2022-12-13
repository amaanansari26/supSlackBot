const { WebClient, LogLevel } = require("@slack/web-api");
module.exports = async (team, channels)=>{
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
      process.env.BOTTOKEN,
      {
        logLevel: LogLevel.DEBUG,
      }
    );
  
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
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }