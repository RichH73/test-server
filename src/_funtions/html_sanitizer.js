module.exports = (html) => {
	// WAF ByPass Strings for XSS.
	// https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet

	// html = html + '<Img src = x onerror = "javascript: window.onerror = alert; throw XSS">';
	// html = html + '<Video> <source onerror = "javascript: alert (XSS)">';
	// html = html + '<Input value = "XSS" type = text>';
	// html = html + '<applet code="javascript:confirm(document.cookie);">';
	// html = html + '<isindex x="javascript:" onmouseover="alert(XSS)">';
	// html = html + '"></SCRIPT>”>’><SCRIPT>alert(String.fromCharCode(88,83,83))</SCRIPT>';
	// html = html + '"><img src="x:x" onerror="alert(XSS)">';
	// html = html + '"><iframe src="javascript:alert(XSS)">';
	// html = html + '<object data="javascript:alert(XSS)">';
	// html = html + '<isindex type=image src=1 onerror=alert(XSS)>';
	// html = html + '<img src=x:alert(alt) onerror=eval(src) alt=0>';
	// html = html + '<img  src="x:gif" onerror="window[\'al\u0065rt\'](0)"></img>';
	// html = html + '<iframe/src="data:text/html,<svg onload=alert(1)>">';
	// html = html + '<meta content="&NewLine; 1 &NewLine;; JAVASCRIPT&colon; alert(1)" http-equiv="refresh"/>';
	// html = html + '<svg><script xlink:href=data&colon;,window.open(\'https://www.google.com/\')></script';
	// html = html + '<meta http-equiv="refresh" content="0;url=javascript:confirm(1)">';
	// html = html + '<iframe src=javascript&colon;alert&lpar;document&period;location&rpar;>';
	// html = html + '<form><a href="javascript:\u0061lert(1)">X';
	// html = html + '</script><img/*%00/src="worksinchrome&colon;prompt(1)"/%00*/onerror=\'eval(src)\'>';
	// html = html + '<style>//*{x:expression(alert(/xss/))}//<style></style>';
	// html = html + '<img src="/" =_=" title="onerror=\'prompt(1)\'">';
	// html = html + '<a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa href=j&#97v&#97script:&#97lert(1)>ClickMe';
	// html = html + '<script x> alert(1) </script 1=2';
	// html = html + '<form><button formaction=javascript&colon;alert(1)>CLICKME';
	// html = html + '<input/onmouseover="javaSCRIPT&colon;confirm&lpar;1&rpar;"';
	// html = html + '<iframe src="data:text/html,%3C%73%63%72%69%70%74%3E%61%6C%65%72%74%28%31%29%3C%2F%73%63%72%69%70%74%3E"></iframe>';
	// html = html + '<OBJECT CLASSID="clsid:333C7BC4-460F-11D0-BC04-0080C7055A83"><PARAM NAME="DataURL" VALUE="javascript:alert(1)"></OBJECT>';

	return (
		html
			//.replace(/<a.*>/gi, '') // remove <a tag
			.replace(/<script.*>/gi, '') // remove <script tag
			.replace(/<img.*>/gi, '') // remove <img tag
			.replace(/<iframe.*>/gi, '') // remove <iframe tag
			.replace(/<form.*>/gi, '') // remove <form tag
			.replace(/<source.*>/gi, '') // remove <source tag, i.e. <video><source></video>
			.replace(/<applet.*>/gi, '') // remove <applet tag
			.replace(/<input.*>/gi, '') // remove <intput tag
			.replace(/<object.*>/gi, '') // remove <object tag
			.replace(/<isindex.*>/gi, '') // remove <isindex tag
			.replace(/<meta.*>/gi, '') // remove <meta tag
			.replace(/expression\(.*\)/gi, '') // remove css expressions
			.replace(/\S*@\S*\s?/gi, '')
	); // remove email addresses, e.g. jharre@madmobile.com
};
