/**Variables/Constants**/
var RecordingButton = document.getElementById("onoffbutton");
var newLoginButton = document.getElementById("newlogin");
var devicesList = document.getElementById("deviceslist");
var saveButton = document.getElementById("SaveChanges");
var defaultEmailList = document.getElementById("defaultEmail");
var defaultEngineList = document.getElementById("defaultSearchEngine");
var sessionConnect = document.getElementById("sessionConnect");
var messageIndex = -1;
var globalweb;
var supressNotification = false;
var connectionFailed = false;
var deviceList = ["Microphone | Headset", "Android App"];
var defaultEmail = ["Gmail", "Yahoo", "Hotmail"];
var defaultEngine = ["Google", "Yahoo", "Bing", "Ask"];
var messages = [
    "Listening... Tip : Use a headset for better experience.", "You will have to install our voice app to listen to you. Get Browsing. <a href='#' class='appLinks' target='_blank'>Link</a>", "Download our android app and command your browser from phone. <a href='#' class='appLinks' target='_blank'>Link</a>", "Please set a recording device in the Settings section."
]

/**Box shaped popup**/
$(function() {
    Boxlayout.init();
});

/**Generic functions - Utilities**/
(function() {
    [].slice.call(document.querySelectorAll('select.cs-select')).forEach(function(el) {
        new SelectFx(el);
    });
})();

[].slice.call(document.querySelectorAll('button.progress-button')).forEach(function(bttn) {
    new ProgressButton(bttn, {
        callback: function(instance) {
            var progress = 1,
                interval = setInterval(function() {
                    progress = Math.min(progress + Math.random() * 1, 1);
                    instance._setProgress(progress);

                    if (progress === 1) {
                        instance._stop(1);
                        clearInterval(interval);
                    }
                }, 200);
        }
    });
});

/**Clicking Connect To Android Button. Mostly obselete**/
sessionConnect.addEventListener('click', function() {
    //appendLog("sending to "+sendId.value);	
    chrome.runtime.sendMessage(
        sendId.value, {
            myCustomMessage: sendText.value
        },
        function(response) {
            //appendLog("response: "+JSON.stringify(response));
        })
});

/**Checking if the app is closed or not during record section click**/
$("#RecordSection").on("click", function() {
    chrome.runtime.sendMessage({
        command: "Check app status"
    }, function(response) {})
});

/**Messages From Background/App**/
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		/**Status reply from app : On or Off**/
        if (request.command == "App Status Reply") {
            if (RecordingButton.checked && request.state == "off") {
                supressNotification = true;
                RecordingButton.click();
            }
            if (!RecordingButton.checked && request.state == "on") {
                supressNotification = true;
                RecordingButton.click();
            }
        }
        
		/**Message from app on manual closure**/
		if (request.command == "Force closing App") {
            $(".blackboard > p").html("Switch on the button and Browse by Voice.");
            notifyUser("failure", notification_html[5]);
            chrome.storage.sync.set({
                "switchButtonState": false
            });
        }
        
		/**Message from android app about Connection Status**/
		if (request.command == "ConnectionStatus") {
            if (request.result == "failure") {
                connectionFailed = true;
            }
            if (request.result == "success") {
                console.log(notification_html[1]);
                notifyUser("success", notification_html[1]);
                $("#sessionConnect").html("Disconnect");
            }
            if (request.result == "failure") {
                notifyUser("failure", notification_html[2]);
                $("#sessionConnect").html("Connect to Android");
            }
            if (!connectionFailed) {
                if (request.result == "closed") {
                    notifyUser("failure", notification_html[2]);
                    $("#sessionConnect").html("Connect to Android");
                }
                connectionFailed = false;
            }

        }
    });

/**Playing with Next Project span in Settings section**/	
$(".bl-next-work").on("click", function() {
    var links = ["BASIC SETTINGS", "ADVANCED", "NEW LOGIN"];
    var index = links.indexOf(this.innerHTML.toString().split("&gt; ")[1]);
    if (index == 2) {
        index = -1;
    }
    $(".bl-next-work").html("&gt; " + links[index + 1]);
});

$(".button--line").on("click", function() {
    var buttonText = $(this).children(".button__text").html();
    if (buttonText == "BASIC") {
        $(".bl-next-work").html("&gt; " + "ADVANCED");
    }
    if (buttonText == "ADVANCED") {
        $(".bl-next-work").html("&gt; " + "NEW LOGIN");
    }
    if (buttonText == "NEW LOGIN") {
        $(".bl-next-work").html("&gt; " + "BASIC SETTINGS");
    }

});

