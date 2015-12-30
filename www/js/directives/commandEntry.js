var commandEntry = function() {
  var self = this;

  return {
    scope: {},
    templateUrl: 'js/views/commandEntry.html',
    replace: true,
    controller: 'commandEntryCtrl',
    controllerAs: 'ctrl'
  };
}

commandEntry.prototype