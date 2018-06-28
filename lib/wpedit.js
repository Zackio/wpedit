'use babel';

import WpeditView from './wpedit-view';
import { CompositeDisposable } from 'atom';
import request from 'request';
const fs = require('fs-plus');
const yaml = require('js-yaml');
var WPAPI = require( 'wpapi' );
var wp = new WPAPI({ endpoint: 'http://src.wordpress-develop.dev/wp-json' });

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

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'wpedit:fetch': () => this.fetch(),
      'wpedit:update': () => this.update(),
      'wpedit:create post': () => this.create(),
      'wpedit:create page': () => this.createPage(),
    }));

    if( atom.inDevMode() ) {

      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'wpedit:check id': () => this.checkId(),
      }));

    }

    this.setConfig();

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

  setConfig() {

    var content;

    try {
      this.settings = yaml.safeLoad(fs.readFileSync('/Users/zack/dev/playground/wpedit.yml', 'utf8'));
      json = JSON.stringify(config, null, 4);
      json = JSON.parse(json);
      return settings;
    } catch (e) {
      console.log(e);
      return false;
    }

  },

  wpapi() {
    return new WPAPI({
      endpoint: this.settings.url,
      // This assumes you are using basic auth, as described further below
      username: this.settings.user,
      password: this.settings.pass
    });
  },

  create() {
    let wp = this.wpapi();

    if (editor = atom.workspace.getActiveTextEditor()) {
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