/**Click Connect to Android button. Sending password to app and changing button text. Getting last saved password.**/
sessionConnect.onclick = function() {
    var sessionPassword = document.getElementById("sessionPassword");
    if (sessionPassword.value != "") {
        console.log("Requesting Connection");
        sessionPassword.style.borderColor = "#8dc9e5";
        chrome.runtime.sendMessage({
            command: "PasswordSend",
            password: sessionPassword.value,
            action: $("#sessionConnect").html()
        });
        if ($("#sessionConnect").html() == "Disconnect") {            
            $("#sessionConnect").html("Connect to Android");
        }
        chrome.storage.sync.set({
            lastSessionPassword: sessionPassword.value
        });
    } else {
        sessionPassword.style.borderColor = "#d7565b";
        chrome.storage.sync.set({
            lastSessionPassword: sessionPassword.value
        });
    }
}

/**Clicking Record Button ON/OFF. Checking device being used. Launching or closing app**/
RecordingButton.onclick = function() {
    if (RecordingButton.checked) {
        var selectedDevice = devicesList.value;
        chrome.storage.sync.set({
            "switchButtonState": true
        });
        chrome.runtime.sendMessage({
            command: "devicecheck",
            device: selectedDevice
        }, function(response) {
            messageIndex = response.message;
            if (messageIndex == 0 && !supressNotification) {
                notifyUser("success", notification_html[4]);
            }
            if (messageIndex == 2 && !supressNotification) {
                notifyUser("success", notification_html[10]);
            }
            if (messageIndex != -1) {
                $(".blackboard > p").html(messages[messageIndex]);
            }
            if (messageIndex == 0 || messageIndex == 2) {
                chrome.runtime.sendMessage({
                    command: "launchApp",
                    action: "on"
                });
            }
        });
    } else {
        $(".blackboard > p").html("Switch on the button and Browse by Voice.");
        if (!supressNotification) {
            notifyUser("failure", notification_html[5]);
        }
        chrome.storage.sync.set({
            "switchButtonState": false
        });
        chrome.runtime.sendMessage({
            command: "launchApp",
            action: "off"
        });
    }
    supressNotification = false;
}

/**Getting current website url on new login button click**/
newLoginButton.onclick = function() {
    chrome.runtime.sendMessage({
        command: "locationcheck",
    }, function(response) {
        var www = response.website;
        document.getElementById("webUrl").value = www.split("/")[2];
        globalweb = www.split("/")[2];
    });
}

/**Saving new login credentials**/
saveButton.onclick = function() {
    var emailUsername = document.getElementById('loginEmail').value;
    var emailPassword = document.getElementById('loginPassword').value;
    var webUrl = document.getElementById('webUrl').value;
    var masterKey = document.getElementById('masterPasswd').value;
    var entryExists = 0;
    if (emailUsername != "" && emailPassword != "" && webUrl != "" && masterKey != "") {

        chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            if (allKeys.indexOf("webUrl") >= 0) {
                chrome.storage.sync.get("webUrl", function(items) {
                    for (var i = 0; i < items.webUrl.length; i++) {
                        if (items.webUrl[i].webUrl == globalweb &&
                            items.webUrl[i].Master == masterKey) {
                            entryExists = 1;
                        }
                    }
                    if (entryExists == 0) {
                        var oldValues = items.webUrl;
                        console.log(oldValues);
                        console.log(oldValues.webUrl);
                        var newValue = {
                            Master: masterKey,
                            webUrl: webUrl,
                            Username: emailUsername,
                            Password: emailPassword
                        };
                        oldValues.push(newValue);
                        console.log(oldValues);
                        console.log(oldValues);
                        chrome.storage.sync.set({
                            webUrl: oldValues
                        });
                        notifyUser("success", notification_html[7]);
                    } else {
                        notifyUser("failure", notification_html[6]);
                        //Throw entry already exists message here. Use a different masterkey
                    }
                });
            } else {
                var newValue = [{
                    Master: masterKey,
                    webUrl: webUrl,
                    Username: emailUsername,
                    Password: emailPassword
                }];
                console.log(newValue);
                chrome.storage.sync.set({
                    webUrl: newValue
                });
                notifyUser("success", notification_html[7]);
            }
        });
    } else {
        notifyUser("failure", notification_html[8]);
    }
}

