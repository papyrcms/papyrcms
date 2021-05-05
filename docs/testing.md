## Testing

So far, end-to-end tests have been written for Papyr CMS using Mocha. They have been written so that any data used in the tests is designed to be created and deleted specifically for the tests, so, assuming everything passes, no other data should be touched. There are only a couple prerequisites to run the tests:

- An admin user needs to exist.
- In `dev.js`, add the following block of code:

```
  test: {
    oldPass: "",
    newPass: "",
    token: "",
    tokenRpc: ""
  }
```

- `oldPass` is the admin user's password
- `newPass` is any other string to change the admin user's password to
  - This can be the same as `oldPass` in order to run the test back-to-back
- `token` is the admin user's JWT. This can be obtained by logging into the admin's account, and entering in the console `localStorage.getItem('token')
- `tokenRpc` is a token passed in the url when requesting a password change. This can be obtained by requesting a password change for the admin user, and then getting the token from the link provided in the email.
- A content post with the post tags "email-template, welcome" is required.

inb4 - it works on my machine.
