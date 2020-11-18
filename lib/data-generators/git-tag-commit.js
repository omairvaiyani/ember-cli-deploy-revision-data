var CoreObject  = require('core-object');
var gitRepoInfo = require('git-repo-info');
var RSVP        = require('rsvp');

module.exports = CoreObject.extend({
  init: function(options) {
    this._super();
    this._plugin = options.plugin;
  },

  generate: function() {
    var separator = this._plugin.readConfig('separator');
    var tagOnly = this._plugin.readConfig('tagOnly');
    var info = gitRepoInfo();

    if (info === null || info.root === null) {
      return RSVP.reject('Could not find git repository');
    }

    var tag = this._plugin.readConfig('tag') || info.tag || info.lastTag;
    var sha = info.sha.slice(0, 8);

    if (!tag || (!tagOnly && !sha)) {
      return RSVP.reject('Could not build revision with tag `' + tag + '` and commit hash `' + sha + '`');
    }

    return RSVP.resolve({
      revisionKey: tagOnly ? tag : tag + separator + sha,
      timestamp: new Date().toISOString()
    });
  }
});
