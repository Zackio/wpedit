'use babel';

import WpeditView from './wpedit-view';
import { CompositeDisposable } from 'atom';
import request from 'request';

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
      'wpedit:fetch': () => this.fetch()
    }));
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

  fetch() {
    let editor;
    let selection;
    if (editor = atom.workspace.getActiveTextEditor()) {
      selection = editor.getSelectedText();

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
