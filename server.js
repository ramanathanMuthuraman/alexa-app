const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();

const alexaResponse = ({text}) => {
  return {
    "version": "1.0",
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        "text": `Trending topics: ${text}`,
        "ssml": `<speak>Trending topics: ${text}</speak>`
      },
      "card": {
        "type": "Standard",
        "title": "Javascript news feed",
        "content": "Popular JS news",
        "text": text.replace(/,/g,'\n')
      }
    }
  };
};

app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.send('Alexa app');
});

app.post('/', (request, response) => {
  fetch('https://refind.com/feed/javascript.json')
    .then(res => res.json())
    .then(body => {
      const text = body.map(news => news.title).join();
      const data = alexaResponse({
        text
      });
      response.send(JSON.stringify(data));
    })
    .catch((error) => {
      response.send(error);
    });
});

const port = process.env.PORT || 3434;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));