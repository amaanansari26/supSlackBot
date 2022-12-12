var mongoose = require("mongoose");
var { db } = require("../config/config");

var reports = mongoose.Schema(
  {
    user: {
      id:{
        type: String,
      },
      username:{
        type:String,
      },
      name:{
        type:String,
      },
      team_id:{
        type:String,
      },
    },
    selectedChannels: [{
      channelName:{
        type:String,
      },
      channelId:{
        type:String,
      }
    }],
    standUp: {
      type: String,
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
    remaining: {
      type: String,
      required: true,
    },
  },
  {
    strict: true,
    collection: "reports",
  }
);

module.exports = mongoose.model("reportsTest", reports);


