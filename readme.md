# NextJS CMS
NextJS CMS is a Javascript CMS. It requires some configuration to get fully setup.

## Setup
First (obviously), clone the repository and run `npm install` to get your node_modules.

### config/dev.js
Inside the /config directory, create a file called `dev.js`. When not in production, the app will refer to this file for all of its "keys". If you reference the sibling file `prod.js`, you will see that in production, environment variables are used. In `dev.js`, paste the following object, and add all of your own values.

    module.exports = {
      // Stripe
      stripePublishableTestKey: '',
      stripeSecretTestKey: ,
      stripePublishableLiveKey: '',
      stripeSecretLiveKey: '',
  
      // Gmail
      gmailClientId: '',
      gmailClientSecret: '',
      gmailRefreshToken: '',
  
      // Google Tools
      googleAnalyticsId: '',
      googleMapsKey: '',
  
      // Emails
      siteEmail: '',
      adminEmail: '',
  
      // Cloudinary
      cloudinaryCloudName: '',
      cloudinaryApiKey: '',
      cloudinaryApiSecret: '',
    
      // Mongo
      mongoURI: '',
              
      // Etc
      cookieKey: '',
      rootURL: '',
      jwtSecret: '',
      port: 3000
    }

Let's go through each of these keys and establish what their values should be:

#### Stripe
The following keys can be obtained through your Stripe Dashboard found at stripe.com.
* stripePublishableTestKey: This is your publishable key in Stripe's test mode
* stripeSecretTestKey: This is your publishable key in Stripe's test mode
* stripePublishableLiveKey: This is your publishable key in Stripe's test mode
* stripeSecretLiveKey: This is your publishable key in Stripe's test mode

#### Gmail
The following keys can be obtained by following the directions in [this](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1 "this") article.
* gmailClientId
* gmailClientSecret
* gmailRefreshToken

#### Google Tools
* googleAnalyticsId: This key can be obtained by creating a project in your google analytics dashboard.
* googleMapsKey: This key can be obtained through your Google APIs dashboard.

#### Emails
* siteEmail: This is the email address that will be used by the site to send emails. This should be the email you used for the Gmail keys.
* adminEmail: This is the email the site admin wants to receive site emails at. Emails like those coming from the contact form will be sent to this email.

#### Cloudinary
The following keys can be obtained by signing up for an account at cloudinary.com. After signing up, these keys will be in the Account Details section at the top of your dashboard.
* cloudinaryCloudName
* cloudinaryApiKey
* cloudinaryApiSecret

#### Mongo
The following key can be obtained by signing up for an account at mlab.com and creating a database, or by using your own local mongo db.
* mongoURI: The URI used by mongo for your database.

#### Etc
* cookieKey: A random string used to store user session data.
* jwtSecret: A random string used to sign JSON Web Tokens.
* rootURL: The root url of the site. In dev, this is often something like "http://localhost:3000". (Note: The trailing slash ("/") is not required here).
*  port: The port that the project is running on. Be sure the port matches the port in your rootURL if using localhost with a port.

### .env
The `.env` file may be created as a shortcut for pushing environment varialbes to Heroku. It is set up like any `.env` file. Info about using this file to push environment variables can be found below.

### Scripts
The following scripts live in `package.json`:

#### npm run dev
`npm run dev` can be run to start up the environment. It requires Nodemon to be installed.

#### npm run deploy
`npm run deploy` is simply a combination script to push the environment variables from the `.env` file to Heroku, and then to push the repository to Heroku. This is particularly useful if you added any new environment variables that need to go to Heroku. Otherwise, you can simply use `git push heroku master` to push the repo.

#### npm run build
`npm run build` is a standard build script for Next.js. Generally, you will not need to run this command in development, and it is built in to the `heroku-postbuild` script to push to production.

#### npm run heroku-config
`npm run heroku-config` is a script used for sending environment variables to Heroku. If you wish to send environment variables but not the repository to heroku, this is a useful script.

#### heroku-postbuild
`npm run heroku-postbuild` is a command you should never need to run. This exists for Heroku to run when you push to production.
