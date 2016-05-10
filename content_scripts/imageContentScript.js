/**Development Pending
Browsing through images with left and right commands.
Play with chrome.storage.Last.Image.Action.
**/
/** List of commands
1.Tag images
2.Tagged number
3.Left
4.Right
3.close
**/
/**Constants/Variables**/
var number;
var beforeOpenUrl = "";
var imageOffsets = [];
var imageOffsets2 = [];
var posY;
var posX;

function imageEventHandler(command) {
    console.log("Image Section");

    /**Local Constants/Variables**/
    var WordtoIntConversionExc = false;
    var imageOpen = false;
    var imageClosed = false;
    var imageTagged = false;
    var arrowkeys = false;

    /**Close Image**/
    if (command == "close") {
        if (typeof beforeOpenUrl != "undefined" && beforeOpenUrl != "") {
            console.log(beforeOpenUrl);
            lastImageAction = "Closed";
            //document.location.href = beforeOpenUrl;		
            location.replace(beforeOpenUrl);
            beforeOpenUrl = "";
            var imagesList = document.getElementsByTagName('img');
            for (var z = 0; z < imagesList.length; z++) {
                if (imagesList[z].style.opacity == "1") {
                    imagesList[z].style.opacity = "0.4";
                }
            }
        }
    }

    /**Next Image**/
    else if (command == "right") {
        number = number + 1;
        arrowkeys = true;
    }

    /**Previous Image**/
    else if (command == "left") {
        number = number - 1;
        arrowkeys = true;
    }

    /**Label Images**/
    else if (command == "label images") {
        var scrollAmount = $(window).height();
        number = -1;
        var imagesList = document.getElementsByTagName('img');
        var scrollPosition = [
            self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
            self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        ];
        for (var i = 0; i < imagesList.length; i++) {
            //console.log(i);
            $this = imagesList[i];
            var iDiv = imagesList[i].parentNode;
            var image = imagesList[i];
            image.style.opacity = "0.4";
            var height = image.height;
            var that = $this;
            var added = $(that).after("<div id=imagenumber" + i + " style='  float: left; top:0; position: absolute; margin-top: " + (height / 4) + ";'><h2 style='color:white ; font-size:20px;'>" + i + "</h2></div>");
            //console.log($(added).visible());			
            imageTagged = true;
            beforeOpenUrl = window.location.href;
            //console.log(added[0].nextSibling);
            var addedElement = added[0].nextSibling;
            var offset;
            offset = $(addedElement).offset();
            var posY = offset.top - $(window).scrollTop();
            var posX = offset.left - $(window).scrollLeft();
            if ((posY) > scrollAmount) {
                window.scrollTo(posX, posY - (height + 5));
                offset = $(addedElement).offset();
                var posY = offset.top - $(window).scrollTop();
                var posX = offset.left - $(window).scrollLeft();
                imageOffsets.push(document.elementFromPoint(posX, posY - 2));
                imageOffsets2.push(document.elementFromPoint(posX, posY));
            } else {
                imageOffsets.push(document.elementFromPoint(posX, posY - 2));
                imageOffsets2.push(document.elementFromPoint(posX, posY));
            }
            //console.log(imageOffsets[i]);						

        }
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
        console.log(imageOffsets);
        lastImageAction = "Tagging";
        disableSearch = true;
    } else if (isNaN(parseInt(command))) {
        number = word2num(command);
        arrowkeys = false;
    } else {
        number = parseInt(command);
        arrowkeys = false;
    }

    /**Setting and Resetting Opacity and clicking on image on number call**/
    if (!WordtoIntConversionExc && number != -1) {

        var imagesList = document.getElementsByTagName('img');
        for (var z = 0; z < imagesList.length; z++) {
            if (imagesList[z].style.opacity == "0.4") {
                imagesList[z].style.opacity = "1";
            }
        }

        if (!arrowkeys) {
            var offset;
            offset = $("#imagenumber" + number).offset();
            var posY = offset.top - $(window).scrollTop();
            var posX = offset.left - $(window).scrollLeft();
            document.elementFromPoint(posX, posY).click(); // First try normal click.
            document.elementFromPoint(posX, posY - 2).click(); // For facebook photos		
        }
        if (arrowkeys) {
            var that = $("#imagenumber" + number)[0];
            console.log(that);
            //that.click();			
            console.log(imageOffsets);
            console.log(imageOffsets[number]);
            imageOffsets2[number].click();
            imageOffsets[number].click();
            $("#imagenumber" + number).css('opacity', '1');
            //rangeimagearray[number].style.opacity = "1";			

        }
        lastImageAction = "Opened";
    }

    /**disable TextSearch**/
    else {
        disableSearch = true;
    }
}