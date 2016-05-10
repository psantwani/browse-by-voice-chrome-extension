/**Random Script**/
var input;

/**Function 1**/
var waitForLoad = function() {
    if (typeof jQuery != "undefined") {
        $('body').prepend("<button id='enterButton' style='display:none;'>Show Button</button>");
        $(document).ready(function() {            
            $('body').click(function(e) {
                input = e.target.id;
            });
        });
        $("#enterButton").on("click", function(e) {
            buttonClick();
        });
    } else {
        window.setTimeout(waitForLoad, 1000);
    }
};
window.setTimeout(waitForLoad, 1000);

/**Function 2**/
function buttonClick() {
    var that = $(".PiArigato")[0];
    var form = $(that).closest('form')[0];
    if (typeof form != "undefined") {
        form.submit();
    } else {
        console.log(form);
    }    
}