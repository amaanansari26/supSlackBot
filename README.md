Slack sup bot

Steps to configure the app.
1. clone the repository.
2. edit env:
      BOTTOKEN: Authorization token of slack bot.
      MONGO_UR: URI to connect Mongo DB.
      DBNAME: Database name.
3. Install dependencies using 'npm i' command.
4. Configure slack bot:
              1. Create a slack app.
              2. Add these scope to slack bot permissions : app_mentions:read, channels:manage, channels:read, chat:write, chat:write.customize and users:read.
              3. Copy OAuth token of the app and paste it in env.
              4. Configure interactivity request url to the url where node app is hosted for example : https://domain.xx/
              5. Add app to your slack workspace and add it to the groups you want it to be used.
5. Start using app by starting it with command 'npm start' or 'pm2 run index.js'
