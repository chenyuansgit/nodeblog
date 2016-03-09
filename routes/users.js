var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Get user info*/
router.get('/:username', function(req, res, next){
	res.render('userpage', { 
		title: 'NodeBlog', 
		layout:'layout',
		items:[{username:'haha', title:'test sing line', content:'this is content'}]
	});
});


module.exports = router;
