'use babel';

import WpeditView from './wpedit-view';
import { CompositeDisposable } from 'atom';
import request from 'request';
const fs = require('fs-plus');
const yaml = require('js-yaml');
var WPAPI = require( 'wpapi' );
var wp = new WPAPI({ endpoint: 'http://src.wordpress-develop.dev/wp-json' });

// module.exports = {
//   config: {
//     someInt: {
//       type: 'integer',
//       "default": 23,
//       minimum: 1
//     }
//   }
// };
//
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
      'wpedit:put': () => this.put(),
    }));

    this.config();

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

  config() {

    var content;

    try {
      this.settings = yaml.safeLoad(fs.readFileSync('/Users/zack/dev/playground/wpedit.yml', 'utf8'));
      json = JSON.stringify(config, null, 4);
      json = JSON.parse(json);
      console.log(json.user);
      return settings;
    } catch (e) {
        console.log(e);
        return false;
    }

  },

  put() {

    var wp = new WPAPI({
      endpoint: this.settings.url,
      // This assumes you are using basic auth, as described further below
      username: this.settings.user,
      password: this.settings.pass
    });

    wp
  .posts()
  .create({title: 'hello world!'})
  .then(function (response, x, y, z) {
    console.log('testing wp response: ', response, x, y, z);
    atom.notifications.addSuccess('Good news! We put that there!');
  })
  .catch(e => {
    console.error('api error while posting to wp: ', e);
  });

//     wp.posts().create({
//     // "title" and "content" are the only required properties
//     title: 'Your Post Title',
//     content: 'Your post content',
//     // Post will be created as a draft by default if a specific "status"
//     // is not specified
//     status: 'publish'
// }).then(function( response ) {
//     // "response" will hold all properties of your newly-created post,
//     // including the unique `id` the post was assigned on creation
//     console.log( response.id );
// })

    // Read to put
  },

  fetch() {
    let editor;
    let selection;

    if (editor = atom.workspace.getActiveTextEditor()) {
      selection = editor.getBuffer().cachedText;
      editor.selectAll();
    }
    url = 'http://codelink.pro/wp-json/wp/v2/posts/' + selection;
    request(url, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        content = JSON.parse(body).content.rendered;

        if ( editor ) {
            editor.insertText(content);
            atom.notifications.addSuccess('Good news! We got that!');
        }
      }
    })

  }

};
