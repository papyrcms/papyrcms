# Papyr CMS
Papyr CMS is a Javascript CMS using Node and React with the NextJS framework that is easily extendable. It requires a litle configuration of variables to run.

## Running the CMS

### Logging In

If you do not have an admin account yet, you can register an account by going to yourWebsiteName.com/login and filling out the registration form. Once you have done this, you will need to be made an admin in the database.

If you do have an admin account, simply navigate to yourWebsiteName.com/login and fill out the login form

### Admin Dashboard

You can access your admin dashboard by logging in with your admin account and then navigating to yourWebsiteName.com/admin, or by clicking "Profile" to get to your profile and then "Admin Dashboard" to get to your admin dashboard. The following options can be set from the admin dashboard:

-   Enable Menu
    -   This will make the header menu with login/profile visible to non-admin users.
-   Enable Blog
    -   This will enable read and write functionality to the website blog.
-   Enable Registration
    -   This will allow users to be able to register on your website.
-   Enable Commenting
    -   This will allow users to be able to comment on your blog.
-   Enable Emailing to Admin
    -   This will allow emails to be sent to the admin email.
-   Enable Emailing to Users
    -   This will allow emails to be sent to your users.
-   Enable Events
    -   This will enable read and write functionality to the website events
-   Enable Donations
    -   This enables users to be able to access the donation form.

### Pages

Pages are how you can design the different pages of your site. They all consist of the following attributes:

-   Page Title
    -   This will be displayed if it is in the Navigation Menu.
-   Page Route
    -   This is the URL route to get to that page. For example, to create a page at "[www.yourwebsite.com/about](http://www.yourwebsite.com/about)", make the page route "about"
-   Nav Menu Order
    -   This determines the order in the Navigation Menu that the page is placed. Leave it 0 to exclude from the Nav Menu.
-   Page Wrapper Classname
    -   You can enter some text here to add a class to the page if you want to add your own custom CSS.

Each page is also made up of Sections. Each section will have the following attributes (if they apply to the section):

-   Section Title
    -   This will be a title or header for the section.
-   Section Wrapper Classname
    -   You can enter some text here to add a class to the section if you want to add your own custom CSS.
-   Required post tags
    -   This is a comma-separated list of post tags in order to determine which content post(s) will fill out your section.
-   Maximum number of posts
    -   This is the maximum number of posts that will appear in the section.

There are several types of sections you can choose from. Below is a basic overview of the sections:

-   3 Card Section
    -   Title, media, and content of each post will be displayed
-   Video Section
    -   Title, media, and content of the post will be displayed
-   Strip Section
    -   Title, media, and content of each post will be displayed
-   Parallax Section
    -   Title, media, and content of the post will be displayed
-   4 Card Section
    -   Title, media, and content of each post will be displayed
-   Slideshow Section
    -   Title, media, and content of each post will be displayed
-   Maps Section
    -   The latitude coordinate for the map will require a post with the latitude coordinate as the title and tag "latitude".
    -   The longitude coordinate for the map will require a post with the longitude coordinate as the title and tag  "longitude".

### Content

Content posts are the main controller for your website content. Content posts can be created, read, edited, and deleted. Because of their multi-purpose nature, none of the fields are explicitly required to create a content post, though if all fields are left blank when submitted, the post will not be created. Website content is determined by what tags are given to content posts. Below are some special content posts to fill out your CMS.

#### Special posts

-   Header
    -   A post with the tag "section-header" will be used for the site header. Its title is the site title, content is the site subtitle, and image is the site logo in the nav menu.
-   Footer
    -   A post with the tag "section-footer" will be used for the site footer. Its title is the footer title and the content as the bottom footer text.
- Copyright
	- A post with the tag "copyright" is also used in the site footer. Its content is displayed at the very bottom of the footer for any copyright information.
-   Site Description
    -   An optional post with the tag "site-description" can be used as a website descriptor for SEO purposes. Content, image, and tags will be used.

### Additional post features
#### Notifications
Content posts with the "notification" tag will have their title and content displayed at the top of the website. All visitors can click the "x" on display to make it go away.

