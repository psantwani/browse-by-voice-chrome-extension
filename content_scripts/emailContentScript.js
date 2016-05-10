/**Constants/Variables**/
var emailProvider;
var emailPageRequest = false;
var globalweb;
var entryExists = 0;
var masterkeySet = false;
var InvalidMasterKey = false;
var retVal;

/**Check if Master key has been set already. If yes, dont prompt again**/
function isMasterKeySet() {
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
		/**Check if storage has masterkeySetForSession set**/
        if (allKeys.indexOf("masterKeys") >= 0) {
            chrome.storage.sync.get("masterkeySetForSession", function(items) {
                masterkeySet = items.masterkeySetForSession;
				/**Prompt key**/
                if (!items.masterkeySetForSession) {
                    autoLoginWithKey();
                } 
				
				/**Login with prompt**/
				else {
                    chrome.storage.sync.get("masterkeyValueForSession", function(items) {
                        autoLogin(items.masterkeyValueForSession);
                    });
                }
            });
            return true;
        } 
		/**Set masterkeySetForSession in chrome Storage. Storage : masterkeySetForSession**/
		else {
            chrome.storage.sync.set({
                masterkeySetForSession: false
            });
            masterkeySet = false;
            return false;
        }
    });
}

/**Main function. Calls other functions**/
function emailEventHandler(command) {
    console.log("Email Section");
	
	/**Get default email provider**/
    chrome.storage.sync.get("email", function(items) {
        emailProvider = items.email;
        if (typeof emailProvider != "undefined" || emailProvider != "") {
            /**defaultEmailSelected = true;		**/
            emailFunction(command);
        }
    });

	/**Auto login Call**/
    if (command == "auto login") {
        chrome.runtime.sendMessage({
            command: "locationcheck",
        }, function(response) {
            globalweb = response.website;           
            isMasterKeySet();
        });
    }
}

/**Navigates to default email Provider on 'check email' command**/
function emailFunction(command) {
    if (command == "check email") {
        location.href = "https://www." + emailProvider + ".com";
        emailPageRequest = true;
    }
}

/**Auto Login without prompt**/
function autoLogin(chromeMasterKey) {
	/**Local constants/variables**/
    var allInputs = document.getElementsByTagName('input');
    var allbuttons = document.getElementsByTagName('button');
    var emailFlag = false;
    var passwordFlag = false;
    var submitFlag = false;
    var notFound = false;
    var submitButton;
    var username;
    var password;
    var form;
    var count = 0;
    var usernameFilled = false;
    var PasswordFilled = false;
	
	/**Check for email/text/password/submit inputs on page**/
    for (var i = 0; i < allInputs.length; i++) {
        var that = allInputs[i];
        if (allInputs[i].type == "email" && !emailFlag && $(that).visible()) {
            allInputs[i].type = "text";
            username = allInputs[i];
            emailFlag = true;
            //console.log("username check");
            form = $(allInputs[i]).closest('form')[0];
            count++;
            continue;
        } else if (allInputs[i].type == "text" && emailFlag != true && $(that).visible()) {
            username = allInputs[i];
            //console.log("username check");			
            form = $(allInputs[i]).closest('form')[0];
            count++;
            continue;
        }
        if (allInputs[i].type == "password" && !passwordFlag && $(that).visible()) {
            password = allInputs[i];
            passwordFlag = true;
            //console.log("password check");
            form = $(allInputs[i]).closest('form')[0];
            count++;
            continue;
        }
        if (allInputs[i].type == "submit" && !submitFlag && $(that).visible()) {
            submitButton = allInputs[i];
            //console.log("submit check");
            submitFlag = true;
            form = $(allInputs[i]).closest('form')[0];
            continue;
        }
    }

	/**If username input is found**/
    if (typeof username != "undefined") {
        username.value = "";
        var fillUsername;
		/**Get username for saved MasterKey for the current website**/
        chrome.runtime.sendMessage({
            command: "usernameEmail",
            webUrl: globalweb,
            masterKey: chromeMasterKey
        }, 
		function(response) {
            if (entryExists == 1 || masterkeySet) {
                fillUsername = response.username;
				
				/**If username not found, throw a popup with a message**/
                if (typeof fillUsername == "undefined" || fillUsername == "" || fillUsername == "Website not saved") {
                    notFound = true;
                    alert("You have no saved logins for this page");                    
                } 
				
				/**If username is found, do the following.**/
				else {                                       
					
					/**Setting and Saving MasterKey if its coming from the prompt. Storage : masterkeySetForSession, masterkeyValueForSession**/
					chrome.storage.sync.set({
                        masterkeySetForSession: true
                    });
										
                    chrome.storage.sync.set({
                        masterkeyValueForSession: chromeMasterKey
                    });
                    
					/**Populating username input with saved username**/
					$(username).simulate("key-sequence", {
                        sequence: fillUsername
                    });
                    
					usernameFilled = true;
                    
					/**If password input box is absent, submit username**/
					if (typeof password == "undefined") {
                        if (typeof form != "undefined") {
                            form.submit();
                        } else if (typeof submitButton == "undefined") {
                            for (var j = 0; j < allbuttons.length; j++) {
                                submitButton = allbuttons[j];
                            }
                            submitButton.click();
                        } else {

                            submitButton.click();

                        }
                    }
                }
            }
        });
    }

	/**If password input is found**/
    if (typeof password != "undefined") {
        password.value = "";
        var fillPassword;
		
		/**Find saved password**/
        chrome.runtime.sendMessage({
            command: "passwordEmail",
            webUrl: globalweb,
			masterKey: chromeMasterKey
        }, 
		function(response) {
			
			/**Fill password if found**/
            if (!notFound && (entryExists == 1 || masterkeySet)) {
                fillPassword = response.password;
                $(password).simulate("key-sequence", {
                    sequence: fillPassword
                });
                PasswordFilled = true;
                if (typeof username == "undefined" || usernameFilled) {
                    if (typeof form != "undefined") {
                        form.submit();
                    } else if (typeof submitButton == "undefined") {
                        for (var j = 0; j < allbuttons.length; j++) {
                            submitButton = allbuttons[j];
                        }
                        submitButton.click();
                    } else {
                        submitButton.click();
                    }
                }
            }
        });
    }
}

/**Auto login with prompt**/
function autoLoginWithKey() {

	/**Prompt to enter Master key**/
    retVal = prompt("Enter Master Key once : ", "");
	
	/**Analyze Entered Master key**/
    if (retVal != "" || typeof retVal != "undefined") {
		/**Check if master key exists**/
        chrome.storage.sync.get("webUrl", function(items) {
            for (var i = 0; i < items.webUrl.length; i++) {
                if (items.webUrl[i].webUrl == globalweb.split("/")[2] &&
                    items.webUrl[i].Master == retVal) {
                    entryExists = 1;
                    chrome.storage.sync.set({
                        masterkeySetForSession: true
                    });
                    InvalidMasterKey = false;
                }
            }
			
			/**Throw a message alert if master key does not exist**/
            if (entryExists == 0) {
                alert("The master key you entered does not exist.");
                chrome.storage.sync.set({
                    masterkeySetForSession: false
                });
                InvalidMasterKey = true;
            }
            
			/**Call autoLogin if valid MasterKey**/
			if (entryExists == 1){
				autoLogin(retVal);
			}
        });
    }

}