require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const getDb = require('./utils/dbconnection');
const run = require('./utils/sendStandupMsg');
const getChannelListOfUser = require('./utils/getChannelListOfUser')

async function getUsers() {
  const db = await getDb()
  let collection = await db.collection("users").find().toArray();
  return collection;
}


app.use(
  express.json({
    limit: "500mb",
    extended: true,
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    parameterLimit: 50000,
    extended: true,
  })
);
app.use(
  cors({
    origin: true,
  })
);

//routes
app.use("/", route);



// cron.schedule("0 10 * * 1-5", function () {
  (async () => {
    let data = await getUsers();
    // for (let i = 0; i <= data.length - 1; i++) {
    //   console.log('==============================')
    //   const channels = await getChannelListOfUser(data[i].slack_id)
    //   run(data[i].slack_id, channels).catch((err) => console.log(err));
    // }
    for(user of ['U04DU23UTUZ']){
      try{
        const channels = await getChannelListOfUser(user);
        console.log(channels)
      run(user, channels).catch((err) => console.log(err));
      }catch(err){
        console.log(err)
      }
        
    }
  })();
// });

cron.schedule("30 18 * * 1-5", function () {
  (async () => {
    let data = await getUsers();
    console.log(data, "dddd");
    for (let i = 0; i <= data.length - 1; i++) {
      run(data[i].slack_id).catch((err) => console.log(err));
    }
  })();
});

app.listen(8000);
