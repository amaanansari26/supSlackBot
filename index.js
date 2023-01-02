require("dotenv").config();
const express = require("express");
const cron = require("node-cron");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const sendStandup = require('./utils/sendStandupMsg');
const sendReport = require('./utils/sendReportMsg');
const getUsersList = require('./utils/getUsersList');
const checkStandupToday = require('./utils/checkStandupToday')
const updateUserInDb = require('./utils/updateUsersInDb')


app.use(express.json({limit: "500mb",extended: true,}));
app.use(bodyParser.urlencoded({limit: "500mb",parameterLimit: 50000,extended: true,}));
app.use(cors({origin: true,}));

//routes
app.use("/", route);

//error handling
app.use((err, req, res, next) => {
  
  console.log(err)
  res.status(500).send('An error occurred!')
});

cron.schedule("30 9 * * 1-6", function () {
  (async () => {
    const users = await getUsersList()
    for(user of users){
      try{
        if(user.status ==="Enabled" && user["slack_id"] !== "U0FK0J6L9" && user["slack_id"] !== "U0FJQUFMG"){
          if(user.role === "manager"){
            await sendStandup.toTeamLeads(user['slack_id'])
          }else if(user.jobtitle === "HR Executive"){
            await sendStandup.toHrs(user['slack_id'])
          }else if(user['slack_id'] === 'UC48M1TAT'){
            await sendStandup.toAnuj(user['slack_id'])
          }else{
            await sendStandup.toEmployees(user['slack_id'])
          }
        }
      }catch(err){
        console.log(err)
      }
        
    }
  })();
});

cron.schedule("30 18 * * 1-6", function () {
  (async () => {
    const users = await getUsersList()
    for(user of users){
      if(await checkStandupToday(user)){
        try{
          if(user.status ==="Enabled"){
            if(user.role === "manager"){
            }else if(user.jobtitle === "HR Executive"){
              await sendReport.toHrs(user['slack_id'])
            }else if(user['slack_id'] === 'UC48M1TAT'){
              await sendReport.toAnuj(user['slack_id'])
            }else{
              await sendReport.toEmployees(user['slack_id'])
            }
          }
        }catch(err){
          console.log(err)
        }
          
      }
    }
  })();
});

// updateUserInDb()
app.listen(8000);


//job titles
//HR Executive
//ROLE 
//manager
