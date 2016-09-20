var app=angular.module('app',['controllers']);
var controllers=angular.module('controllers',[]);

controllers.controller('mainController',function($scope)
{
  $scope.phone_regex="^\\d{10}$";
  $scope.users=[1];
  $scope.add=function()
  {
    $scope.users.push($scope.users.length+1);
  }
  $scope.sub=function()
  {
    if($scope.users.length!=1)
    {
      $scope.users.pop();
    }
  }
});
