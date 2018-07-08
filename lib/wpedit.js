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
      'wpedit:create or update': () => this.processFile(),
      'wpedit:fetch': () => this.fetchToFile(),
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

  processFile() {

    if ( editor = atom.workspace.getActiveTextEditor() ) {

        const frontmatter = this.getFrontMatter(editor);

        if ( undefined === frontmatter.attributes.id ) {
          this.createFromFile( frontmatter );
        } else {
          this.updateFromFile( frontmatter );
        }

    }

  },

  getEditor() {
    return atom.workspace.getActiveTextEditor();
  },

  fetchToFile() {
    const frontmatter = this.getFrontMatter( this.getEditor()  );
    this.get_post( this.settings.url, frontmatter.attributes.id, this.getEditor(), (content) => {
      const builtFileContent = this.buildPageContentFromReturned( content );
      this.getEditor().selectAll();
      this.getEditor().insertText(builtFileContent);
    });
  },

  buildPageContentFromReturned( content ) {
      let returnContent = '---';
      returnContent += '\ntitle: ' + content.title.rendered;
      returnContent += '\nid: ' + content.id;
      returnContent += '\n---\n';
      returnContent += content.content.rendered;
      return returnContent;
  },

  getFrontMatter(editor) {
    const path = editor.getBuffer( ).file.path;
    const content = fs.readFileSync(path, 'utf-8');
    return fm(content);
  },

  updateFromFile( frontmatter ) {
      this.update( frontmatter.body, frontmatter.attributes.id, frontmatter.attributes.title );
  },

  createFromFile( frontmatter ) {

    let wp = this.wpapi();

      if( 'page' === frontmatter.attributes.type ) {
        wp
        .pages()
        .create({title: frontmatter.attributes.title, content: frontmatter.body })
        .then( (response, x, y, z) => {
          this.post = response.id;
          atom.notifications.addSuccess('Created: ' + frontmatter.attributes.title + ', ID: ' + response.id);
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
          atom.notifications.addSuccess('Created: ' + frontmatter.attributes.title + ', ID: ' + response.id);
        })
        .catch(e => {
          console.error('api error while creating page from file: ', e);
        });
      }

  },

  checkId() {
    console.log('id', this.post );
  },

  update(content, postID, title ) {
    let wp = this.wpapi();

    if (editor = atom.workspace.getActiveTextEditor()) {
      wp.posts().id( postID  ).update({
        content: content,
        title: title
      }).then(function( response ) {
        atom.notifications.addSuccess('Post has been updated: ' + response.id );
      })
    }
  },


  setGrammer(editor) {
    const buffer = editor.getBuffer();
    atom.grammars.assignLanguageMode(buffer, 'text.html.basic');
  },

  get_post( url, postID, editor, callback ) {
    const wp = this.wpapi();
    wp.posts().id( postID  ).get().then(function( response ) {
      atom.notifications.addSuccess('Post has been fetched: ' + response.id );
      callback(response);
    });
  },

};
