function chosenRecipe(commands, speak) {
  var self = this;
  self.speak = speak;
  self.commands = commands;

  self.onchangeFn = function() {};

  this.previouslyAddedIngredientCommands = []

  return self;
}

chosenRecipe.prototype.disableOldCommands = function() {
  _.each(this.previouslyAddedIngredientCommands, function(command) {
    command.disable();
  });
};

chosenRecipe.prototype.addDefaultCommands = function() {
  var self = this;

  var defaultCommands = [
    {
      id: 'next step',
      action: function() {
        this.recipe.goto_next_step();
        this.speak.say(this.recipe.list_current_step());
        this.updateCommands();
      }.bind(self)
    },
    {
      id: 'go back',
      action: function() {
        this.recipe.goto_prev_step();
        this.speak.say(this.recipe.list_current_step());
      }.bind(self)
    },
    {
      id: 'what step am I on',
      action: function() {
        this.speak.say(this.recipe.list_current_step());
      }.bind(self)
    },
    { 
      id: 'how much',
      action: function() {
        this.speak.say(this.recipe.list_step_amount());
      }.bind(self)
    },
    {
      id: 'whats next', 
      action: function() {
        this.speak.say(this.recipe.list_next_step());
      }.bind(self)
    },
    {
      id: 'how long', 
      action: function(){
        this.speak.say(this.recipe.list_step_time());
      }.bind(self)
    }
  ];

  _.each(defaultCommands, function(command) {
    var addedCommand = self.commands.add(command.id, command.action);
    self.previouslyAddedIngredientCommands.push(addedCommand);
  });
};

chosenRecipe.prototype.addIngredientCommands = function() {
  var self = this;

  var ingredients = this.recipe.list_step_ingredient_keywords();

  _.each(ingredients, function(ingredient) {
    var addedCommand = self.commands.add('how much ' + ingredient, function() {
      this.speak.say(this.recipe.list_step_amount_of(ingredient));
    }.bind(self));

    self.previouslyAddedIngredientCommands.push(addedCommand);
  });
};

chosenRecipe.prototype.updateCommands = function() {
  this.disableOldCommands();
  this.addIngredientCommands();
  this.addDefaultCommands();
}

chosenRecipe.prototype.onChange = function(fn) {
  this.onchangeFn = fn;
};

chosenRecipe.prototype.set = function(recipe) {
  this.recipe = recipe;
  this.updateCommands();
  this.onchangeFn(recipe);
}

chosenRecipe.prototype.get = function(recipe) {
  return this.recipe;
}