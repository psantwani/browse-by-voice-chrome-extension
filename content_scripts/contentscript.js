/**Development Pending
1. Complete basic commands.
2. The keyboard issue.
3. Calling other content scripts
4. Order of calling other content scripts for performance.
5. Logic for disableSearch wrt to Images and SearchEngine.
6. Logic for assigning defaultSearchEngine with correct value.
**/

/**Variables/Constants**/
var lastImageAction = "none";
var ImageActions = ["Tagging", "Opened", "Closed"];
var SearchEngineActivated = false;
var defaultSearchEngine;
var Jqueryscript = document.createElement("script");
var testscript = document.createElement("script");

/**Injecting scripts**/
/**Jquery**/
Jqueryscript.type = "text/javascript";
Jqueryscript.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js";
$('body').before(Jqueryscript);
/**test.js**/
testscript.src = chrome.extension.getURL("web_resources/test.js");
document.body.appendChild(testscript);

/**Commands sent by the App**/
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
	
	/**Local variables**/
    var disableSearch = false;
    var command = msg.action.toLowerCase();
    var locationurl = window.location.href;

	/**Sending command to Record section for display**/
    if (command != "") {
        lastCommand(command);
    }

	/**Sending command to background for storage**/
    chrome.runtime.sendMessage({
        command: "Piyush.says:" + command
    });

	/**Sending current location to background for storage**/
    chrome.runtime.sendMessage({
        command: "I.am.on:" + locationurl.split("/")[2]
    });

    /**Basic Commands **/
    if (command == "refresh") {
        location.reload();
        disableSearch = true;
    }
    
	if (command == "new window") {
        chrome.runtime.sendMessage({
            command: "newwindow"
        });
        disableSearch = true;
    }
    
	if (command == "new tab") {
        chrome.runtime.sendMessage({
            command: "newtab"
        });
        disableSearch = true;
    }
    
	if (command == "reopen tab") {
        chrome.runtime.sendMessage({
            command: 'reopentab'
        });
        disableSearch = true;
    }
    
	if (command == "close other tabs") {
        chrome.runtime.sendMessage({
            command: 'closeothertabs'
        });
        disableSearch = true;
    }
    
	if (command == "first tab") {
        chrome.runtime.sendMessage({
            command: 'firsttab'
        });
    }
    
	if (command == "last tab") {
        chrome.runtime.sendMessage({
            command: 'lasttab'
        });
    }
    
	if (command == "move to left") {
        chrome.runtime.sendMessage({
            command: 'movetoleft',
            count: -1
        });
        disableSearch = true;
    }
    
	if (command == "move to right") {
        chrome.runtime.sendMessage({
            command: 'movetoright',
            count: 1
        });
        disableSearch = true;
    }
    
	if (command == "next tab") {
        chrome.runtime.sendMessage({
            command: 'nexttab',
            offset: 1
        });
        disableSearch = true;
    }
    
	if (command == "previous tab") {
        chrome.runtime.sendMessage({
            command: 'previoustab',
            offset: -1
        });
        disableSearch = true;
    }

    if (command == "close tab") {
        chrome.runtime.sendMessage({
            command: 'closetab'
        });
        disableSearch = true;
    }

    if (command == "back") {
        window.history.back();
        disableSearch = true;
    }
    
	if (command == "forward") {
        window.history.forward();
        disableSearch = true;
    }

    if (command == "zoom in" || command == "zoomin") {
        chrome.runtime.sendMessage({
            command: "zoomin"
        });
        disableSearch = true;
    }
    
	if (command == "zoom out") {
        chrome.runtime.sendMessage({
            command: "zoomout"
        });
        disableSearch = true;
    }
    
	if (command == "normal size") {
        chrome.runtime.sendMessage({
            command: "normalsize"
        });
        disableSearch = true;
    }
    
	if (command == "top") {
        window.scroll(0, 0);
        disableSearch = true;
    }
    
	if (command == "bottom") {
        window.scrollTo(0, document.body.scrollHeight);
        disableSearch = true;
    }
    
	if (command == "down") {
        var hd = window.innerHeight;
        window.scrollBy(0, hd);
        disableSearch = true;
    }
    
	if (command == "up") {
        var hu = window.innerHeight;
        window.scrollBy(0, -hu);
        disableSearch = true;
    }

    if (command == "bookmark this page") {
        chrome.runtime.sendMessage({
            command: "bookmarkpage",
            url: window.location.href,
            title: document.title
        });
        disableSearch = true;
    }
    
	/**Deprecated Remove Bookmark
	if (command == "remove bookmark") {
        chrome.runtime.sendMessage({
            command: "removebookmark",
            title: document.title
        });
        disableSearch = true;
    }
	**/
	
	/**Deprecated open home page
    if (command == "open home page") { 
		window.home();
	}	
	**/
    
	/**Deprecated opne history
	if (command == "open history") {
        window.location.href = "chrome://history"
    }
    **/
	
	/**Deprecated open downloads
	if (command == "open downloads") {
        window.location.href = "chrome://downloads"
    }
    **/
	
	if (command == "clear history") {		
		chrome.runtime.sendMessage({
            command: "clearhistory",
        });        
        disableSearch = true;
    }
    	
	if (command == "clear downloads") {
        chrome.runtime.sendMessage({
            command: "cleardownloads",
        });
    }
    
	if (command == "print this page") {
		window.print();
	}
    
	/**if (command == "save this page") {}	
    if (command == "maximize") {}
    if (command == "minimize") {}
	**/
	
    /**Popular Websites**/
    if (command == "open facebook") {
        location.href = "https://www.facebook.com";
    }
    
	if (command == "open google") {
        location.href = "https://www.google.com";
    }
    
	if (command == "open twitter") {
        location.href = "https://www.twitter.com";
    }
    
	if (command == "open youtube") {
        location.href = "https://www.youtube.com";
    }
	
	if (command == "save website") {		
		chrome.runtime.sendMessage({
            command: "savewebsite",
			saveurl: locationurl.split("/")[0] + "/" + locationurl.split("/")[1] + "/" + locationurl.split("/")[2]
        });        
        disableSearch = true;
	}
	
	if (command.indexOf("open ") == 0){
		var lookup = command.split("open ")[1];
		lookup = lookup.replace(" ","");
		lookup = lookup.trim();
		chrome.runtime.sendMessage({
			command: "openwebsite",
			openurl: lookup
		},function(response){			
			//location.href = response.openurl;
			location.replace(response.openurl);
			disableSearch = true;
			})			
		};	

    /**Categorization of Commands**/
    var imageCommands = ["label images", "left", "right", "close"]; //Image
    var videoCommands = ["pause video", "play video", "mute video", "unmute video",
        "replay video", "volume up", "volume down", "tag videos", "fullscreen"
    ]; //Video
    var searchEngineCommands = ["next page", "previous page", "new search"]; //Search Engine
    var emailCommands = ["check email", "auto login", "change key"]; //Email	
    var searchEngineArray = ["google.", "yahoo.", "bing.", "ask."];
    var searchEngineNumber = -1;

	/**Calling respective content scripts based on command**/
    if (command != "") {
		
		defaultSearchEngine = "google";
		
		/**Checking which search Engine is active right now**/
        for (var i = 0; i < searchEngineArray.length; i++) {
            if (locationurl.split("/")[2].indexOf(searchEngineArray[i]) >= 0) {
                searchEngineNumber = i;
                break;
            }
        }
        
		/**Email Section.Logins**/
        if (emailCommands.indexOf(command) >= 0) {
            disableSearch = true;
            emailEventHandler(command);
        } 
		
		/**Video Section**/
		else if (videoCommands.indexOf(command) >= 0) {
            disableSearch = true;
            videoEventHandler(command);
        } 
		
		/**Image Section**/
		else if (imageCommands.indexOf(command) >= 0 || ImageActions.indexOf(lastImageAction) >= 0) {
            imageEventHandler(command);
        } 
		
		/**Search Engine Section**/
		else if ((searchEngineNumber != -1 && searchEngineCommands.indexOf(command) >= 0) || (searchEngineNumber != -1 || SearchEngineActivated)) {
            searchEngine(command, searchEngineNumber, locationurl.split("/"), defaultSearchEngine);
        }
		
		/**Text Search**/
        if (!disableSearch) {
            doSearch(command);
        }
    }

});