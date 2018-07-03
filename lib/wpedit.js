'use babel';

import WpeditView from './wpedit-view';
import { CompositeDisposable } from 'atom';
import request from 'request';
const fs = require('fs-plus');
const yaml = require('js-yaml');
const fm = require('front-matter');
const WPAPI = require( 'wpapi' );
const wp = new WPAPI({ endpoint: 'http://src.wordpress-develop.dev/wp-json' });

export default {

  wpeditView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.wpeditView = new WpeditView(state.wpeditViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.wpeditView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.findConfig();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'wpedit:create from file': () => this.createFromFile(),
      // 'wpedit:update': () => this.update(),
      // 'wpedit:create post': () => this.create(),
      // 'wpedit:create page': () => this.createPage(),
    }));

    if( atom.inDevMode() ) {

      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'wpedit:check id': () => this.checkId(),
      }));

    }


  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wpeditView.destroy();
  },

  serialize() {
    return {
      wpeditViewState: this.wpeditView.serialize()
    };
  },

  watchConfig( file ) {
    fs.watch(file, () => {
      this.setConfig( file );
    });
  },

  findConfig() {

    let projectPaths = atom.project.getPaths();

    projectPaths.forEach( (item) => {

      let file = item + '/wpedit.yml';

      if ( fs.existsSync(file) ) {
        this.setConfig( file );
        this.watchConfig( file );
        return;
      }

    });

  },

  setConfig( configFile ) {
    try {
      this.settings = yaml.safeLoad(fs.readFileSync( configFile, 'utf8'));
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  wpapi() {
    return new WPAPI({
      endpoint: this.settings.url,
      username: this.settings.user,
      password: this.settings.pass
    });
  },

  create() {
    let wp = this.wpapi();

    if ( editor = atom.workspace.getActiveTextEditor() ) {
      content = editor.getBuffer().cachedText;
      wp
      .posts()
      .create({title: content })
      .then( (response, x, y, z) => {
        this.post = response.id;
        atom.notifications.addSuccess('New post created: ' + content + '. ID: ' + response.id );
      })
      .catch(e => {
        console.error('api error while posting to wp: ', e);
      });
    }
  },

  createPage() {
    let wp = this.wpapi();

    if (editor = atom.workspace.getActiveTextEditor()) {
      content = editor.getBuffer().cachedText;
      wp
      .pages()
      .create({title: content })
      .then( (response, x, y, z) => {
        this.post = response.id;
        atom.notifications.addSuccess('New page created: ' + content + '. ID: ' + response.id );
      })
      .catch(e => {
        console.error('api error while posting a page to wp: ', e);
      });
    }
  },

  createFromFile() {

    let wp = this.wpapi();

    if (editor = atom.workspace.getActiveTextEditor()) {
      // Get file path of the one we are working with
      const path = editor.getBuffer( ).file.path;
      const content = fs.readFileSync(path, 'utf-8');
      const frontmatter = fm(content);

      if( 'page' === frontmatter.attributes.type ) {
        wp
        .pages()
        .create({title: frontmatter.attributes.title, content: frontmatter.body })
        .then( (response, x, y, z) => {
          this.post = response.id;
          atom.notifications.addSuccess('New page created: ' + content + '. ID: ' + response.id );
        })
        .catch(e => {
          console.error('api error while creating page from file: ', e);
        });
      } else {
        wp
        .posts()
        .create({title: frontmatter.attributes.title, content: frontmatter.body })
        .then( (response, x, y, z) => {
          this.post = response.id;
          atom.notifications.addSuccess('New post created: ' + content + '. ID: ' + response.id );
        })
        .catch(e => {
          console.error('api error while creating page from file: ', e);
        });
      }


    }

  },

  checkId() {
    console.log('id', this.post );
  },

  update() {
    let wp = this.wpapi();

    if (editor = atom.workspace.getActiveTextEditor()) {
      content = editor.getBuffer().cachedText;
      wp.posts().id( this.post ).update({
        content: content,
      }).then(function( response ) {
        atom.notifications.addSuccess('Post has been updated: ' + response.id );
      })
    }
  },

  setGrammer(editor) {
    const buffer = editor.getBuffer();
    atom.grammars.assignLanguageMode(buffer, 'text.html.basic');
  },

  get_post( url, post, editor ) {
    url = this.settings.url + '/wp/v2/posts/' + this.post;
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        content = JSON.parse(body).content.rendered;

        if ( editor ) {
          editor.insertText(content);
          atom.notifications.addSuccess('Good news! We got that!');
        }
      }
    })
  },

  fetch() {
    let editor;
    let selection;

    if (editor = atom.workspace.getActiveTextEditor()) {
      this.post = editor.getBuffer().cachedText;
      editor.selectAll();
    }

    this.setGrammer(editor);
    this.get_post( this.settings.url, this.post, editor );

  },

};
