THIS IS IN DEVELOPMENT

This package for the Atom editor allows you to fetch, update and create posts from within Atom. 

It's functional, but not at a release state yet.

## Authentication

At the moment this is using basic auth for testing. Before release we'll change this for better security.

The basic auth plugin must be installed https://github.com/WP-API/Basic-Auth

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
