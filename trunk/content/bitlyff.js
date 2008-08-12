function bitlyff_hello() {
    alter('Hello from bitlyff! Sorry, but the function you triggered is not yet implemented.');
}

function tinyurl_gotoBitlyUrl(){
	opener.focus();
	self.focus();
	if(opener.gBrowser.addTab) {
		opener.gBrowser.selectedTab = opener.gBrowser.addTab("http://bit.ly/go");
	} else {
		window.open("http://bit.ly/go");
	}
}

function bitlyff_overlayInit(){
    try{
        var oContext = document.getElementById("contentAreaContextMenu");
	oContext.setAttribute("onpopupshowing", "bitlyff_contextShowing(event); "+ oContext.getAttribute("onpopupshowing"));
    } catch(err) { alert(err); }
}

function bitlyff_copyCurrentPage() {
    bitlyff_copyShortUrl(gBrowser.currentURI.spec);
}

function bitlyff_getPageInfo(){
    window.openDialog('chrome://bitlyff/content/pageinfo.xul','bitlyffPageInfo','chrome, centerscreen, resizable');
}

function bitlyff_PageInfoLoad() {
    var titleField 	= document.getElementById("title-field");
    var infoField 	= document.getElementById("info-field");
    
    var url = bitlyff_getShortUrl(opener.gBrowser.currentURI.spec);
    
    if(opener.gBrowser && opener.gBrowser.currentURI){
	titleField.value = "bit.ly information for " + url;
    }
    
    eval('var bitlyresult = ' + bitlyff_getInfo(url));
    infoField.value = bitlyresult.shortenedUrl.long;
}

function bitlyff_copyCurrentAnchor() {
    	if(gContextMenu != null && (gContextMenu.getLinkURL || gContextMenu.linkURL)){		
		var url = (gContextMenu.getLinkURL) ? gContextMenu.getLinkURL() : gContextMenu.linkURL
		bitlyff_copyShortUrl(url);
	}
}

function bitlyff_copyShortUrl(str) {
    var bitlyUrl = bitlyff_getShortUrl(str);
    bitlyff_copyText(bitlyUrl);
}

function bitlyff_getShortUrl(str) {
    var request	= new XMLHttpRequest();
    request.open( "GET", "http://bit.ly/api?url=" + str, false); 
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(null);
    
    return request.responseText;
}

function bitlyff_getInfo(str) {
    var request	= new XMLHttpRequest();
    request.open( "GET", "http://bit.ly/feed.php?url=" + str + "&format=json", false); 
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(null);
    
    return request.responseText;
}

function bitlyff_contextShowing(event){
	try{
		if(document.popupNode.nodeName.toUpperCase() == "A"){
			document.getElementById("bitlyff-context-anchor-menu").setAttribute("collapsed", false);
		} else {
			document.getElementById("bitlyff-context-anchor-menu").setAttribute("collapsed", true);
		}
	} catch(err) {alert(err);}
}

function bitlyff_copyText(str){
	try {
            var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
            clipboard.copyString(str);		
	} catch(err) {alert(err);}
}
 