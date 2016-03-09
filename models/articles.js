var mongodb = require('./db');

function Articles(name, title, content){
	this.name = name;
	this.title = title;
	this.content = content;
}
module.exports = Articles;

// 存储文章
Articles.prototype.save = function(callback){
	var Date = new Date();
	// 将时间存储为各种时间格式
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + '-' + (date.getMonth()+1),
		day: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate(),
		minute: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + 
		date.getDate() + "" + date.getHours() + (date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes())
	};
	// 构建要插入的文档对象
	var article = {
		name: this.name,
		time: time,
		title: this.title,
		content: this.content
	};
	// 打开数据库
	mongodb.open(function(err, db){
		if(err) {
			callback(err);
		}
		// 打开articles集合
		db.collection('articles', function(err, collection){
			if(err) {
				mongodb.close();
				callback(err);
			}
			// 将文档插入到集合中
			collection.insert(article, {safe: true}, function(err){
				mongodb.close();
				if(err) {
					return callback(err);
				}
				// 成功则返回null
				callback(null);
			});
		});
		
	});
	
}

// 获取文章:全部用户or单个用户
Articles.getAll = function(name, callback){
	// 打开数据库
	mongdb.open(function(err, db){
		if(err) {
			return callback(err);
		}
		// 打开articles集合
		db.collection('articles', function(err, collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}
			// 筛选条件
			var filter = {};
			if(name) {
				filter.name = name;
			}
			// 获取数据
			collection.find(filter).sort({time:-1}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				// 成功则返回数据结果
				callback(err, docs);
			});
			
		});
	});
}

// 获取文章：检索单篇文章
Articles.getOne = function(user, day, title, callback){
	//打开数据库
	mongodb.open(function(err, db){
		if(err) {
			return callback(err);
		}
		// 打开articles集合
		db.collection('articles', function(err, collection){
			if(err) {
				mongodb.close();
				return callback(err);
			}
			// 根据用户名、发表日期、文章名查询
			var filter = {
				'name': user,
				'time.day': day,
				'title':title
			};
			collection.findOne(filter, function(err, doc){
				mongodb.close();
				if(err) {
					return callback(err);
				}
				// 返回文档
				callback(null, doc);
				
			});
			
		});
	});
}
