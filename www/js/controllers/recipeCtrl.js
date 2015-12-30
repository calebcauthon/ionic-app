var recipeCtrl = function($scope, ux, chosenRecipe) {
  chosenRecipe.onChange(function(newRecipe) { 
    $scope.recipe = newRecipe;
  })
};