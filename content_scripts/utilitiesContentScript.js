/**Constants/Variables**/
var arr, res, num;

/**Word to number convertor**/
function word2num(str) {
    arr = str.toString() // change to string
        .toLowerCase() // change to lower case
        .replace(/(^\s*)|(\s*$)/g, "") // trim space in head and tail
        .split(/[\s-]+/); // split word with space
    res = 0;
    num = 0;
    arr.forEach(feach);
    return res + num;
}

function feach(word) {
    var Small = {
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'ten': 10,
        'eleven': 11,
        'twelve': 12,
        'thirteen': 13,
        'fourteen': 14,
        'fifteen': 15,
        'sixteen': 16,
        'seventeen': 17,
        'eighteen': 18,
        'nineteen': 19,
        'twenty': 20,
        'thirty': 30,
        'forty': 40,
        'fifty': 50,
        'sixty': 60,
        'seventy': 70,
        'eighty': 80,
        'ninety': 90
    };

    var Magnitude = {
        'hundred': 100,
        'thousand': 1000,
        'million': 1000000,
        'billion': 1000000000,
        'trillion': 1000000000000,
        'quadrillion': 1000000000000000,
        'quintillion': 1000000000000000000,
        'sextillion': 1000000000000000000000,
        'septillion': 1000000000000000000000000,
        'octillion': 1000000000000000000000000000,
        'nonillion': 1000000000000000000000000000000,
        'decillion': 1000000000000000000000000000000000,
    };

    var base = Small[word];
    if (base != null) {
        num = num + base; // add the quantity
    } else {
        base = Magnitude[word]; // get the base
        if (base != null) {
            res += num * base;
            num = 0;
        } else {
            WordtoIntConversionExc = true;
            num = -1
        }
    }
}

/** Highlight & Unhighlight Text **/
function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ? Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function Colour(r, g, b) {

    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var hexRegex = /^#?([a-f\d]{6})$/;
    var shortHexRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/;
    // Make a new Colour object even when Colour is not called with the new operator
    if (!(this instanceof Colour)) {
        return new Colour(r, g, b);
    }

    if (typeof g == "undefined") {
        // Parse the colour string
        var colStr = r.toLowerCase(),
            result;

        // Check for hex value first, the short hex value, then rgb value            
        if (colStr == "transparent") {
            r = 255;
            g = 255;
            b = 255;
        } else if ((result = hexRegex.exec(colStr))) {
            var hexNum = parseInt(result[1], 16);
            r = hexNum >> 16;
            g = (hexNum & 0xff00) >> 8;
            b = hexNum & 0xff;
        } else if ((result = shortHexRegex.exec(colStr))) {
            r = parseInt(result[1] + result[1], 16);
            g = parseInt(result[2] + result[2], 16);
            b = parseInt(result[3] + result[3], 16);
        } else if ((result = rgbRegex.exec(colStr))) {
            r = componentFromStr(result[1], result[2]);
            g = componentFromStr(result[3], result[4]);
            b = componentFromStr(result[5], result[6]);
        } else {

            throw new Error("Colour: Unable to parse colour string '" + colStr + "'");
        }
    }

    this.r = r;
    this.g = g;
    this.b = b;
}

Colour.prototype = {
    equals: function(colour) {
        return this.r == colour.r && this.g == colour.g && this.b == colour.b;
    }
};

function unhighlight(node, colour) {
    if (!(colour instanceof Colour)) {
        colour = new Colour(colour);
    }

    if (node.nodeType == 1) {
        var bg = node.style.backgroundColor;
        if (bg && bg != "initial" && bg != "rgba(0, 0, 0, 0)" && bg != "white") {
            var colorToMatch = new Colour(bg);
        }
        if (bg && JSON.stringify(colour) === JSON.stringify(colorToMatch)) {
            node.style.backgroundColor = "";
        }
    }
    var child = node.firstChild;
    while (child) {
        unhighlight(child, colour);
        child = child.nextSibling;
    }
}

/**Add hours prototype to Date function**/
Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}