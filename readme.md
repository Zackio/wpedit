THIS IS IN DEVELOPMENT

This package for the Atom editor allows you to fetch, update and create posts from within Atom.

It's functional, but not at a release state yet.

## Why?

It allows you do your markdown writing is a great markdown editor. It also allows you to
edit HTML is a editor that feels a bit nicer.

## Markdown

Currently the grammar ( syntax ) is defaulting to HTML, but when you have a markdown file open, you can easily change the grammar to markdown. Just go to grammar selector in the command palette. If you write it markdown, you either need to convert to HTML before publishing, or have a plugin like Jetpack doing that for you. In the future. I would like this package to be able to do that for you.

You can use the Markdown Preview command to copy as HTML, paste that over your markdown and then push. Unfortunitely, that's only one way

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

## Commands

Run the commands from the command palette. We have

### wpedit:create

Which creates a post from the current tabs content

### wpedit:fetch

Fetches a post using the post number. In the document you want to use, probably just a new untitled document, type the post number, then go to wpedit:fetch. This will pull in that post.

### wpedit:update

The post number from the fetch command will stay in memory until you close atom or fetch again. So when ever you call the update command after a fetch it will update that post with what ever is in your active tab.
