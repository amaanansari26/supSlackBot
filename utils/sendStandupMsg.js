const { WebClient, LogLevel } = require("@slack/web-api");
const getToken = require("./getToken");
exports.toTeamLeads= async (team, channels)=>{
    const client = new WebClient(
      await getToken(),
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
                  "text": "Submit Standup"
                },
                "style": "primary",
                "value": "standup_tmlds"
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

  exports.toHrs= async (team, channels)=>{
    const client = new WebClient(
      await getToken(),
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
                  "text": "Submit Standup"
                },
                "style": "primary",
                "value": "standup_hrs"
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

  exports.toEmployees= async (team, channels)=>{
    const client = new WebClient(
      await getToken(),
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
                  "text": "Submit Standup"
                },
                "style": "primary",
                "value": "standup_emps"
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

  exports.toAnuj= async (team, channels)=>{
    const client = new WebClient(
      await getToken(),
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
                  "text": "Submit Standup"
                },
                "style": "primary",
                "value": "standup_anuj"
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