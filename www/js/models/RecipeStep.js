function RecipeStep(data) {
  var self = this;
  self.amounts = data.amounts;
  self.action = data.action;
  self.current = data.current;
}

RecipeStep.prototype.list_amounts = function() {
  return _.pluck(this.amounts, 'text');
}