function recipeListCtrl($scope, $http, chosenRecipe, SERVER) {
  $scope.recipes = [];

  $http.get(SERVER.url + '/get-recipes').then(function(response) {
    $scope.recipes = _.map(response.data, function(doc) {
      var steps = _.map(doc.parsedSteps, function(step) {
        return new RecipeStep(step);
      });
      
      var recipe = _.extend({}, engine(steps), {
        steps: steps,
        name: doc.name || doc._id
      });

      return recipe;
    });
  });

  $scope.choose = function(recipe) {
    chosenRecipe.set(recipe);
  }
}