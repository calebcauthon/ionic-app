function commands() {
  var self = this;

  this.commands = [];
  this.onUpdateFns = [];

  return this;
}

this.onUpdateFns = [];
commands.prototype.onUpdate = function(fn) {
  this.onUpdateFns.push(fn);
}

commands.prototype.get = function() {
  return _.select(this.commands, function(command) {
    return command.enabled();
  });
}

commands.prototype.add = function(id, fn) {
  var self = this;

  var newCommand = new AddedCommand({
    id: id,
    action: fn
  });

  this.commands.push(newCommand);
  
  _.each(this.onUpdateFns, function(fn) {
    fn();
  });

  newCommand.onChange(function() {
    _.each(self.onUpdateFns, function(fn) {
      fn();
    });    
  });

  return newCommand;
}

function AddedCommand(data) {
  this.id = data.id;
  this.action = data.action;

  this.disabled = false;

  this.changeFns = [];
}

AddedCommand.prototype.onChange = function(fn) {
  this.changeFns.push(fn);
};

AddedCommand.prototype.change = function() {
  _.each(this.changeFns, function(fn) {
    fn();
  });
};

AddedCommand.prototype.enabled = function() {
  return !this.disabled;
};

AddedCommand.prototype.disable = function() {
  this.disabled = true;
  this.change();
}
AddedCommand.prototype.enable = function() {
  this.disabled = false;
  this.change();
}