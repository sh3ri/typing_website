var express = require('express');
var axios = require('axios');
asyncHandler = require("express-async-handler");
var router = express.Router();

router.get('/words', asyncHandler(async (req, res) => {
  words = await axios.get('https://random-word-api.vercel.app/api?words=300').then(res => res.data);
  res.send(words);
}));

module.exports = router;
