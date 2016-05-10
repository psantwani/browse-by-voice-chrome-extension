/** Remaining Development
**/
/**List of commands
1. Next page
2. Previous page.
**/

/** Check this. Delete if not required.
var searchEngineSelected;
function isAsearchEngine(element, index, array) {
    var url = window.location.href;
    var arr = url.split("/");
    for (var i = 0; i < array.length; i++) {
        if (arr[2].indexOf(array[i]) >= 0) {
            searchEngineSelected = element;
            return true;
        }
    }
    return false;
}
**/

/**Use defaultSearchEngine instead of google in New Search Command**/
function searchEngine(text, searchEngineIndex, arr, defaultSearchEngine) {
	console.log("Search Engine");	
	if (searchEngineIndex >= 0) {
		
		/**New Search command**/
		if (text == "new search"){
			window.location.href = "https://www." + defaultSearchEngine + ".com";
			SearchEngineActivated = true;
			disableSearch = true;						
		}
        
		/**Next and Previous Page navigation on search result page**/
		else if (text == "next page" || text == "previous page") {
            searchEnginePagination(text, arr, searchEngineIndex);
			disableSearch = true;
        } 
		
		/**Google Search**/
		else if (searchEngineIndex == 0 && text.indexOf("google") >= 0) {			
			text = text.replace("google ","");
			location.href = arr[0] + "//" + arr[2] + "/#q=" + text;
			SearchEngineActivated = false;
			disableSearch = true;
        } 
		
		/**Yahoo Search**/
		else if (searchEngineIndex == 1 && text.indexOf("yahoo") >= 0) {			
			text = text.replace("yahoo ","");
			if(arr[2].indexOf("search") == -1){
				arr[2] = arr[2].replace("yahoo","search.yahoo");
			}			
			location.href = arr[0] + "//" + arr[2] + "/search;?p=" + text + "&b=1";
			SearchEngineActivated = false;			
			disableSearch = true;
        } 
		
		/**Bing Search**/
		else if (searchEngineIndex == 2 && text.indexOf("bing") >= 0) {			
			text = text.replace("bing ","");	
			location.href = arr[0] + "//" + arr[2] + "/search?q=" + text + "&first=1";
			SearchEngineActivated = false;			
			disableSearch = true;
        } 
		
		/**Ask Search**/
		else if (searchEngineIndex == 3 && text.indexOf("ask") >= 0) {			
			text = text.replace("ask ","");
            location.href = arr[0] + "//" + arr[2] + "/web?q=" + text + "&page=1";
			SearchEngineActivated = false;			
			disableSearch = true;
        }
    } 
	else {
        //console.log("No Match");
    }
}

/**Pagination on Search Result Page**/
function searchEnginePagination(command, arr, searchEngineIndex) {
    if (command == "next page" || command == "previous page") {	
		/**Google**/
        if (searchEngineIndex == 0) {
            splitUrlGoogle(command, arr);
        }
		
		/**Yahoo**/
		if (searchEngineIndex == 1){
			splitUrlYahoo(command, arr);
		}
		
		/**Bing**/
		if (searchEngineIndex == 2){
			splitUrlBing(command, arr);
		}
		
		/**Ask**/
		if (searchEngineIndex == 3){
			splitUrlAsk(command, arr);
		}
    }    
}

/**Pagination logic for Google**/
function splitUrlGoogle(command, arr) {
    var hash = window.location.hash.substring(1);
	var qPart = hash.substr(hash.indexOf('q='))
        .split('&')[0]
        .split('=')[1];
    var startPart = hash.substr(hash.indexOf('start='))
        .split('&')[0]
        .split('=')[1];
	if (command == "next page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = (Math.floor(startPart / 10)) * 10 + 10;                    
                } else {
                    startPart = 10;
                }
            } else {
                startPart = 10;
            }
            window.location.href = arr[0] + "//" + arr[2] + "/#q=" + qPart + "&start=" + startPart;
        }
    } else if (command == "previous page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = (Math.floor(startPart / 10)) * 10 - 10;                    
                } else {
                    startPart = 0;
                }
            } else {
                startPart = 0;
            }
            if (startPart < 0) {
                startPart = 0;
            }
            if (startPart > 0) {
                window.location.href = arr[0] + "//" + arr[2] + "/#q=" + qPart + "&start=" + startPart;
            } else {
                window.location.href = arr[0] + "//" + arr[2] + "/#q=" + qPart;
            }
        }
    }
}

