//Modules
var http = require("http"),
    fs = require("fs"),
    sys = require("sys"),
	url = require("url"),
	qs = require("querystring");

//Metas
var web = exports,
	urlHandlers = {},
	getHandlers = {},
	postHandlers = {},
	erorrHandlers = {};
	
Object.prototype.set = function (attrs) {
	var key;
	for (key in attrs) {
		this[key] = attrs[key];
	}
};
web.send = function (res, data) {
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write(data, 'utf8');
	res.end();
};
web.mimes = { "3gp"   : "video/3gpp",
				 "a"     : "application/octet-stream",
				 "ai"    : "application/postscript",
				 "aif"   : "audio/x-aiff",
				 "aiff"  : "audio/x-aiff",
				 "asc"   : "application/pgp-signature",
				 "asf"   : "video/x-ms-asf",
				 "asm"   : "text/x-asm",
				 "asx"   : "video/x-ms-asf",
				 "atom"  : "application/atom+xml",
				 "au"    : "audio/basic",
				 "avi"   : "video/x-msvideo",
				 "bat"   : "application/x-msdownload",
				 "bin"   : "application/octet-stream",
				 "bmp"   : "image/bmp",
				 "bz2"   : "application/x-bzip2",
				 "c"     : "text/x-c",
				 "cab"   : "application/vnd.ms-cab-compressed",
				 "cc"    : "text/x-c",
				 "chm"   : "application/vnd.ms-htmlhelp",
				 "class"   : "application/octet-stream",
				 "com"   : "application/x-msdownload",
				 "conf"  : "text/plain",
				 "cpp"   : "text/x-c",
				 "crt"   : "application/x-x509-ca-cert",
				 "css"   : "text/css",
				 "csv"   : "text/csv",
				 "cxx"   : "text/x-c",
				 "deb"   : "application/x-debian-package",
				 "der"   : "application/x-x509-ca-cert",
				 "diff"  : "text/x-diff",
				 "djv"   : "image/vnd.djvu",
				 "djvu"  : "image/vnd.djvu",
				 "dll"   : "application/x-msdownload",
				 "dmg"   : "application/octet-stream",
				 "doc"   : "application/msword",
				 "dot"   : "application/msword",
				 "dtd"   : "application/xml-dtd",
				 "dvi"   : "application/x-dvi",
				 "ear"   : "application/java-archive",
				 "eml"   : "message/rfc822",
				 "eps"   : "application/postscript",
				 "exe"   : "application/x-msdownload",
				 "f"     : "text/x-fortran",
				 "f77"   : "text/x-fortran",
				 "f90"   : "text/x-fortran",
				 "flv"   : "video/x-flv",
				 "for"   : "text/x-fortran",
				 "gem"   : "application/octet-stream",
				 "gemspec" : "text/x-script.ruby",
				 "gif"   : "image/gif",
				 "gz"    : "application/x-gzip",
				 "h"     : "text/x-c",
				 "hh"    : "text/x-c",
				 "htm"   : "text/html",
				 "html"  : "text/html",
				 "ico"   : "image/vnd.microsoft.icon",
				 "ics"   : "text/calendar",
				 "ifb"   : "text/calendar",
				 "iso"   : "application/octet-stream",
				 "jar"   : "application/java-archive",
				 "java"  : "text/x-java-source",
				 "jnlp"  : "application/x-java-jnlp-file",
				 "jpeg"  : "image/jpeg",
				 "jpg"   : "image/jpeg",
				 "js"    : "application/javascript",
				 "json"  : "application/json",
				 "log"   : "text/plain",
				 "m3u"   : "audio/x-mpegurl",
				 "m4v"   : "video/mp4",
				 "man"   : "text/troff",
				 "mathml"  : "application/mathml+xml",
				 "mbox"  : "application/mbox",
				 "mdoc"  : "text/troff",
				 "me"    : "text/troff",
				 "mid"   : "audio/midi",
				 "midi"  : "audio/midi",
				 "mime"  : "message/rfc822",
				 "mml"   : "application/mathml+xml",
				 "mng"   : "video/x-mng",
				 "mov"   : "video/quicktime",
				 "mp3"   : "audio/mpeg",
				 "mp4"   : "video/mp4",
				 "mp4v"  : "video/mp4",
				 "mpeg"  : "video/mpeg",
				 "mpg"   : "video/mpeg",
				 "ms"    : "text/troff",
				 "msi"   : "application/x-msdownload",
				 "odp"   : "application/vnd.oasis.opendocument.presentation",
				 "ods"   : "application/vnd.oasis.opendocument.spreadsheet",
				 "odt"   : "application/vnd.oasis.opendocument.text",
				 "ogg"   : "application/ogg",
				 "p"     : "text/x-pascal",
				 "pas"   : "text/x-pascal",
				 "pbm"   : "image/x-portable-bitmap",
				 "pdf"   : "application/pdf",
				 "pem"   : "application/x-x509-ca-cert",
				 "pgm"   : "image/x-portable-graymap",
				 "pgp"   : "application/pgp-encrypted",
				 "pkg"   : "application/octet-stream",
				 "pl"    : "text/x-script.perl",
				 "pm"    : "text/x-script.perl-module",
				 "png"   : "image/png",
				 "pnm"   : "image/x-portable-anymap",
				 "ppm"   : "image/x-portable-pixmap",
				 "pps"   : "application/vnd.ms-powerpoint",
				 "ppt"   : "application/vnd.ms-powerpoint",
				 "ps"    : "application/postscript",
				 "psd"   : "image/vnd.adobe.photoshop",
				 "py"    : "text/x-script.python",
				 "qt"    : "video/quicktime",
				 "ra"    : "audio/x-pn-realaudio",
				 "rake"  : "text/x-script.ruby",
				 "ram"   : "audio/x-pn-realaudio",
				 "rar"   : "application/x-rar-compressed",
				 "rb"    : "text/x-script.ruby",
				 "rdf"   : "application/rdf+xml",
				 "roff"  : "text/troff",
				 "rpm"   : "application/x-redhat-package-manager",
				 "rss"   : "application/rss+xml",
				 "rtf"   : "application/rtf",
				 "ru"    : "text/x-script.ruby",
				 "s"     : "text/x-asm",
				 "sgm"   : "text/sgml",
				 "sgml"  : "text/sgml",
				 "sh"    : "application/x-sh",
				 "sig"   : "application/pgp-signature",
				 "snd"   : "audio/basic",
				 "so"    : "application/octet-stream",
				 "svg"   : "image/svg+xml",
				 "svgz"  : "image/svg+xml",
				 "swf"   : "application/x-shockwave-flash",
				 "t"     : "text/troff",
				 "tar"   : "application/x-tar",
				 "tbz"   : "application/x-bzip-compressed-tar",
				 "tcl"   : "application/x-tcl",
				 "tex"   : "application/x-tex",
				 "texi"  : "application/x-texinfo",
				 "texinfo" : "application/x-texinfo",
				 "text"  : "text/plain",
				 "tif"   : "image/tiff",
				 "tiff"  : "image/tiff",
				 "torrent" : "application/x-bittorrent",
				 "tr"    : "text/troff",
				 "txt"   : "text/plain",
				 "vcf"   : "text/x-vcard",
				 "vcs"   : "text/x-vcalendar",
				 "vrml"  : "model/vrml",
				 "war"   : "application/java-archive",
				 "wav"   : "audio/x-wav",
				 "wma"   : "audio/x-ms-wma",
				 "wmv"   : "video/x-ms-wmv",
				 "wmx"   : "video/x-ms-wmx",
				 "wrl"   : "model/vrml",
				 "wsdl"  : "application/wsdl+xml",
				 "xbm"   : "image/x-xbitmap",
				 "xhtml"   : "application/xhtml+xml",
				 "xls"   : "application/vnd.ms-excel",
				 "xml"   : "application/xml",
				 "xpm"   : "image/x-xpixmap",
				 "xsl"   : "application/xml",
				 "xslt"  : "application/xslt+xml",
				 "yaml"  : "text/yaml",
				 "yml"   : "text/yaml",
				 "zip"   : "application/zip"
				};
