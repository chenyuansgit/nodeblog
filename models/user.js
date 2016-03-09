var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
}
// 注册
User.prototype.reg = function(callback) {
	//将用户信息存入文档
	var user = {
		name: this.name,
		password: this.password
	};
	// 打开数据库
	mongodb.open(function(err, db){
		if(err) {
			return callback(err);
		}
		// 读取数据集合
		db.collection('users', function(err, collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}
			// 为name属性创建索引
			collection.ensureIndex('name', {unique: true});
			// 写入user文档
			collection.insert(user, {safe: true}, function(err, user){
				mongodb.close();
				callback(err, user);
			});

		});

	});
};

// 登陆
User.get = function(username, callback){
	// 读取某个用户的信息
	mongodb.open(function(err, db){
		if(err) {
			return callback(err);
		}
		// 读取users集合
		db.collection('users', function(err, collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}
			// 查找 name属性为username的文档
			collection.findOne({name:username}, function(err, doc){
				mongodb.close();
				if(doc) {
					// 封装文档为User对象
					var user = new User(doc);
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		});
	});
};


module.exports = User;