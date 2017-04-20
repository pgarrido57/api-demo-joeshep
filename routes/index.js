'use strict';

const { Router } = require('express');
const router = Router();

router.use(require('./shows'));

router.get('/', function(req, res) {
	res.json({
		"shows": "https://api-creation-inclass-demo.herokuapp.com/api/v1/shows",
		"favorites": "https://api-creation-inclass-demo.herokuapp.com/api/v1/shows/favorites?showId=<show_id>",
		"directors": "https://api-creation-inclass-demo.herokuapp.com/api/v1/shows/directors?showId=<show_id>"
	});
});

module.exports = router;