//Foundation Server
var content,
	server = http.createServer(function (req, res) {
	var path = url.parse(req.url).pathname.replace(/\//i, "");
	req.addListener('data', function(chunk){
		content += chunk;
	});
	switch (req.method) {
		case "GET":
			getHandler(req, res, path);
			break;
		case "POST":
			postHandler(req, res, path);
			break;
	}
});

//404 page
var page404 = "Page not found.",
	send404 = function (res) {
		res.writeHead(404, {'Content-Type' : 'text/html'});
		res.write(page404);
		res.end();
	};

//HTTP handler
var	getHandler = function (req, res, getpath) {
		switch (getpath) {
			case "":
				fs.readFile("./index.html", function (err, data) {
					if (err) return send404(res);
					web.send(res, data);
				});
				break;
			case "favicon.ico":
				fs.readFile("./favicon.ico", function (err, data) {
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'image/vnd.microsoft.icon'});
					res.write(data, 'utf8');
					res.end();
				});
				break;
			default:
				for (var key in getHandlers) {
					var uhReg = new RegExp(key, "i");
					var querystrings = url.parse(req.url, true).query;
					if (uhReg.test(getpath)) {
						try {
							getHandlers[key](req, res, querystrings);
						} catch(ex) {
							if (erorrHandlers.get) {
								return erorrHandlers.get(req, res);
							} else {
								return send404(res);
							}
						}
					}
				}
				urlHandler(req, res, getpath);
		}
	},
	urlHandler = function (req, res, getpath) {
		var scriptfile;
		for (var key in urlHandlers) {
			var uhReg = new RegExp(key, "i");
			if (uhReg.test(getpath)) {
				scriptfile = urlHandlers[key];
				break;
			}
		}
		if (scriptfile !== undefined) {
			fs.readFile("./" + scriptfile, function (err, data) {
				if (err) return send404(res);
				var format = scriptfile.split(".");
				res.writeHead(200, {'Content-Type': web.mimes[format[format.length -1]]});
				res.write(data, 'utf8');
				res.end();
			});
		} else {
			fileHandler(req, res, getpath);
		}
	},
	postHandler = function (req, res, postpath) {
        var request = {};
		content = content.replace(/\[object Object\]/gi,"");
		request = qs.parse(content);
		for (var key in postHandlers) {
			var uhReg = new RegExp(key, "i");
			if (uhReg.test(postpath)) {
				try {
					postHandlers[key](req, res, request);
				} catch(ex) {
					if (erorrHandlers.post) {
						return erorrHandlers.post(req, res);
					} else {
						return send404(res);
					}
				}
			}
		}
    },
	fileHandler = function (req, res, getpath) {
		fs.readFile("./" + getpath, function (err, data) {
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': web.mimes[getpath.split(".", 2)[1]]});
			res.write(data, 'utf8');
			res.end();
		});
	};

//Method
web.get = function (_gethandlers) {
	getHandlers.set(_gethandlers);
};
web.post = function (_posthandlers) {
	postHandlers.set(_posthandlers);
};
web.run = function (getpath, port, host) {
	urlHandlers.set(getpath);
	if (port !== undefined) {
		if (host === undefined) {
			server.listen(port);
		} else {
			server.listen(port, host);
		}
	}
};
web.set404 = function (path) {
	fs.readFile("./" + path, function (err, data) {
		page404 += data;
	});
};
web.erorr = function (handlers) {
	erorrHandlers.set(handlers);
};
web.server = server;