'use strict';

/* Filters */

app.filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);

app.filter('grouped', function() {
    return function(input, itemsPerRow) {
        if (itemsPerRow === undefined) {
          itemsPerRow = 1;
        }
        
        var out = [];
        for (var i = 0; i < input.length; i++) {
          var rowElementIndex = i % itemsPerRow;
          var rowIndex = (i - rowElementIndex) / itemsPerRow;
          var row;
          if (rowElementIndex === 0) {
            row = [];
            out[rowIndex] = row;
          } else {
            row = out[rowIndex];
          }
          
          row[rowElementIndex] = input[i];
        }
          
        return out;
      };
    });
