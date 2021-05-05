## Config

Inside the /config directory, create a file called `dev.js`. When not in production, the app will refer to this file for all of its "keys". If you reference the sibling file `prod.js`, you will see that in production, environment variables are used. In `dev.js`, paste the following object, and add all of your own values.

```
    module.exports = {
      // Stripe
      stripePublishableKey: '',
      stripeSecretKey: ,

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

      // TinyMCE
      tinyMceKey: '',

      // Database
      databaseURI: '',
      databaseDriver: '',

      // Etc
      rootURL: '',
      jwtSecret: ''
    }
```

Let's go through each of these keys and establish what their values should be:

### Stripe (Only required for payment processing)

The following keys can be obtained through your Stripe Dashboard found at stripe.com. Be sure to use the test keys in development and the live keys in production.

- `stripePublishableKey`: This is your publishable key in Stripe
- `stripeSecretKey`: This is your publishable key in Stripe

### Gmail (Only required for emailing)

The following keys can be obtained by following the directions in [this](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1 'this') article.

- `gmailClientId`
- `gmailClientSecret`
- `gmailRefreshToken`

### Google Tools (Only required for their respective services)

- `googleAnalyticsId`: This key can be obtained by creating a project in your google analytics dashboard.
- `googleMapsKey`: This key can be obtained through your Google APIs dashboard.

### Emails (Only required for emailing)

- `siteEmail`: This is the email address that will be used by the site to send emails. This should be the email you used for the Gmail keys.
- `adminEmail`: This is the email the site admin wants to receive site emails at. Emails like those coming from the contact form will be sent to this email.

### Cloudinary (Only required for image uploading)

The following keys can be obtained by signing up for an account at cloudinary.com. After signing up, these keys will be in the Account Details section at the top of your dashboard.

- `cloudinaryCloudName`
- `cloudinaryApiKey`
- `cloudinaryApiSecret`

### TinyMCE

- `tinyMceKey`: An API key for Tiny MCE for use of the text editor.

### Database (Required for site use)

- `databaseURI`: The URI for your database.
- `databaseDriver`: The type of database you are using. The Mongoose and Sequelize ORMs are used here, so accepted strings are:

  - mongodb
  - mysql
  - mariadb
  - postgres

- `mongoURI` (deprecated): The MongoDB specific URI for your database.

### Etc (Required for site use)

- `jwtSecret`: A random string used to sign JSON Web Tokens.
- `rootURL`: The root url of the site. In dev, this is often something like "http://localhost:3000". (Note: The trailing slash ("/") is not required here).
