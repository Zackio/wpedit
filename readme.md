This package for the Atom editor allows you to fetch, update and create posts from within Atom.

If you would prefer to write your posts or pages in a text editor, then this plugin is for you.

This is a fun side project for me, contributions welcome.

## Why?

It allows you do your markdown writing is a great markdown editor. It also allows you to
edit HTML is a editor that feels a bit nicer.

## Markdown

Currently the grammar ( syntax ) is defaulting to HTML, but when you have a markdown file open, you can easily change the grammar to markdown. Just go to grammar selector in the command palette. If you write it markdown, you either need to convert to HTML before publishing, or have a plugin like Jetpack doing that for you. In the future. I would like this package to be able to do that for you.

You can use the Markdown Preview command to copy as HTML, paste that over your markdown and then push. Unfortunitely, that's only one way

## HTML

Writing HTML in the WP Editor isn't the best experience, doing that in Atom is pretty cool.

## Authentication

At the moment this is using basic auth for testing. Before release we'll change this for better security.

The basic auth plugin must be installed on site that you're publishing too. https://github.com/WP-API/Basic-Auth

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

If an ID is not set, then it will create a new one, if it is set, then it will update that post. If the id is set and you choose the option "fetch to file", it will fetch that post number from the server.

For example

```md
---
title: This will be our title
id: 20
---
```

## Troubleshooting

Node replaces localhost with 127.0.0.1. This fails with the inbuild php server if set to localhost. Solution is to set php server to 127.0.0.1 instead.
