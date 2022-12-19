<p>Slack sup bot</p>
<p>Steps to configure the app:</p>
<ol>
    <li>Clone the repository.</li>
    <li>Edit env:<ol>
            <li>BOTTOKEN: Authorization token of the slack bot.</li>
            <li>MONGO_UR: URI to connect Mongo DB.</li>
            <li>DBNAME: Database name.</li>
        </ol>
    </li>
    <li>Install dependencies using &apos;npm i&apos; command.</li>
    <li>Configure slack bot:<ol>
            <li>Create a slack app.</li>
            <li>2. Add these scopes to slack bot permissions : app_mentions:read, channels:manage, channels:read, chat:write, chat:write.customize and users:read.</li>
            <li>Copy OAuth token of the app and paste it in env.</li>
            <li>Configure interactivity request url to the url where node app is hosted for example : https://domain.xx/ .</li>
        </ol>
    </li>
    <li>Add the app to your slack workspace and add it to the groups you want it to be used.</li>
    <li>Start using the app with the command &apos;npm start&apos; or &apos;pm2 run index.js&apos;.</li>
</ol>
