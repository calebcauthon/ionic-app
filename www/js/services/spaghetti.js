function spaghetti() {
  var steps = [
    new RecipeStep({ 
      action: "Boil water", 
      amounts: {
        'water': '4 C'
      },
      current: true 
    }),
    new RecipeStep({ 
      action: "Prep the veggies",
      amounts: {
        'veggies': '4 C'
      }
    }),
    new RecipeStep({ 
      action: "Put the noodles in the water",
      amounts: {
        'noodles': '1 lb'
      }
    }),
    new RecipeStep({ action: "Drain the noodles" },
    { 
      action: "Puree tomatoes", 
      amounts:  {
        'tomatoes': '48oz'
      }
    }),
    new RecipeStep({ 
      action: "Heat up the sauce to a low boil",
      times: {
        'boil': '12 minutes'
      }
    }),
    new RecipeStep({ action: "Add veggies" }),
    new RecipeStep({ action: "Add Spices" }),
    new RecipeStep({ action: "Mix the sauce and the noodles" })
  ];

  var self = this;

  return _.extend({}, engine(steps), {
    steps: steps,
    name: "Spaghetti"
  });
}

var engine = function(steps) {
  //var steps = steps;

  var current_step = 0;

  var readMethods = {
    list_steps: function() {
      return steps.map(function(step) {
        return step.action;
      });
    },
    list_current_step: function() {
      return steps[current_step].action;
    },
    list_next_step: function() {
      if(steps[current_step+1])
        return steps[current_step+1].action;
      else
        return "Youre done";
    },
    goto_prev_step: function() {
      steps[current_step].current = false;
      
      if(steps[current_step-1])
        current_step--;

      steps[current_step].current = true;
    },
    goto_next_step: function() {
      steps[current_step].current = false;
      
      if(steps[current_step+1])
        current_step++;

      steps[current_step].current = true;
    },
    list_step_ingredient_keywords: function() {
      var ingredients = [];
      _.chain(steps[current_step].amounts).pluck('nouns').each(function(nouns) {
        _.each(nouns, function(noun) {
          ingredients = ingredients.concat(noun[0])
        });
      });

      return ingredients;
    },
    list_step_amount: function() {
      return _.pluck(steps[current_step].amounts, 'text').join(', ');
    },
    list_step_amount_of: function(ingredient) {
      return _.chain(steps[current_step].amounts).select(function(amount) {
        return _.select(amount.nouns, function(data) {
          return data[0] == ingredient;
        }).length > 0;
      }).pluck('text').first().value();
    },
    list_step_time: function() {
      return steps[current_step].times
    },
    list_ingredient: function(ingredient) {
      var ingredients = [];
      steps.map(function(step) {
        if(step.amounts)
          Object.keys(step.amounts).map(function(key) {
            if(key == ingredient) 
              ingredients.push(step.amounts[key] + ' ' + key);
          });
      });

      return ingredients;
    }
  };

  var writeMethods = {
    add_step: function(action) {
      var step = { 
        action: action,
        times: {},
        amounts: {}
      };
      steps.push(step);

      return step;
    }, 
    add_time: function(step, item, duration) {
      step.times[item] = duration;
    },
    add_ingredient: function(step, ingredient, amount) {
      step.amounts[ingredient] = amount;
    }
  }

  return _.extend({}, readMethods, writeMethods);
};