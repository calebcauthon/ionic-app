var recipe = function() {
  var self = this;

  return {
    bindToController: { 
      recipeId: '@' 
    },
    templateUrl: 'js/views/recipe.html',
    replace: true,
    controller: 'recipeCtrl',
    controllerAs: 'ctrl'
  };
}

recipe.prototype