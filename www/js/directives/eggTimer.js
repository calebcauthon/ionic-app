var eggTimer = function() {
  var self = this;

  return {
    scope: {},
    templateUrl: 'js/views/eggTimer.html',
    replace: true,
    controller: 'eggTimerCtrl',
    controllerAs: 'ctrl'
  };
}

commandEntry.prototype