## Getting Started

Starting a Papyr website can be super quick and easy. In order to follow these instructions, you'll need git, nvm, and npm.

### Environment Setup

Fork or copy the repo and clone it into your own environment. Next, run `nvm use` to make sure you're using the right Node version (lower versions can cause problems with Node's debugger with Next. If you insist on a lower version and have problems running it, try removing `NODE_OPTIONS=\"--inspect\"` from the start script). Then run `npm install`.

### Config Variables

Navigate to `src/config` and copy `dev.empty.ts` into a new file called `dev.ts`. Starting off, you only need:

```
rootURL: "http://localhost:5000",
jwtSecret: "some-secret-key",
databaseDriver: "postgres", // or your preferred database
databaseURI: "postgres://{username}:{password}@localhost:5432/papyrcms", // or your preferred database
```

You can read up on the rest of the file at [Config](https://github.com/drkgrntt/papyr-cms/blob/master/docs/config.md).

Once these variables are set, run `npm run dev` to start things up.

### Init

With the server running, on a fresh database, you should be able to navigate to `http://localhost:5000/init` (This page is unavailable if your database has any users, posts, or pages). Fill out this form to start populating the site with some starter content and to set an admin user.

From here, you can create more content, build pages, and customize things as you see fit through your [Admin Dashboard](https://github.com/drkgrntt/papyr-cms/blob/master/docs/admin-dashboard.md)
