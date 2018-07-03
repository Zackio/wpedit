THIS IS IN DEVELOPMENT

This package for the Atom editor allows you to fetch, update and create posts from within Atom.

It's functional, but it's early days.

This is a fun side project for me, controbutions welcome.

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

## Commands

Run the commands from the command palette. We have

### wpedit:create post

Which creates a post where the title is the content of the the open tab.

### wpedit:create page

Which creates a page where the title is the content of the the open tab.

### wpedit:fetch

Fetches a post using the post number. In the document you want to use, probably just a new untitled document, type the post number, then go to wpedit:fetch. This will pull in that post.

### wpedit:update

The post number from the fetch command will stay in memory until you close atom or fetch again. So when ever you call the update command after a fetch it will update that post with what ever content is in your active tab.

## Creating a new post or page

This assumes that you have set your auth details and installed the basic auth plugin as instructed above.

So say you are creating a page or post, you would open a new tab and enter the title for the post or page in the empty tab.

Then you would run the `wpedit:create post` or `wpedit:create page`.

You would then in that tab or another add content. When you run the `wpedit:update` command, it will update that post with the content of the current tab your in.

## Troubleshooting

Node replaces localhost with 127.0.0.1. This fails with the inbuild php server if set to localhost. Solution is to set php server to 127.0.0.1 instead.
