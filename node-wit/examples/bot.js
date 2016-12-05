'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node examples/bot.js <7A4GK73ZQ7W6ZHN7NJPHQSTCLTZFTEYL>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  funcMovieDetails({context, entities}) {
    return new Promise(function(resolve, reject) {

      // console.log(`The current context is ${JSON.stringify(context)}`);
      // console.log(`Wit extracted ${JSON.stringify(entities)}`);

      var movie = firstEntityValue(entities, 'movie')

      // context.details = 'Movie Details of ' + movie;
      // console.log(`Wit extracted movie : ${JSON.stringify(movie)}`);


      if (movie) {

        ////////  API Call  ////////

        var request = require("request")

        console.log('movie is : ' + movie)
        var url = "http://www.omdbapi.com/?t="+movie+"&y=&plot=short&r=json"

        request({
            url: url,
            json: true
        }, function (error, response, body) {
          // console.log(`Inside API call error : ` + error);
          // console.log(`Inside API call response : ` + response);
          // console.log(`Inside API call body : `+ body);

            if (!error && response.statusCode === 200) {
                // console.log(body) // Print the json response

                // console.log(body.Plot);

                context.details = 'Short Plot of ' +movie+ 'is : ' + body.Plot; // we should call an API here
                delete context.movieNotFound;
            }
        })

        ///////////////////////////

      } else {
        context.movieNotFound = true;
        delete context.details;
      }

      // console.log(`2 The current context is ${JSON.stringify(context)}`);

      return resolve(context);
    });
  },
};

const client = new Wit({accessToken, actions});
interactive(client);
