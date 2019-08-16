module.exports = {
  stripePublishableTestKey: process.env.STRIPE_PUBLISHABLE_TEST_KEY,
  stripeSecretTestKey: process.env.STRIPE_SECRET_TEST_KEY,
  stripePublishableLiveKey: process.env.STRIPE_PUBLISHABLE_LIVE_KEY,
  stripeSecretLiveKey: process.env.STRIPE_SECRET_LIVE_KEY,

  gmailClientId: process.env.GMAIL_CLIENT_ID,
  gmailClientSecret: process.env.GMAIL_CLIENT_SECRET,
  gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN,

  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
  googleMapsKey: process.env.GOOGLE_MAPS_KEY,

  siteEmail: process.env.SITE_EMAIL,
  adminEmail: process.env.ADMIN_EMAIL,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  rootURL: process.env.ROOT_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT
}