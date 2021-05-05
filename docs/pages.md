## Pages

Pages are how you can design the different landing pages throughout your site. You can build new pages by clicking into the Page Builder from the Admin Dashboard.

### Options

Pages all consist of the following attributes:

- Page Title
  - This will be displayed if it is in the Navigation Menu.
- Page Route
  - This is the URL route to get to that page. For example, to create a page at "http://localhost:5000/about", make the page route "about"
- Nav Menu Order
  - This determines the order in the Navigation Menu that the page is placed. Leave it 0 to exclude from the Nav Menu. You can also use decimals to create submenus (EG: 10, 20.1, 20.2, 20.3, and 30 would create a menu of 3 items and a submenu of 3 items).
- Page Wrapper Classname
  - You can enter some text here to add a class to the page to scope styles to the page if you want to add your own custom CSS.
- Omit Default Header
  - You can check this box to omit the default header from the page.
- Omit Default Footer
  - You can check this box to omit the default footer from the page.

### Sections

Each page is also made up of [Sections](https://github.com/drkgrntt/papyr-cms/blob/master/docs/sections.md). Each section will have the following attributes (if they apply to the section):

- Section Title
  - This will be a title or header for the section. It will show up with most sections.
- Section Wrapper Classname
  - You can enter some text here to add a class to the section to scope custom styles if you want to add your own custom CSS.
- Required Post Tags
  - This is a comma-separated list of post tags in order to determine which content post(s) will fill out your section. All tags listed here must be included on the post(s).
- Maximum number of posts
  - This is the maximum number of posts that will appear in the section.

There are several types of sections you can choose from. Below is a basic overview of the sections:

- Card Sections
  - Title, media, and content of each post will be displayed.
- Strip Sections
  - Title, media, and content of each post will be displayed.
- Split Sections
  - Title, media, and content of each post will be displayed.
- Media Sections
  - Title, media, and content of each post will be displayed.
- Maps Section
  - The latitude coordinate for the map will require a post with the latitude coordinate as the title and tag "latitude".
  - The longitude coordinate for the map will require a post with the longitude coordinate as the title and tag  "longitude".
- Form Sections
  - Only the form will show up. These are usually accompanied by other sections.
- SEO Section
  - All content will be invisible, but will have an effect on SEO properties like site title and meta tags.

While Pages define page structure, pages use [Content](https://github.com/drkgrntt/papyr-cms/blob/master/docs/content.md) to fill themselves out.
