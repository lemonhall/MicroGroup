$(function () {
	//init
	$.get("/getheadernav")
		.done(function (data) {
			var navs = JSON.parse(data),
				tmpl = $.getTmpl("theme/top_header_menu_item_tmlp.html"),
				navsHtml = Mustache.to_html(tmpl, {"array" : navs});
			$("nav#top_header_menu ul").html(navsHtml);
		});
	$.get("/gettalks", {"tag" : "*", "scound" : 0, "cound" : 10})
		.done(function (data) {
			var talks = JSON.parse(data),
				tmpl = $.getTmpl("theme/talk_tmlp.html"),
				talksHtml = Mustache.to_html(tmpl, {"array" : talks});
			$("section.talks").html(talksHtml);
		});
	
	//event
	$("article.talk").livequery(function () {
				$(this).hover(function () {
					$(this).css({'background' : '#E9E9E9'});
					return false;
				}, function () {
					$(this).css({'background' : '#fff'});
					return false;
				});
			},function () {
				$(this) 
					.unbind('mouseover')
					.unbind('mouseout');
			});
	$("article.talk").livequery("click", function (e) {
		$(this).css({'background' : '#fff'});
		$(this)
			.find(".talk_wrap .content p, .talk_wrap .content footer.comments")
			.show();
		$.get("theme/talk_nav_tmlp.html")
			.done(function (data) {
				$(this)
					.find(".talk_wrap .content")
					.before(data);
				$(this)
					.find("nav.talk_nav")
					.css({'display' : 'none'});
			});
		$.get("theme/respond_tmlp.html")
			.done(function (data) {
				$(this)
					.find(".talk_wrap .content")
					.after(data);
				$(this)
					.find("aside.respond")
					.css({'display' : 'none'});
			});
		$.get("/gettalknav")
			.done(function (data) {
				var navs = JSON.parse(data),
					tmpl = $.getTmpl("theme/talk_nav_item_tmlp.html"),
					navsHtml = Mustache.to_html(tmpl, navs);
				$(this)
					.find("nav.talk_nav ul")
					.html(navsHtml);
			});
		$(this)
			.find("nav.talk_nav")
			.css({'display' : 'block'});
		$(this)
			.find("aside.respond")
			.css({'display' : 'block'});
		$(this)
			.animate({'width' : '960'}, 500);
		return false;
	});
});