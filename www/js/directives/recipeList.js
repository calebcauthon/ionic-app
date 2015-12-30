var recipeList = function() {
  var self = this;

  return {
    templateUrl: 'js/views/recipeList.html',
    replace: true,
    controller: 'recipeListCtrl',
    controllerAs: 'ctrl'
  };
}

recipeList.prototype;//