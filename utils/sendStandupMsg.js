const { WebClient, LogLevel } = require("@slack/web-api");
module.exports = async (team, channels)=>{
    const client = new WebClient(
      process.env.BOTTOKEN,
      {
        logLevel: LogLevel.DEBUG,
      }
    );
  
    try {
      const result = await client.chat.postMessage({
        channel: team,
        text: "Can you provide update?",
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
              type: "plain_text",
              text: "Hey! Can you provide update for today?",
              emoji: true,
            },
          },
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
                "value": "report"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Not working today"
                },
                "style": "danger",
                "value": "not_working"
              }
            ]
          }
        ],
      });
    } catch (error) {
      console.error(error);
    }
  }