app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController',
        resolve: {
          persons: function (HomeFactory) {
            console.log(HomeFactory);
            return HomeFactory.getPersons();
        }
        }
    });
});


app.controller('HomeController', function($scope, $http, persons) {
  console.log(persons);
  $scope.persons = persons;
});

app.factory('HomeFactory', function($http) {
  var HF = {};

  HF.getPersons = function () {
    console.log('getting hit');
    return $http.get('/api/tessel/home')
    .then(res => res.data)
    .then(null, console.log)
  };

  return HF;
});
