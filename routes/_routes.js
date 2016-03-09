
var articles = require('../models/articles');

// 发表数据
app.post('/post', function(req, res){
	var currentUser = req.session.user;
	var article = new Articles(
		currentUser.name,
		req.body.title,
		req.body.content
		);
	article.save(function(err){
		// 保存失败则重定向到主页面
		if(err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		// 保存成功也返回到主页面
		req.flash('success', '文章保存成功！');
		return res.redirect('/');
	});
	
});

// 主页面：显示所有用户的文章
app.get('/', function(req, res){
	Articles.get(null,function(err, docs){
		if(err) {
			req.flash('error', err);
			docs = [];
		}
		res.render('index', {
			title: '主页',
			user: req.session.user,
			articles: docs
		});
		
	});
});