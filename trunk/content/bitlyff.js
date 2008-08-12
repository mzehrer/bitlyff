function bitlyff_hello() {
    alter('Hello from bitlyff! Sorry, but the function you triggered is not yet implemented.');
}

function bitlyff_gotoUrl(str){
	opener.focus();
	self.focus();
	if(opener.gBrowser.addTab) {
		opener.gBrowser.selectedTab = opener.gBrowser.addTab(str);
	} else {
		window.open(str);
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
    var visThumbnailField = document.getElementById("visthumbnail-field");
    
    var longField 	= document.getElementById("long-field");
    var shortField 	= document.getElementById("short-field");
    var mirrorField 	= document.getElementById("mirror-field");
    
    var smallThumbnailField = document.getElementById("thumbnail-small-field");
    var mediumThumbnailField = document.getElementById("thumbnail-medium-field");
    var largeThumbnailField = document.getElementById("thumbnail-large-field");
    
    var clicksField = document.getElementById("clicks-field");
    
    var refGrid = document.getElementById("refgrid");
    var refGridRows = document.getElementById("refgridrows");
    
    if(opener.gBrowser && opener.gBrowser.currentURI){
	var url = bitlyff_getShortUrl(opener.gBrowser.currentURI.spec);
        eval('var bitlyresult = ' + bitlyff_getInfo(url));
        
        bitlyff_AddUrlLabel(longField, bitlyresult.shortenedUrl.long);
        bitlyff_AddUrlLabel(shortField, bitlyresult.shortenedUrl.short);
        if (bitlyresult.shortenedUrl.mirror) {
            bitlyff_AddUrlLabel(mirrorField, bitlyresult.shortenedUrl.mirror);
        }
        
        /** if (bitlyresult.shortenedUrl.thumbnails.small) {
           visThumbnailField.onload = function() {
                if (visThumbnailField && visThumbnailField.src != "")  {
                    visThumbnailField.setAttribute("width", visThumbnailField.naturalWidth);
                    visThumbnailField.setAttribute("height", visThumbnailField.naturalHeight);
                    window.resizeBy(0, visThumbnailField.naturalHeight)
                }
            }
            visThumbnailField.src = bitlyresult.shortenedUrl.thumbnails.small;
        } else {
            visThumbnailField.setAttribute("collapsed", true);
        } **/
        
        if (bitlyresult.shortenedUrl.thumbnails.small) {
            bitlyff_AddUrlLabel(smallThumbnailField, bitlyresult.shortenedUrl.thumbnails.small);
        }
        if(bitlyresult.shortenedUrl.thumbnails.medium) {
            bitlyff_AddUrlLabel(mediumThumbnailField, bitlyresult.shortenedUrl.thumbnails.medium);
        }
        if(bitlyresult.shortenedUrl.thumbnails.large) {
            bitlyff_AddUrlLabel(largeThumbnailField, bitlyresult.shortenedUrl.thumbnails.large);
        }
        
        if (bitlyresult.shortenedUrl.clicks) {
            clicksField.value = bitlyresult.shortenedUrl.clicks;
        }
        
        if (bitlyresult.shortenedUrl.referrers && bitlyresult.shortenedUrl.referrers.length > 0) {
            for (var i=0; i < bitlyresult.shortenedUrl.referrers.length; i++) {
                var newRow = document.createElement("row");
                
                var sourceLabel = document.createElement("label");
                bitlyff_AddUrlLabel(sourceLabel, bitlyresult.shortenedUrl.referrers[i].referrer.source);
                
                var clicksLabel = document.createElement("label");
                clicksLabel.setAttribute("value", bitlyresult.shortenedUrl.referrers[i].referrer.clicks);
                
                newRow.appendChild(sourceLabel);
                newRow.appendChild(clicksLabel);
                
                refGridRows.appendChild(newRow);
            }           
        } else {
             refGrid.setAttribute("collapsed", true);    
        }
        

    }
}

function bitlyff_AddUrlLabel(field, str){
    field.setAttribute("value", str);
    field.setAttribute("style", "color: #00F; text-decoration: underline; cursor: pointer;");
    field.setAttribute("onclick", "bitlyff_gotoUrl('" + str + "');");
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

function bitlyff_copyfieldvalue(str) {
    var element = document.getElementById(str);
    bitlyff_copyText(element.value);
}

function bitlyff_copyText(str){
	try {
            var clipboard = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);
            clipboard.copyString(str);		
	} catch(err) {alert(err);}
}
 