#### Bulk Emails
Content posts with the "bulk-email" and "email-template" tags will be sent to all users who are registered to the site.

#### Email Templates
Content posts with the "email-template" tag and other certain tags can be used as custom email templates for certain site activities:
- "welcome"
    - This is an email sent to a user when they register on the site. You can use "{{firstName}}" in place of a given user's first name.
- "forgot-password"
    - This is an email sent to a user when they submit that they have forgotten their password. You can use "{{passwordResetLink}}" in place of the user's password reset link.

### Ordering Content

You can determine the order your posts show up in using tags as well. Every section is set to look for tags that say "order-#" (replacing # with a number) and display them before posts that do not have any order tags. Posts with order tags will be displayed in numerical order as described by their tags.

### Blog

Blog posts work similarly to content posts, but with a few changes.

1.  A title and content are required in order to submit a blog post.

2.  Blog posts will only show up in the blog section of the website. If you would like for a blog post to also serve as website content, you will need to create a separate content post.

3.  Blog posts show up in order of published date. If you created a blog post a year ago, but only just published it today, it will show up near the top of your blog posts.

### Events

Event posts work similarly to content posts, but with a few changes.

1.  Events have an event date that needs to be set.

2.  Events show up in order of the event date, with the soonest event being at the top. Events no longer appear after their event date.

3.  Events have optional longitude and latitude coordinates to show a google map below the post in the post page.

4.  A title and date are required in order to submit an event post.

### Store

TODO - explain the store

## Development Setup
First (obviously), clone the repository and run `npm install` to get your node_modules.

### config/dev.js
Inside the /config directory, create a file called `dev.js`. When not in production, the app will refer to this file for all of its "keys". If you reference the sibling file `prod.js`, you will see that in production, environment variables are used. In `dev.js`, paste the following object, and add all of your own values.

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

      // Mongo
      mongoURI: '',

      // Etc
      cookieKey: '',
      rootURL: '',
      jwtSecret: ''
    }

Let's go through each of these keys and establish what their values should be:

#### Stripe
The following keys can be obtained through your Stripe Dashboard found at stripe.com. Be sure to use the test keys in development and the live keys in production.
* stripePublishableKey: This is your publishable key in Stripe
* stripeSecretKey: This is your publishable key in Stripe

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

#### MongoDB
The following key can be obtained by signing up for an account at mlab.com and creating a database, or by using your own local mongo db.
* mongoURI: The URI used by mongo for your database.

#### Etc
* cookieKey: A random string used to store user session data.
* jwtSecret: A random string used to sign JSON Web Tokens.
* rootURL: The root url of the site. In dev, this is often something like "http://localhost:3000". (Note: The trailing slash ("/") is not required here).

### Scripts
The following scripts live in `package.json`:

#### npm run dev
`npm run dev` can be run to start up the environment.

#### npm run test
`npm run test` will run all of the tests written.

#### npm run build
`npm run build` is a standard build script for Next.js. Generally, you will not need to run this command in development.

#### npm run start
`npm run start` is the start script used to run the production build.

#### npm run deploy
`npm run deploy` will push the most current master branch on your machine to all of your git remotes.


### Testing
So far, end-to-end tests have been written for Papyr CMS using Mocha. They have been written so that any data used in the tests is designed to be created and deleted specifically for the tests, so, assuming everything passes, no other data should be touched. There are only a couple prerequisites to run the tests:
- An admin user needs to exist.
- In `dev.js`, add the following block of code:
      test: {
        oldPass: "",
        newPass: "",
        token: "",
        tokenRpc: ""
      }
    - `oldPass` is the admin user's password
	- `newPass` is any other string to change the admin user's password to
	    - This can be the same as `oldPass` in order to run the test back-to-back
	- `token` is the admin user's JWT. This can be obtained by logging into the admin's account, and entering in the console `localStorage.getItem('token')
	`tokenRpc` is a token passed in the url when requesting a password change. This can be obtained by requesting a password change for the admin user, and then getting the token from the link provided in the email.
