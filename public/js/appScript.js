var app=angular.module('app',['controllers']);
var controllers=angular.module('controllers',[]);

controllers.controller('userDetailsController',function($scope)
{
  $scope.phone_regex="^\\d{10}$";
  $scope.users=[1];
  $scope.userCount = 1;
  $scope.add=function()
  {
    $scope.userCount++;
    $scope.users.push($scope.users.length+1);
  }
  $scope.sub=function()
  {
    if($scope.users.length!=1)
    {
      $scope.userCount--;
      $scope.users.pop();
    }
  }
});
controllers.controller('recipientDetailsController',function($scope)
{
  $scope.recpt_regex="^\\d{10}(,\\d{10})*$";
  $scope.recipients=[];
  $scope.$watch('message',function(newVal,oldVal)
  {
    if(newVal.length>140)
    {
      $scope.message=oldVal;
    }
  });
});

//Papa Parse
$(document).ready(function(){
    $("#inputCsv").change(handleFileSelect);
});

function handleFileSelect(evt) {
    //If file is absent
    if ( !(evt.target && evt.target.files && evt.target.files[0]) ) {
        alert('Fail');
    }
    //Parsing
    Papa.parse(evt.target.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            renderDataset(results);
        },
        error: function()
        {
          alert('Upload Failed');
        }
    });
}

function renderDataset(dataset)
{
    var recipientList="";
    for(var i=0;i<dataset.data.length-1;i++)
    {
      //Making ',' separated list
      recipientList=recipientList+JSON.stringify(dataset.data[i]["Participant Phone"])+",";
    }
    recipientList = recipientList.replace(/,$/, ''); //Removing Last ','
    alert("Upload Successful");
    console.log("Array Of Phone Numbers:")
    console.log(recipientList);
    change(recipientList)
}

function change(data) {
    var appElement = document.querySelector('[ng-app=app]');
    var $scope = angular.element(appElement).scope();
    $scope.$apply(function() {
        $scope.recptText = data;
    });
}
