function addRecipeCtrl($scope, $http, $q) {
  var ctrl = this;
  ctrl.$http = $http;

  $scope.sentences = [];

  $scope.parse = function(text) {
    $scope.steps = _.map(ctrl.getSentencesFrom(text), function(sentence) {
      var amounts = [];
      var times = {}
      var step = {
        action: sentence,
        amounts: amounts,
        times: times
      };
      var promises = _.select(ctrl.getTimesFrom(sentence), function(candidate) {
        return candidate.then;
      });
      
      $q.all(promises).then(function(response) {
        var results = {};

        _.each(response, function(parsed) {
          results[parsed.verb] = parsed.time;
        });

        step.times = results;
      });

      _.each($scope.ingredients, function(ingredient) {
        if(_.chain(ingredient.parts).select(function(part) {
            return part.isNoun;
          }).select(function(part) {
            return sentence.indexOf(part.word) != -1;
          }).pluck('word').uniq().value().length > 0) {

          step.amounts.push(ingredient);
        }


        step.amounts = _.uniq(step.amounts, false, function(ingredient) {
          return ingredient.text
        });
      });

      return step;
    });
  }

  var unwanted = /(?:[0-9]+|cup|cups|tbps|T)\ /g;
  function isNoun(word, part) {
    return word.length > 3 && part == "NN" && !unwanted.exec(part);
  }

  $scope.parseIngredients = function(text) {
    $scope.ingredients = _.map(ctrl.getIngredientsFrom(text), function(ingredientText) {
      var ingredient = {
        text: ingredientText,
        parts: [], 
        nouns: []
      };

      
      ctrl.getPartsFrom(ingredientText).then(function(response) {
        
        ingredient.parts = _.map(response.parts, function(candidate) {
          return {
            word: candidate[0],
            isNoun: isNoun(candidate[0], candidate[1])
          }
        });

        ingredient.nouns = _.chain(response.parts).select(function(candidate) {
          return isNoun(candidate[0], candidate[1]);
        }).uniq(false, function(a, b) {
          return a[0];
        }).value();
      });

      return ingredient;
    });
  }

  $scope.save = function() {
    ctrl.save({
      rawIngredients: $scope.rawIngredients,
      parsedIngredients: $scope.ingredients,
      rawSteps: $scope.raw,
      parsedSteps: $scope.steps
    });
  };
}

addRecipeCtrl.prototype.save = function(data) {
  this.$http.post('save-translation', data);
};

addRecipeCtrl.prototype.getPartsFrom = function(text) {
  return this.$http.post('get-verb', { phrase: text }).then(function(response) {
    var words = response.data;
    
    return {
      text: text,
      parts: words
    }
  });
};

addRecipeCtrl.prototype.getIngredientsFrom = function(text) {
  var self = this;
  var ingredientsPattern = /([0-9]+[^\n]+)(?:[\s\S])/g;
  var ingredients = [];

  while(nextMatches = ingredientsPattern.exec(text)) {
    ingredients.push(nextMatches[1]);
  }

  return ingredients;
};

addRecipeCtrl.prototype.sliceWordsFrom = function(text, words, matches) {
  var full_match = matches[0];
  var scalar = matches[1];
  var label = matches[2];

  var labelIndex = _.chain(words).map(function(word) {
    return word[0];
  }).indexOf(scalar).value();

  var lastVerb = _.chain(words).select(function(analysis) {
    var part_of_speech = analysis[1];
    return part_of_speech == 'VB' || part_of_speech == 'VBN' && analysis[0].slice(-2) != "ed";
  }).last().value();

  var verbIndex = _.indexOf(words, lastVerb);

  if(verbIndex != -1) {
    var start = text.indexOf(words[verbIndex][0]);
    var end = text.indexOf(full_match) + full_match.length;

    var full_cooking_phrase = text.slice(start, end);
  } else {
    var full_cooking_phrase = text.slice(0, labelIndex + scalar.length);
  }

  return {
    full: full_cooking_phrase,
    time: text.slice(text.indexOf(scalar), text.indexOf(label) + label.length),
    verb: verbIndex != -1 ? words[verbIndex][0] : words[0][0]
  };
};

addRecipeCtrl.prototype.getTimesFrom = function(text) {
  var self = this;
  var timesPattern = /((?:[0-9]|one|two|three|four|five|six|seven|eight|nine|ten)+).+(?:(minutes|hours|min|hrs))/g;
  var promises = [];

  while(nextMatches = timesPattern.exec(text)) {
    var matches = nextMatches;
    var end = text.indexOf(nextMatches[2]) + nextMatches[2].length;
    
    promises.push(this.$http.post('get-verb', { phrase: text.slice(0, end) }).then(function(response) {
      var words = response.data;

      return self.sliceWordsFrom(text, words, matches);
    }));
  };

  if(text.match(timesPattern))
    return promises;
  else
    return [];
};

addRecipeCtrl.prototype.getSentencesFrom = function(text) {
  var sentencesPattern = /([A-Z][^\.]{5,})(?=\.\ [A-Z]|\.(?:$|\n))/g;
  return text.match(sentencesPattern);
}