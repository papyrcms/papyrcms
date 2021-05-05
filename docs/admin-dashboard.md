## The Admin Dashboard

You can access your admin dashboard by logging in with your admin account and then navigating to http://localhost:5000/admin, or by clicking "Profile" to get to your profile and then "Admin Dashboard" to get to your admin dashboard.

### Options

The following options can be set from the admin dashboard:

- Enable Menu
  - This will make the header menu with login/profile visible to non-admin users.
- Enable Blog
  - This will enable read and write functionality to the website blog.
- Blog Menu Location
  - The position for "Blog" in the nav menu (0 to omit)
- Enable Registration
  - This will allow users to be able to register on your website.
- Enable Commenting
  - This will allow users to be able to comment on your blog.
- Enable Emailing to Admin
  - This will allow emails to be sent to the admin email.
- Enable Emailing to Users
  - This will allow emails to be sent to your users.
- Enable Events
  - This will enable read and write functionality to the website events
- Events Menu Location
  - The position for "Events" in the nav menu (0 to omit)
- Enable Store
  - This will enable read and write functionality to the website store
- Store Menu Location
  - The position for "Store" in the nav menu (0 to omit)

### User Management

All existing users can be viewed here. Users can be made admins, deleted, or banned.

- To make a user an admin grants super user privileges. Admin users can access, change, and delete any and all content in the entire site. Use this with caution.
- Deleting a user will remove them from the database. It will make the email address available to use for registration again.
- Banning a user will keep the user in the database, but not allow them to log in and will invalidate any current sessions.

### Messages

A full list of messages submitted via the contact form lives here as well. Messages can be deleted to keep things clean and organized if they have been dealt with.

### Site Content

The left sidebar of the admin dashboard contains links to view all individual posts (for content, pages, blogs, events, and products) and the pages to create these.

[Pages](https://github.com/drkgrntt/papyr-cms/blob/master/docs/pages.md)
