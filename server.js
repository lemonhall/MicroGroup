//Module
var http = require('http'),
	fs = require('fs'),
	url = require('url'),
	qs = require('querystring'),
	fu = require('./fu'),
	web = require('./inclube/web'),
	MongoDB = require('mongodb'),
	db = new MongoDB.Mongo().getDB('microgroup');
	
//NoSQL
var talksColl = db.getCollection("talks"),
	metasColl = db.getCollection("metas"),
	usersColl = db.getCollection("users"),
	tagsColl = db.getCollection("tags");
	talksColl.drop();
	metasColl.drop();
	usersColl.drop();
	tagsColl.drop();

//Rule Handlers
var url = {
			"^([a-zA-Z0-9])" : "tag.html",
			"^user/([a-zA-Z0-9])" : "user.html",
			"^setting" : "setting.html"
			},
	get = {
			"^getheadernav" : function (req, res, data) {
								var query = {
											"type" : "headernav"
											},
									cur = metasColl.find(query);
								web.send(res, JSON.stringify(cur));
							},
			"^gettalks" : function (req, res, data) {
								if (data.tag !== "*") {
									var query = {
												"tag" : data.tag
												},
										cur = talksColl.find(query);
								} else {
									var cur = talksColl.find();
								}
								var result = [];
								for (var i = data.scound; i < (data.scound + data.cound); i++) {
									result.push(cur[i]);
								}
								web.send(res, JSON.stringify(result));
							},
			"^gettalk" : function (req, res, data) {
								var cur = talksColl.findOne(data);
								web.send(res, JSON.stringify(cur));
							},
			"^gettalknav" : function (req, res, data) {
								var cur = talksColl.findOne(data),
									navs = [];
								while (cur.hasNext()) {
									navs.push(cur.Next().navs);
								}
								web.send(res, JSON.stringify({"navs" : navs}));
							},
			"^getuserinfo" : function (req, res, data) {
								var cur = usersColl.findOne(data);
								web.send(res, JSON.stringify(cur));
							},
			"^search" : function (req, res, data) {
								var cur = talksColl.find(data);
								web.send(res, JSON.stringify(cur));
							}
			},
	post = {
			"^posttalk" : function (req, res, data) {
								talksColl.insert(data);
								web.send(res, "Post Success.")
							},
			"^usersetting" : function (req, res, data) {
								
							}
			};
web.run(url, 80);
web.get(get);
web.post(post);