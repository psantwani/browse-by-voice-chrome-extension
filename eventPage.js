/**Add Elseif instead of if conditions 
Change title of bookmark folder
**/

/**Variables/Constants **/
var zoomfactor = 1;
var closedtabs;
var opentabs;
var appId = "";
var extensionId = "";
var bookmarkParentId = "2";
var commandTroop = [];
var checkpoint = [];
var opentabs = {};
var closedtabs = [];

/**Get App and Extension Id **/
chrome.management.getAll(function(items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.name == "Browse By Voice Manager") {
            appId = item.id;
        }
    }
    extensionId = chrome.runtime.id;    
});

/**Messages From App**/
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {        
	
		/**If app is manually closed**/
        if (request.myCustomMessage == "Force closing App") {
            console.log("force close");
            chrome.runtime.sendMessage({
                command: "Force closing App"
            });
        }
		
		/**Status of android connection sent by App**/
        if (request.myCustomNotification == "AboutConnection") {
            if (request.ConnectionStatus == "Success") {
                chrome.runtime.sendMessage({
                    command: "ConnectionStatus",
                    result: "success"
                });
            } else if (request.ConnectionStatus == "Failure") {
                chrome.runtime.sendMessage({
                    command: "ConnectionStatus",
                    result: "failure"
                });
            } else if (request.ConnectionStatus == "Closed") {
                chrome.runtime.sendMessage({
                    command: "ConnectionStatus",
                    result: "closed"
                });
            }
        }

		/**Response to messages sent by app.**/
        if (request.myCustomMessage) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: request.myCustomMessage
                }, function(response) {});
            });
            sendResponse({
                "result": "Ok, got your message"
            });
        } else {
            sendResponse({
                "result": "Ops, I don't understand this message"
            });
        }
    });

