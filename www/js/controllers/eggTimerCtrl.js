function eggTimerCtrl($scope, commands) {
  var self = this;

  this.$scope = $scope;
  $scope.timers = this.timers = [];

  commands.add('start a timer for 5 minutes', function() {
    var timer = self.startTimer(5 * 60);

    var pauseCommand = commands.add('pause the timer', function() {
      var unpauseCommand = commands.add('unpause the timer', function() {
        self.resumeTimer(timer);
        unpauseCommand.disable();
        pauseCommand.enable();
      });
      
      unpauseCommand.disable();

      return function() {
        self.pauseTimer(timer);
        pauseCommand.disable();
        unpauseCommand.enable();
      };
    }()); 

    window.showCommands = commands.get.bind(commands)
  });
}

eggTimerCtrl.prototype.pauseTimer = function(timer) {
  clearInterval(timer.interval);
};

eggTimerCtrl.prototype.resumeTimer = function(timer) {
  this.rollTimer(timer);
};

eggTimerCtrl.prototype.rollTimer = function(timer) {
  var self = this;
  var interval = setInterval(function() {
    if(timer.timeLeftInSeconds == 0) {
      clearInterval(timer.interval);
      return;
    }
    timer.timeLeftInSeconds--;
    timer.minutes = Math.floor(timer.timeLeftInSeconds / 60)
    timer.seconds = timer.timeLeftInSeconds % 60;

    self.$scope.$apply();
  }, 1000);

  timer.interval = interval;
};

eggTimerCtrl.prototype.startTimer = function(seconds) {
  var timer = {};
  timer.timeLeftInSeconds = seconds;
  timer.minutes = Math.floor(timer.timeLeftInSeconds / 60);
  timer.seconds = timer.timeLeftInSeconds % 60;

  this.rollTimer(timer);

  this.timers.push(timer);

  return timer;
};