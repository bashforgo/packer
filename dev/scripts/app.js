"use strict";

angular.module('packer', [])
  .controller('packerCtrl', ['$scope', '$http', function ($scope, $http) {

    var rand = new MersenneTwister();
    var cs = {name:'',rarity:'',set:'',playerClass:''};
    $scope.set = 'WOG';

    $http.get('json/cards.json')
      .then(function (data){
        $scope.cards = data.data;
        filterCards();
        run(50);
      });

    function run(n) {
      n = n || 50;
      $scope.packs = [];
      for (var i = 0; i < n; i++) {
        $scope.packs.push(pack());
      }
      console.log($scope.packs);
    }

    function pack() {

    }


    function filterCards() {
      var cards = $scope.cards.filter(function (v) {
        return v.set === $scope.set;
      });
      $scope.commons = cards.filter(function (v) {
        return v.rarity === "COMMON";
      });
      $scope.rares = cards.filter(function (v) {
        return v.rarity === "RARE";
      });
      $scope.epics = cards.filter(function (v) {
        return v.rarity === "EPIC";
      });
      $scope.legendaries = cards.filter(function (v) {
        return v.rarity === "LEGENDARY";
      });
    }

  }]);