/**Messages within extension**/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

		/**Get Username on autoLogin. Storage : webUrl**/
        if (request.command == "usernameEmail") {
            var allWebUrls = [];
            var WebsiteSaved = false;
            chrome.storage.sync.get("webUrl", function(items) {
                for (var i = 0; i < items.webUrl.length; i++) {
                    var requestedUrl;
                    requestedUrl = request.webUrl.split("/")[2];
                    if (items.webUrl[i].webUrl == requestedUrl && items.webUrl[i].Master == request.masterKey) {
                        WebsiteSaved = true;
                        sendResponse({
                            username: items.webUrl[i].Username
                        });
                    }
                }

                if (!WebsiteSaved) {
                    sendResponse({
                        username: "Website not saved"
                    });
                }

            });
            return true;
        }

		/**Get Password on autoLogin, Storage : webUrl**/
		if (request.command == "passwordEmail") {

            chrome.storage.sync.get("webUrl", function(items) {
                var requestedUrl;
                for (var i = 0; i < items.webUrl.length; i++) {
                    requestedUrl = request.webUrl.split("/")[2];
                    if (items.webUrl[i].webUrl == requestedUrl && items.webUrl[i].Master == request.masterKey) {
                        sendResponse({
                            password: items.webUrl[i].Password
                        });
                    }
                }
            });
            return true;
        }

		/**Chrome notification on autoLogin exception**/
        if (request.command == "ChromeNotification") {
            if (request.message == "No Login") {
                chrome.notifications.create(
                    extensionId, {
                        type: 'basic',
                        iconUrl: 'images/icon_16.png',
                        title: 'Browse By Voice',
                        message: 'You have no saved logins for this page',
                        priority: 0
                    },
                    function() { /* Error checking goes here */ }

                );
            }
        }
		
		/**Check if App is running or closed**/
        if (request.command == "Check app status") {
            var Appstate;
            chrome.runtime.sendMessage(
                appId, {
                    myCustomMessage: "Check app status"
                },
                function(response) {
                    if (typeof response == "undefined") {
                        Appstate = "off";
                    } else if (response.state == "on") {
                        Appstate = "on";
                    }
                    chrome.runtime.sendMessage({
                        command: "App Status Reply",
                        state: Appstate
                    });
                }
            );
        }

		/**Send Android connect Password to App**/
        if (request.command == "PasswordSend") {
            var ConnectionStatus = "Status";
            chrome.runtime.sendMessage(
                appId, {
                    myCustomMessage: "ConnectToAndroid",
                    sessionPassword: request.password.toString(),
                    action: request.action
                }
            );            
        }
		
		/**Obselete Command. Storage: cmdMsg**/
        if (request.command == "cmdMsg") {
            chrome.storage.sync.get("cmdMsg", function(items) {
                sendResponse({
                    msgEcho: items.cmdMsg
                });
            });
            return true;
        }

		/**Fire Open and Close App command and send extensionID on open**/
        if (request.command == "launchApp" && appId != "") {
            if (request.action == "on") {
                chrome.management.launchApp(appId, function() {
                    console.log("Running");
                    setTimeout(function() {
                            chrome.runtime.sendMessage(
                                appId, {
                                    myCustomMessage: "myAddress",
                                    setExtId: extensionId
                                });

                        },
                        1000);
                });
            }
            if (request.action == "off") {
                chrome.runtime.sendMessage(
                    appId, {
                        myCustomMessage: "closeApp"
                    });
            }
        }

		/**Maintaing a list of last 20 commands. Storage : commandTroop**/
        if (request.command.indexOf("Piyush.says") >= 0) {
            if (commandTroop.length > 20) {
                commandTroop.slice(0, 10);
            }
            if (commandTroop[commandTroop.length - 1] != request.command.split(":")[1]) {
                commandTroop.push(request.command.split(":")[1]);
            }
            chrome.storage.sync.set({
                "commandTroop": commandTroop
            });
        }

		/**Maintaing a list of last 10 websites visited. Storage : checkpoint**/
        if (request.command.indexOf("I.am.on") >= 0) {
            if (checkpoint.length > 10) {
                checkpoint.slice(0, 5);
            }

            if (checkpoint[checkpoint.length - 1] != request.command.split(":")[1]) {
                checkpoint.push(request.command.split(":")[1]);
            }
            chrome.storage.sync.set({
                "checkpoint": checkpoint
            });            
        }

		/**Action on basic commands**/
        if (request.command == "newwindow"){
            chrome.windows.create({
                'url': 'https://www.google.com'
            });
		}
        
		if (request.command == "newtab"){
            chrome.tabs.create({
                url: "https://www.google.com"
            });
		}
		
        if (request.command == "closetab") {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.remove(tab.id);
            });
        }

        if (request.command == "bookmarkpage") {

            chrome.bookmarks.create({
                "title": "Voice Bookmarks"
            }, function(result) {
                console.log(result);
            });

            chrome.bookmarks.create({
                "title": request.title,
                "url": request.url
            }, function(result) {
                bookmarkParentId = result.parentId;
            });
        }

		if (request.command == "clearhistory") {
           chrome.browsingData.removeHistory({"since": 0});
        }
		
        if (request.command == "cleardownloads") {
            /**chrome.downloads.erase();**
			var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
			var oneWeekAgo = (new Date()).getTime() - millisecondsPerWeek;
			chrome.browsingData.remove({
				"since": oneWeekAgo
			}, {			
			"downloads": true,			
			"history": true,			
			});
			**/
			chrome.browsingData.removeDownloads({"since": 0});
        }

		/**Depracated remove bookmark
        if (request.command == "removebookmark") {
            chrome.bookmarks.remove(bookmarkParentId);
        }
		**/
        
		if (request.command == "firsttab" || request.command == "lasttab") {
            tabSwitch(0, request.command);
        }

        if (request.command == "nexttab" || request.command == "previoustab") {
            tabSwitch(request.offset, request.command);
        }

        if (request.command == "movetoleft" || request.command == "movetoright") {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.move(tab.id, {
                    index: tab.index + request.count
                });
            });
        }

        if (request.command == "closeothertabs") {
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.getAllInWindow(tab.windowId, function(tabs) {
                    var t, tabids;
                    tabids = (function() {
                        var i, len, results;
                        results = [];
                        for (i = 0, len = tabs.length; i < len; i++) {
                            t = tabs[i];
                            if (t.id !== tab.id) {
                                results.push(t.id);
                            }
                        }
                        return results;
                    })();
                    chrome.tabs.remove(tabids);
                });
            });
        }

        if (request.command == "reopentab") {
            var index, url, ref;
            if (closedtabs.length) {
                ref = closedtabs.pop(), url = ref.url, index = ref.index;
                return chrome.tabs.create({
                    url: url,
                    index: index
                });
            }
        }

        if (request.command == "zoomin") {
            zoomfactor = zoomfactor + 0.2;
            chrome.tabs.setZoom(zoomfactor);
        }

        if (request.command == "zoomout") {
            zoomfactor = zoomfactor - 0.2;
            chrome.tabs.setZoom(zoomfactor);
        }

        if (request.command == "normalsize") {
            chrome.tabs.setZoom(0);
            zoomfactor = 1;
        }

		/**Check current page url**/
        if (request.command == "locationcheck") {
            chrome.tabs.query({
                'active': true,
                'lastFocusedWindow': true
            }, function(tabs) {
                sendResponse({
                    website: tabs[0].url
                });
            });
            return true;
        };
		
		/**Check if the selected device is a microphone or android device**/
        if (request.command == "devicecheck") {
            if (request.device == "microphone") {
                if (appId != "") {
                    sendResponse({
                        message: 0
                    });
                } else {
                    sendResponse({
                        message: 1
                    });
                }
            }
            if (request.device == "android") {
                sendResponse({
                    message: 2
                });
            }
            if (request.device == "") {
                sendResponse({
                    message: 3
                });
            }
        }

		/**Save new website for future quicklaunch**/
		if (request.command == "savewebsite"){	
			var urlarray = [];
			chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            if (allKeys.indexOf("savewebsite") >= 0) {
				chrome.storage.sync.get("savewebsite", function(items) {					
					urlarray = items.savewebsite;
					if(urlarray.indexOf(request.saveurl) == -1){
						urlarray.push(request.saveurl);
						console.log(urlarray);
						chrome.storage.sync.set({
						"savewebsite": urlarray
					});
					}					
				});
			}
			else{
					urlarray.push(request.saveurl);
					chrome.storage.sync.set({
						"savewebsite": urlarray
					});
				}			
			})
		}
		
		/**Open newly saved websites**/
		if (request.command == "openwebsite"){	
			chrome.storage.sync.get("savewebsite", function(items) {							
				var websitearray = items.savewebsite;				
				console.log(websitearray);
				for(var t = 0; t < websitearray.length; t++){
					console.log(websitearray[t]);
					if(websitearray[t].indexOf(request.openurl) != -1){	
						console.log("success");
						sendResponse({
							openurl: websitearray[t]
						});
						break;
					}					
				}				
            });		
			return true;
		}
    });

/** Generic Functions **/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab && changeInfo.status === 'complete') {
        return opentabs[tabId] = tab;
    }
});

chrome.tabs.onRemoved.addListener(function(tabId) {
    var tabInfo;
    if (!(tabId in opentabs)) {
        return;
    }
    tabInfo = opentabs[tabId];
    delete opentabs[tabId];
    return closedtabs.push(tabInfo);
});

tabSwitch = function(count, command) {
    chrome.tabs.getSelected(null, function(tab) {
        var newIndex;
        newIndex = tab.index + count;
        chrome.tabs.getAllInWindow(null, function(tabs) {
            if (command == "firsttab") {
                newIndex = 0
            };
            if (command == "lasttab") {
                newIndex = tabs.length - 1
            };
            console.log(newIndex);
            var i, len, results;
            results = [];
            for (i = 0, len = tabs.length; i < len; i++) {
                tab = tabs[i];
                if (tab.index === newIndex) {
                    chrome.tabs.update(tab.id, {
                        selected: true
                    });
                    break;
                } else {
                    results.push(void 0);
                }
            }
        });
    });
};