# Sections

Sections are what populate a Papyr website. Aptly named, sections are components made up of smaller components that are the pieces of a landing page. They can be (and are) use as any other component, but are also specifically designed to be read by the page renderer.

Sections are made of two pieces: the component and the options. In order to have the section work with the page renderer, it is important to export the component from `/src/components/Sections/index.ts`, and to export the `options` object as "options" from the section file.

## The Component

The component is like any other React component. Whatever the purpose of your component, you build it here and make it the default export. Like any other component, the component can be as static or dynamic as you would like. The Contact Form, for instance, only takes a `className` prop, as it is a simple form with no real dynamic content. A more complicated section, the Strip Section for example, is a highly customizable and dynamic section.

### Default Props

The page renderer is built to pass each section the following props along with a description of what the renderer will pass them:

- `title` (the section title)
- `className` (the section wrapper class)
- `post` (the first post found in the array of posts filtered for this section)
- `posts` (the entire array of posts filtered for this section)
- `emptyTitle` (the section title)
- `emptyMessage` (a message listing the required tags for posts to have to be on display in this section)
- `alt` (the section title)

These currently exist to support the existing Sections as they are not all usually all populated with data at the same time. When creating a new section, you can expect these to be passed as props, along with any props defined in the `defaultProps` option in the options.

## The Options

The `options` are defined by the type `SectionOptions` as

```
[key: string]: {
  component: string
  name: string
  description: string
  inputs: string[]
  maxPosts?: number
  defaultProps: any
}
```

The `options` should be a non-default export from the section file in the form of the object containing one or many instances of the key-value pair defined above. This means that you can define multiple variations of a section component. For example, the strip section can have the images on the right, left, or alternating, so its `options` object contains three sets of options. The pieces of this object are as follows:

- `[key: string]` - The unique key of the section type.
- `component` - The name of the default export from this file so the renderer can dynamicly use the component.
- `name` - A human-friendly string to represent the component in a select dropdown input in the page builder.
- `description` - A human-friendly string to describe the section within the page builder.
- `inputs` - An array of the available inputs for the page builder. Currently, the builder only suppors 'className', 'maxPosts', 'tags', and 'title'.
- `maxPosts` - The maximum number of posts that should be allowed when filtering posts for this section. This is optionally undefined if "maxPosts" is a field that is available in the builder.
- `defaultProps` - An object of additional hardcoded props that should be included when this section is used in the page renderer. This is useful if you should reliably expect a cerain value in landing pages that you might want to be dynamic when the section is used in a custom component or page.
