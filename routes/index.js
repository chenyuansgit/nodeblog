var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');

/* GET home page. */

router.get('/', function(req, res, next) {
	console.log('idr:  ' + __dirname);
  res.render('home', { 
  	title: 'NodeBlog', 
  	layout:'layout',
  	items:[{user:'haha', title:'test sing line', time:'2015-12',content:'this is content'}]
  });
});


/*get the register page*/
router.get('/reg', function(req, res, next){
	 res.render('reg', { title: '注册', layout:'layout'});
});

/*register the new user*/
router.post('/reg', function(req, res, next){
	//res.send('this is to register user');
	// 校验用户两次密码是否一致
	if(req.body['password-repeat'] != req.body['password']) {
		req.flash('error', '两次输入的口令不一致');
		return res.redirect('/reg');
	}
	// 生成口令的散列值
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var newUser = new User({
		name: req.body.username,
		password: password
	});
	// 检查用户是否存在
	User.get(newUser.name, function(err, user){
		if(user) {
			err = '用户已经存在';
		}
		if(err) {
			req.flash('error', err);
			return res.redirect('/reg');
		}
		// 如果不存在则新增用户
		newUser.reg(function(err){
			if(err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = newUser.name;
			req.flash('success', '注册成功');
			return res.redirect('/');

		});
	});

});

/*get the login page*/
router.get('/login', function(req, res, next){
	res.render('login', { title: '登陆', layout:'layout'});
});

/*user login in */
router.post('/login', function(req, res, next){
	//res.send('this is to login user');
    // 对密码进行编码
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    //查看用户是否存在
    User.get(req.body.name, function(err, user){
        // 发生错误
        if(err) {
            req.flash('error', err);
            return res.redirect('/login');
        }
        // 用户不存在
        console.log(user);
        if(!user) {
            req.flash('error', '该用户不存在，请注册');
            return res.redirect('/login');
        }
        // 用户存在
        console.log(password);
        if(user.password == password){
            // 将用户信息放到session中
            req.session.user = user;
            req.flash('success', '登录成功');
            res.redirect('/');

        } else {
            req.flash('error', '密码错误');
            res.redirect('/login');
        }
    });
});

/*post the data*/
router.post('/post', function(req,res, next){
	res.send('this is to post the data');
});

/*user logout*/
router.get('/logout', function(req, res, next){
	//res.send('this is to logout user');
    // 直接将session的user置为null
    req.session.user = null;
    req.flash('success','用户退出');
    res.redirect('/');
});

module.exports = router;
