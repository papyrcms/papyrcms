## Content

Content posts are the main controller for your website content. Because of their multi-purpose nature, none of the fields are explicitly required to create a content post except for tags. Website content is determined by what tags are given to content posts. The post form has a tooltip with useful tags.

### Special content posts

- Header
  - A post with the tag "section-header" will be used for the site header. Its title is the site title, content is the site subtitle, and image is the site logo in the nav menu.
- Footer
  - A post with the tag "section-footer" will be used for the site footer. Its title is the footer title and the content as the bottom footer text.
- Copyright
  - A post with the tag "copyright" is also used in the site footer. Its content is displayed at the very bottom of the footer for any copyright information.
- Site Description
  - An optional post with the tag "site-description" can be used as a website descriptor for default SEO purposes.

### Notifications

Content posts with the "notification" tag will have their title and content displayed at the top of the website. You can also add the "persist" tag to have the notification show up each session, such as for a cookie notification.

### Bulk Emails

Content posts with the "bulk-email" and "email-template" tags will be sent to all users who are registered to the site and are subscribed.

### Email Templates

Content posts with the "email-template" tag and other certain tags can be used as custom email templates for certain site activities. Creating these posts will override the default templates.

- "welcome"
  - This is an email sent to a user when they register on the site. You can use "{{firstName}}" in place of a given user's first name.
- "forgot-password"
  - This is an email sent to a user when they submit that they have forgotten their password. You can use "{{passwordResetLink}}" in place of the user's password reset link.

### Ordering Content

You can determine the order your posts show up in using tags as well. Every section is set to look for tags that say "order-#" (replacing # with a number) and display them before posts that do not have any order tags. Posts with order tags will be displayed in numerical order as described by their tags.

[Blog](https://github.com/drkgrntt/papyr-cms/blob/master/docs/blog.md)
