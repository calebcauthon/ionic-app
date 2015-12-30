function ux(commands) {
  var self = this;
  this.commands = commands;

  return self;
}
ux.prototype.tell = function (text) {
  _.chain(this.getCommands()).select(function(candidate) {
    return candidate.text == text;
  }).pluck('fn').each(function(fn) {
    fn();
  });
};

ux.prototype.getCommands = function() {
  return _.map(this.commands.get(), function(command) {
    return {
      text: command.id,
      fn: command.action
    };
  });
}