/**Playing with tags in advanced Settings. Adding/Removing/Making list**/
$(document).ready(function() {
    $('#addTagBtn').click(function() {
        $('#tags option:selected').each(function() {
            $(this).appendTo($('#selectedTags'));
        });
    });
    $('#removeTagBtn').click(function() {
        $('#selectedTags option:selected').each(function(el) {
            $(this).appendTo($('#tags'));
        });
    });
    $('.tagRemove').click(function(event) {
        event.preventDefault();
        $(this).parent().remove();

    });
    $('ul.tags').click(function() {
        $('#search-field').focus();
    });
    $('#search-field').keypress(function(event) {
        if (event.which == '13') {
            if ($(this).val() != '') {
                $('<li class="addedTag">' + $(this).val() + '<span class="tagRemove" onclick="$(this).parent().remove();">x</span><input type="hidden" value="' + $(this).val() + '" name="tags[]"></li>').insertBefore('.tags .tagAdd');
                $(this).val('');
            }
        }
    });

});

/**Toggling login tag on click and deleting on clicking X**/
$("#tagList").on("click", "li", function(e) {
    if (e.target.nodeName == "LI") {
        if ($(this).hasClass("addedTag")) {
            if ($(this).hasClass("addedTag")) {
                $(this).next().children().slideToggle("fast");
                $(this).next().children().focus();
            }
        }
    }
    if (e.target.nodeName == "SPAN") {
        var deleteMe = $(this).children("span");
        var listValue = deleteMe[0].parentNode.innerHTML.split("<span")[0];
        chrome.storage.sync.get({
            webUrl: []
        }, function(items) {
            for (var d = 0; d < items.webUrl.length; d++) {
                if (items.webUrl[d].webUrl == listValue) {
                    var that = deleteMe[0].parentNode.nextSibling.children[0];
                    that.remove();
                    deleteMe[0].parentNode.remove();
                    items.webUrl.splice(d, 1);
                    notifyUser("failure", notification_html[9]);
                    console.log(items.webUrl);
                }
            }
            chrome.storage.sync.set({
                webUrl: items.webUrl
            });
        });
    }
});

/**Submitting master key and generating list based on entered master key**/
$("#MasterKeySubmit").click(function() {
    var bttn = document.getElementById("MasterKeySubmit");
    var keyValue = $("#masterPassword").val();
    var showPasswordList = [];
    console.log(keyValue);
    if (keyValue != "") {
        chrome.storage.sync.get(null, function(items) {
            var allKeys = Object.keys(items);
            console.log(allKeys);
            if (allKeys.indexOf("masterKeys") >= 0) {
                chrome.storage.sync.get("masterKeys", function(items) {
                    if (items.masterKeys.indexOf(keyValue) >= 0) {
                        chrome.storage.sync.get("webUrl", function(items) {
                            console.log(items.webUrl);
                            for (var i = 0; i < items.webUrl.length; i++) {
                                if (items.webUrl[i].Master == keyValue) {
                                    showPasswordList.push(items.webUrl[i]);
                                }
                            }
                            console.log(showPasswordList);
                            var Listnode = "";
                            if (showPasswordList.length == 0) {
                                notifyUser("failure", notification_html[11]);
                                Listnode = Listnode + "<li class='addedTag'> demo" +
                                    "<span class='tagRemove'>x</span></li><li><input type='text' name = 'tags[]' class='tagText' value='demo'" +
                                    "></li>"
                            }
                            for (var k = 0; k < showPasswordList.length; k++) {
                                Listnode = Listnode + "<li class='addedTag'>" + showPasswordList[k].webUrl +
                                    "<span class='tagRemove'>x</span></li><li><input type='text' name = 'tags[]' class='tagText' value='" +
                                    showPasswordList[k].Password +
                                    "'></li>"
                            }
                            $("#tagList").html(Listnode);
                        });
                        $("#MasterLogin").hide();
                        $("#showPassword").show();
                    } else {
                        items.masterKeys.push(keyValue);
                        chrome.storage.sync.set({
                            masterKeys: items.masterKeys
                        });
                        notifyUser("success", notification_html[0]);
                        $("#masterPassword").val("");                        
                    }
                });
            } else {
                var masterKeySet = [];
                masterKeySet.push(0);
                masterKeySet.push(keyValue);
                chrome.storage.sync.set({
                    masterKeys: masterKeySet
                });
            }
        });
    }
});

