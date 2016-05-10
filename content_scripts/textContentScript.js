/**Placeholder Search -Constants/Variables**/
var originalcolors = [];
var placeholdercolors = ['lightgreen'];
var placehodernodes = [];
var targetInputList = [];
var searchText;
var highlighted = false;

/**Text Search - Constants/Variables**/
var rangenodearray = [];
var colors = ['yellow', 'blue', 'red', 'orange', 'green', 'pink'];
var colorshex = ["ffff00", "0000ff", "ff0000", "ffa500", "00ff00", "ffc0cb"];

function doSearch(text) {

    /**Placeholder Search **/
    if (text.indexOf("search ") == 0) {
        count = 0;
        placehodernodes = [];
        targetInputList = [];
        var placeholders1;
        placeholders1 = $('input:text');
        for (var m = 0; m < placeholders1.length; m++) {
            if ((typeof placeholders1[m] == "undefined") && $(placeholders1[m]).visible() && (typeof placeholders1[m].placeholder == "undefined" || placeholders1[m].placeholder == "")) {
                targetInputList.push(placeholders1[m]);
                originalcolors.push($(placeholders1[m]).css('backgroundColor'));
                placeholders1[m].style.backgroundColor = placeholdercolors[count];
                placeholders1[m].visibility = "visible";
                placeholders1[m].style.setProperty('display', 'block', 'important');
                count++;
                /**highlighted = true;**/
            }
        }

        placeholders2 = $("input[placeholder]");
        count = 0;
        for (var i = 0; i < placeholders2.length; i++) {
            var that = placeholders2[i];
            that.style.setProperty('display', 'block', 'important');
            if (placeholders2[i].placeholder != "" && $(that).visible()) {
                targetInputList.push(placeholders2[i]);
                originalcolors.push($(placeholders2[i]).css('backgroundColor'));
                $(that).css("background-color", placeholdercolors[count]);
                count++;
                /**highlighted = true;**/
            }
        }

        placehodernodes = targetInputList;
        if (placehodernodes.length > 0) {
            var colorReset;
            for (var k = 0; k < placehodernodes.length; k++) {
                if (placehodernodes[k].style.backgroundColor == "lightgreen") {
                    if (originalcolors[k] == "" || typeof originalcolors[k] == "undefined") {
                        colorReset = "transparent";
                    } else {
                        colorReset = originalcolors[k];
                    }
                    placehodernodes[k].style.backgroundColor = colorReset;

                    placehodernodes[k].value = "";
                    searchText = text.split("search ")[1];
                    $(placehodernodes[k]).simulate("key-sequence", {
                        sequence: searchText
                    });

                    var form = $(placehodernodes[k]).closest('form')[0];
                    if (typeof form != "undefined") {                        						
						/**$(form).find(":submit")[0].click(); For GMAIL **/
						/**console.log($(form).find(":button"))
						**/
						form.submit();												
                    }
                }
            }
        }
        return;
    }

	/**Text Search - Color**/
	if (colors.indexOf(text) > -1 && highlighted){
		var index = colors.indexOf(text);
		var that2 = rangenodearray[index];
		var offset2 = $(that2).offset();
		var posY = offset2.top - $(window).scrollTop();
        var posX = offset2.left - $(window).scrollLeft();		
        document.elementFromPoint(posX, posY).click();
		highlighted = false;        
	}
	
    /**Text Search - No Color**/
    if (text != "" && window.find && window.getSelection) {
		document.getSelection().empty();
        document.designMode = "on";
		
		unhighlight(document.body, "ffff00");
        unhighlight(document.body, "0000ff");
        unhighlight(document.body, "ff0000");
        unhighlight(document.body, "ffa500");
        unhighlight(document.body, "00ff00");
        unhighlight(document.body, "ffc0cb");
		
		rangenodearray = [];				
		var count = 0;		
		var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        ];
		
		var sel = window.getSelection();
        sel.collapse(document.body, 0);        
			
        while (window.find(text)) {
            document.execCommand("HiliteColor", false, colorshex[count]);
            sel.collapseToEnd();
            count = count + 1;
            var highlightMe = sel.getRangeAt(0);
            var that = highlightMe.commonAncestorContainer.parentNode;
            if ($(that).visible()) {
                rangenodearray.push(highlightMe.commonAncestorContainer.parentNode);
            } else {
                unhighlight(document.body, colorshex[count]);
            }
            highlighted = true;
        }        
		document.designMode = "off";            
		window.scrollTo(scrollPosition[0], scrollPosition[1]);		
		if(rangenodearray.length == 1){			
            var that1 = rangenodearray[0];
			var offset1 = $(that1).offset();
            offset1 = $(that1).offset();
            var posY = offset1.top - $(window).scrollTop();
            var posX = offset1.left - $(window).scrollLeft();
            rangenodearray[0].click();
		}
    }		

}