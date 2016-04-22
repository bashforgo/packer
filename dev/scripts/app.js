"use strict";

angular.module('packer', [])
  .controller('packerCtrl', ['$scope', '$http', 'BiasedRandomList', function ($scope, $http, RandomList) {

    var rand = new MersenneTwister();
    var goldDrops = {comm: 2.0637, rare: 5.5395, epic: 4.5173, lgnd: 7.3107};
    var cs = {name:'',rarity:'',set:'',playerClass:''};
    var cards = {};
    $scope.set = 'WOG';

    $http.get('json/cards.json')
      .then(function (data){
        cards = {};
        cards.data = data.data;
        filterCards();
        packGen();
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

    var card;
    var pack;
    function packGen() {
      var norm = {
        comm: 0,
        rare: 0,
        epic: 0,
        lgnd: 0,
      };
      var gold = {
        comm: 0,
        rare: 0,
        epic: 0,
        lgnd: 0,
      };

      pack = function () {
        var rarity;
        for (rarity in norm) {
          if (norm.hasOwnProperty(rarity)) {
            norm[rarity]++;
          }
        }
        for (rarity in gold) {
          if (gold.hasOwnProperty(rarity)) {
            gold[rarity]++;
          }
        }

        return [
          card({comm: 99.9801, rare: 0.0199, epic: 0.0000, lgnd: 0.0000}),
          card({comm: 99.6426, rare: 0.3442, epic: 0.0132, lgnd: 0.0000}),
          card({comm: 94.7316, rare: 5.1890, epic: 0.0794, lgnd: 0.0000}),
          card({comm: 64.8421, rare: 33.1326, epic: 1.9856, lgnd: 0.0397}),
          card({comm: 0.0000, rare: 75.6569, epic: 19.3130, lgnd: 5.0301}),
        ];
      };

      card = function card(chances) {
        var rarity = (function () {
          if (chances.comm > 0 && gold.comm > 25) {
            return ['comm', true];
          } else if (gold.rare > 30) {
            return ['rare', true];
          } else if (gold.epic > 137) {
            return ['epic', true];
          } else if (gold.lgnd > 310) {
            return ['lgnd', true];
          } else if (norm.epic > 10) {
            return ['epic', false];
          } else if (norm.lgnd > 40) {
            return ['lgnd', false];
          } else {
            var list = new RandomList([], function (i) { return i.weight; });
            for (var r in chances) {
              if (chances.hasOwnProperty(r)) {
                list.push({rarity: r, weight: chances[r]});
              }
            }
            var chosen = list.peek().rarity;
            var isGolden = rand.realx()*100 < goldDrops[chosen];
            return [chosen, isGolden];
          }
        })();
        var c = {
          rarity: rarity[0],
          gold: rarity[1],
          detail: cards.rand[rarity[0]].peek(),
        };
        var group = c.gold ? gold : norm;
        group[c.rarity] = 0;

        return c;
      };
    }

    function filterCards() {
      cards.all = cards.data.filter(function (v) {
        return v.set === $scope.set;
      });
      cards.list = {};
      cards.rand = {};
      cards.list.comm = cards.all.filter(function (v) {
        return v.rarity === "COMMON";
      });
      cards.rand.comm = new RandomList(cards.list.comm);
      cards.list.rare = cards.all.filter(function (v) {
        return v.rarity === "RARE";
      });
      cards.rand.rare = new RandomList(cards.list.rare);
      cards.list.epic = cards.all.filter(function (v) {
        return v.rarity === "EPIC";
      });
      cards.rand.epic = new RandomList(cards.list.epic);
      cards.list.lgnd = cards.all.filter(function (v) {
        return v.rarity === "LEGENDARY";
      });
      cards.rand.lgnd = new RandomList(cards.list.lgnd);
    }

  }]);