(function ($) {
	var tmpls = {};
	$.getTmpl = function (url) {
		var tmpl = tmpls[url];
		if (window.sessionStorage) {
			var sTmpl = window.sessionStorage.getItem(url);
		}
		if (!tmpl && !sTmpl) {
			tmpl = $.get(url).done(function (data) {
				tmpls[url] = tmpl;
				if (window.sessionStorage) {
					window.sessionStorage.setItem(url, tmpl);
				}
				return tmpl;
			});
		}
	};
}(jQuery));