/**Pagination logic for Yahoo**/
function splitUrlYahoo(command, arr) {
    var hash = window.location.search;
    var qPart = hash.substr(hash.indexOf('?p='))
        .split('&')[0]
        .split('=')[1];
    var startPart = hash.substr(hash.indexOf('b='))
        .split('&')[0]
        .split('=')[1];	

    if (command == "next page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {					
					startPart = parseInt(startPart) + 10;  					
                } else {
                    startPart = 1;
                }
            } else {
                startPart = 1;
            }
            window.location.href = arr[0] + "//" + arr[2] + "/search;?p=" + qPart + "&b=" + startPart.toString();
        }
    } else if (command == "previous page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = parseInt(startPart) - 10;                    
                } else {
                    startPart = 0;
                }
            } else {
                startPart = 0;
            }
            if (startPart < 0) {
                startPart = 0;
            }
            if (startPart > 0) {
                window.location.href = arr[0] + "//" + arr[2] + "/search;?p=" + qPart + "&b=" + startPart.toString();
            } else {
                window.location.href = arr[0] + "//" + arr[2] + "/search;?p=" + qPart + "&b=1";
            }
        }
    }
}

/**Pagination logic for Ask**/
function splitUrlAsk(command, arr) {
    var hash = window.location.search;
	console.log(hash);
    var qPart = hash.substr(hash.indexOf('?q='))
        .split('&')[0]
        .split('=')[1];
    var startPart = hash.substr(hash.indexOf('page='))
        .split('&')[0]
        .split('=')[1];
	console.log(qPart);
	console.log(startPart);
    if (command == "next page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = (Math.floor(startPart / 1)) * 1 + 1;     
                } else {
                    startPart = 1;
                }
            } else {
                startPart = 1;
            }
            window.location.href = arr[0] + "//" + arr[2] + "/web?q=" + qPart + "&page=" + startPart;
        }
    } else if (command == "previous page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = (Math.floor(startPart / 1)) * 1 - 1;     
                } else {
                    startPart = 0;
                }
            } else {
                startPart = 0;
            }
            if (startPart < 0) {
                startPart = 0;
            }
            if (startPart > 0) {
                window.location.href = arr[0] + "//" + arr[2] + "/web?q=" + qPart + "&page=" + startPart;
            } else {
                window.location.href = arr[0] + "//" + arr[2] + "/web?q=" + qPart + "&page=1";
            }
        }
    }
}

/**Pagination logic for Bing**/
function splitUrlBing(command, arr) {
    var hash = window.location.search;	
	var qPart = hash.substr(hash.indexOf('?q='))
        .split('&')[0]
        .split('=')[1];
    var startPart = hash.substr(hash.indexOf('first='))
        .split('&')[0]
        .split('=')[1];
	
    if (command == "next page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = (Math.floor(startPart / 13)) * 13 + 13;     
                } else {
                    startPart = 1;
                }
            } else {
                startPart = 1;
            }
            window.location.href = arr[0] + "//" + arr[2] + "/search?q=" + qPart + "&first=" + startPart;
        }
    } else if (command == "previous page") {
        if (qPart) {
            if (startPart) {                
                if (!isNaN(startPart)) {
                    startPart = (Math.floor(startPart / 13)) * 13 - 13;     
                } else {
                    startPart = 0;
                }
            } else {
                startPart = 0;
            }
            if (startPart < 0) {
                startPart = 0;
            }
            if (startPart > 0) {
                window.location.href = arr[0] + "//" + arr[2] + "/search?q=" + qPart + "&first=" + startPart;
            } else {
                window.location.href = arr[0] + "//" + arr[2] + "/search?q=" + qPart + "&first=1";;
            }
        }
    }
}
