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
            "type": "actions",
            "block_id": "btnpress",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit report"
                },
                "style": "primary",
                "value": "click_me_456"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Primary Button"
                },
                "style": "primary",
                "value": "click_me_456"
              }
            ]
          }
        ],
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }