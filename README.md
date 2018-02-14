# Hackathon Startpack Steps

This will go over the steps gone through in the application

# Step 1

Create a Heroku account and make sure you have the Heroku CLI
Then, invoke: 

    heroku login

Be warned that the first time you do it, it may take some time as it will update itself and you need to issue this command in either command prompt or PowerShell (not Git Bash)

Modify `app.get('/sms/ ...)` to use `res.render` instead of `res.json`

Run to see that your app displays HTML instead of a JSON response

    npm start

If it works out great, let's create a commit and create a Heroku app

    git add -am 'use render instead of json'
    heroku create

Now, let's push:

    git push heroku master

# Step 2

We need setup to accept POST requests from Twilio

Let's install twilio:

    npm install --save twilio

Now, we can create [Twilio responses](https://www.twilio.com/docs/api/twiml/sms/your_response).
These will be used to send something back to the user:

1. Make a Twilio account. You may need to make a project.
2. Go to programmable SMS and get a number (any number)
3. Home -> Manager Number -> Click your number -> Change the webhook to for SMS to your herokuendpoint.heroku.com/sms
4. Send a text message to your number



# Step 3
