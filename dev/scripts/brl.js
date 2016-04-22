'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('packer').service('BiasedRandomList', function () {
  var HeapNode = function HeapNode(obj, weighter) {
    _classCallCheck(this, HeapNode);

    this.o = obj;
    this.weight = this.total = weighter(obj);
  };

  HeapNode.displayName = 'HeapNode';

  var WeightedHeap = (function () {
    function WeightedHeap(items, weighter) {
      var _this = this;

      _classCallCheck(this, WeightedHeap);

      this.heap = [null];

      // First put everything on the heap
      items.forEach(function (i) {
        return _this.heap.push(new HeapNode(i, weighter));
      });

      // Now go through the heap and add each node's weight to its parent
      for (var i = this.heap.length - 1; i > 1; i--) {
        this.heap[i >> 1].total += this.heap[i].total;
      }
    }

    _createClass(WeightedHeap, [{
      key: 'pop',
      value: function pop() {
        // Start with a random amount of gas
        var gas = this.heap[1].total * Math.random();

        // Start driving at the root node
        var i = 1;

        // While we have enough gas to keep going past i:
        while (gas > this.heap[i].weight) {
          gas -= this.heap[i].weight; // Drive past i
          i <<= 1; // Move to first child
          if (gas > this.heap[i].total) {
            gas -= this.heap[i].total; // Drive past first child and its descendants
            i++; // Move on to second child
          }
        }
        // Out of gas - i is our selected node.
        var value = this.heap[i].o;
        var selectedWeight = this.heap[i].weight;

        this.heap[i].weight = 0; // Make sure i isn't chosen again
        while (i > 0) {
          // Remove the weight from its parent's total
          this.heap[i].total -= selectedWeight;
          i >>= 1; // Move to the next parent
        }
        return value;
      }
    }, {
      key: 'gen',
      value: regeneratorRuntime.mark(function gen(num) {
        var i;
        return regeneratorRuntime.wrap(function gen$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              i = num;

            case 1:
              if (! i--) {
                context$3$0.next = 6;
                break;
              }

              context$3$0.next = 4;
              return this.pop();

            case 4:
              context$3$0.next = 1;
              break;

            case 6:
            case 'end':
              return context$3$0.stop();
          }
        }, gen, this);
      })
    }]);

    return WeightedHeap;
  })();

  WeightedHeap.displayName = 'WeightedHeap';

  var BiasedRandomList = (function () {
    function BiasedRandomList(weightedObjects, weighter) {
      var _this2 = this;

      _classCallCheck(this, BiasedRandomList);

      this.items = [];
      this.weighter = weighter || function (o) {
          return typeof o.weight === 'undefined' ? 1 : o.weight;
        };

      weightedObjects = typeof weightedObjects !== 'undefined' ? weightedObjects : [];

      weightedObjects.forEach(function (obj) {
        return _this2.push(obj);
      });
    }

    _createClass(BiasedRandomList, [{
      key: 'push',
      value: function push(obj) {
        if (typeof this.weighter(obj) !== typeof 1) {
          throw new Error('Weight must be numeric (got ' + this.weighter(obj).toString() + ')');
        }
        if (this.weighter(obj) <= 0) {
          if (this.weighter(obj) === 0) {
            return;
          }
          throw new Error('Weight must be >= 0 (got ' + this.weighter(obj) + ')');
        }

        this.items.push(obj);
      }
    }, {
      key: 'peek',
      value: function peek(n, andRemove) {
        var _this3 = this;

        if (typeof n === 'undefined') {
          n = 1;
        }
        andRemove = !!andRemove;

        if (this.length - n < 0) {
          throw new Error('Stack underflow! Tried to retrieve ' + n + ' element' + (n === 1 ? '' : 's') + ' from a list of ' + this.length);
        }

        var heap = new WeightedHeap(this.items, this.weighter);

        var result = [].concat(_toConsumableArray(heap.gen(n)));

        if (andRemove) {
          result.forEach(function (i) {
            var index = _this3.items.indexOf(i);
            _this3.items.splice(index, 1);
          });
        }

        return n === 1 ? result[0] : result;
      }
    }, {
      key: 'shuffle',
      value: function shuffle() {
        return this.peek(this.length);
      }
    }, {
      key: 'pop',
      value: function pop(n) {
        return this.peek(n, true);
      }
    }, {
      key: 'stream',
      value: regeneratorRuntime.mark(function stream() {
        return regeneratorRuntime.wrap(function stream$(context$3$0) {
          while (1) switch (context$3$0.prev = context$3$0.next) {
            case 0:
              if (!true) {
                context$3$0.next = 5;
                break;
              }

              context$3$0.next = 3;
              return new WeightedHeap(this.items, this.weighter).pop();

            case 3:
              context$3$0.next = 0;
              break;

            case 5:
            case 'end':
              return context$3$0.stop();
          }
        }, stream, this);
      })
    }, {
      key: 'length',
      get: function get() {
        return this.items.length;
      }
    }]);

    return BiasedRandomList;
  })();

  BiasedRandomList.displayName = 'BiasedRandomList';

  return BiasedRandomList;
});