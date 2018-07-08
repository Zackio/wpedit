This package for the Atom editor allows you to fetch, update and create posts from within Atom.

If you would prefer to write your posts or pages in a text editor, then this plugin is for you.


## Why?

It allows you to do your markdown writing in a great markdown editor. It also allows you to
edit HTML in a text editor.

## Markdown

If you write it markdown, you either need to convert to HTML before publishing, or have a plugin like Jetpack doing that for you.

You can use the Markdown Preview command to copy as HTML, paste that over your markdown and then push. Unfortunitely, that's only one way I know of to do it in the editor.

## HTML

Writing HTML in the WP Editor isn't the best experience, doing that in Atom is pretty cool.

## Authentication

This plugin uses basic auth. Please use SSL to be secure. 

The basic auth plugin must be installed on site that you're publishing to: https://github.com/WP-API/Basic-Auth

## Settings

The settings are per project and are stored as a YML file in your project root as wpedit.yml.

So in your project root, create wpedit.yml then inside put the details of the site you want to post to.

For example

```YML
user: admin
pass: pass
url: http://localhost:8080/index.php/wp-json
```

## Pages

Create a page in your project folder, like `about.md` or `about.html`. Really just about what syntax highlighting you want, markdown or HTML.

Use frontend matter to set the details and put your body content after.

```html
---
title: This will be our title
type: page
---

<h1>Hey this is out body content</h1>

<p>But some stuff here</p>
```

If an ID is not set, then it will create a new one, if it is set, then it will update that post.

For example:

```md
---
title: This will be our title
id: 20
---
```

### Fetching

You can fetch a page with the wpedit: fetch command. You just need to have the id set as above. It will fetch the title and page content.

## Troubleshooting

Node replaces localhost with 127.0.0.1. This fails with the inbuild php server if set to localhost. Solution is to set php server to 127.0.0.1 instead.
