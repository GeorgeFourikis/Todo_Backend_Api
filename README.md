# Todo Backend API

## Usage

```
npm i
npm start
```

If the installation is correct, by running the start script, we see that the server is up and runing in Port 3030 and also that our scripts will run in advance to validate that we have some extensions needed for Postgresql and also that the 2 tables we need are created.

## IMPORTANT

In order to programmatically add the proper credentials for Postgresql, you should go to the following file and make sure the local DB can be reached [**configurations/db.js** in the client config object]

Also, keep in mind that if you would like to use envirnment variables, you should create an _.env_ file in the root folder and use the variables from there