/**Saving options in Settings. Storage: devices,email,searchEngine**/
$('.cs-options > ul > li').on('click', function() {
    var selectedOption = $(this).children('span').html();
    if (deviceList.indexOf(selectedOption) >= 0) {
        chrome.storage.sync.set({
            "devices": selectedOption
        });
    }
    if (defaultEmail.indexOf(selectedOption) >= 0) {
        chrome.storage.sync.set({
            "email": selectedOption
        });
    }
    if (defaultEngine.indexOf(selectedOption) >= 0) {
        chrome.storage.sync.set({
            "searchEngine": selectedOption
        });
    }
});

/**Loading saved Settings on body load**/
document.body.onload = function() {
    
	/**Use it to clear all saved Settings**/
	//chrome.storage.sync.clear();

	/**Load last submitted Android Session Password**/
    chrome.storage.sync.get("lastSessionPassword", function(items) {
        if (typeof items.lastSessionPassword != "undefined") {
            $("#sessionPassword").val(items.lastSessionPassword);
        } else {
            $("#sessionPassword").val("");
        }
    });

	/**Load saved default Email Provider**/
    chrome.storage.sync.get("email", function(items) {
        $("#defaultEmail option").filter(function() {
            return $(this).text() == items.email;
        }).prop('selected', true);
        $("#defaultEmail").parents('.cs-select').children('.cs-placeholder').html(items.email);
    });

	/**Load saved default Search Engine**/
    chrome.storage.sync.get("searchEngine", function(items) {
        $("#defaultSearchEngine option").filter(function() {
            return $(this).text() == items.searchEngine;
        }).prop('selected', true);
        $("#defaultSearchEngine").parents('.cs-select').children('.cs-placeholder').html(items.searchEngine);
    });

	/**Load saved selected device**/
    chrome.storage.sync.get("devices", function(items) {
        $("#deviceslist option").filter(function() {
            return $(this).text() == items.devices;
        }).prop('selected', true);
        $("#deviceslist").parents('.cs-select').children('.cs-placeholder').html(items.devices);
    });

	/**Load last message saved in commandTroop**/
    chrome.storage.sync.get("cmdMsg", function(items) {
        //cmdMsg.innerHTML = items.cmdMsg
        $(".blackboard > p").html(items.cmdMsg);
    });

	/**Load last known state of Record Button - ON/OFF**/
    chrome.storage.sync.get("switchButtonState", function(items) {
        if (items.switchButtonState) {
            RecordingButton.checked = true;
        } else {
            RecordingButton.checked = false;
            $(".blackboard > p").html("Switch on the button and Browse by Voice.");
        }
    });
}

/**Last command function. Used to retrieve last said command**/
function lastCommand(command) {
    chrome.storage.sync.set({
        "cmdMsg": command
    }, function() {
        chrome.runtime.sendMessage({
            command: "cmdMsg",
            Msg: command
        }, function(response) {});
    });
}

/**Check on change in storage values of cmdMsg and switchButtonState. Storage: cmdMsg, switchButtonState**/
chrome.storage.onChanged.addListener(function(changes, namespace) {
    var storageChange = changes['cmdMsg'];
    var switchChange = changes['switchButtonState'];
    if (switchChange.newValue) {
        RecordingButton.checked = true;
    } else {
        RecordingButton.checked = false;
        $(".blackboard > p").html("Switch on the button and Browse by Voice.");
    }
    cmdMsg.innerHTML = storageChange.newValue;
});

/**Validation for Android Session Password.Obselete**/
$(function() {
    // Validation
    $("#sky-form").validate({
        // Rules for form validation
        rules: {
            password: {
                required: true
            }
        },

        // Messages for form validation
        messages: {
            password: {
                required: 'Please enter the Session password'
            }
        },

        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
});

/**Settings:Sliding Notifications inside popup**/
function generate(type, text) {
    var n = noty({
        text: text,
        type: type,
        dismissQueue: true,
        layout: 'topLeft',
        theme: 'relax',
        maxVisible: 10,
        animation: {
            open: 'animated bounceInLeft',
            close: 'animated bounceOutLeft',
            easing: 'swing',
            speed: 500
        },
        timeout: true
    });
    console.log('html: ' + n.options.id);
}

/**Success or Failure notification.Notify**/
function notifyUser(status, message) {    		
    switch (status) {
        case "success":
            generate('success', message);
            break;

        case "failure":
            generate('error', message);
            break;
    }
    setTimeout(function() {
        var that = $(".i-am-new")[0];
        console.log($(that).children("li"));
        $(that).children("li").click();
    }, 3500);
}