var mongoose = require("mongoose");
const conn = mongoose.connect(
  `mongodb+srv://xmage:xmage@cluster0-xooqb.mongodb.net/slack_settings_test?retryWrites=true`,
  {
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
exports.module = db;
