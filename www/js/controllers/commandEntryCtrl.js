function commandEntryCtrl($scope, ux, commands, houndify) {
  $scope.execute = function(command) {
    ux.tell(command);
  }

  $scope.listen = function() {
    $scope.isListening = true;

    houndify.listen(function(response) {
      console.log('heard', response);
      ux.tell(response);
      $scope.$apply();
    }, function() {
      $scope.isListening = false;
      $scope.$apply();

      setTimeout(function() {
        console.log('listen again!');
        $scope.listen();
      }, 5000);
    });
  }
  
  $scope.isListening = false;
  $scope.commands = commands.get();

  commands.onUpdate(function() {
    $scope.commands = commands.get();
  });
}