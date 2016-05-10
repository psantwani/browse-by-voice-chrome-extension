var RecordingButton = document.getElementById("onoffbutton");
var newLoginButton = document.getElementById("newlogin");
var devicesList = document.getElementById("deviceslist");
var saveButton = document.getElementById("SaveChanges");
var messages = [
"Listening... Tip : Use a headset for better experience."
,"You will have to install our voice app to listen to you. Get Browsing. <a href='#' class='appLinks' target='_blank'>Link</a>"
,"Download our android app and command your browser from phone. <a href='#' class='appLinks' target='_blank'>Link</a>"
,"Please set a recording device in the Settings section."
]
var messageIndex = -1;

$(function() {
	Boxlayout.init();
});

(function() {
	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {	
		new SelectFx(el);
	} );
})();		

[].slice.call( document.querySelectorAll( 'button.progress-button' ) ).forEach( function( bttn ) {
				new ProgressButton( bttn, {
					callback : function( instance ) {
						var progress = 1,
							interval = setInterval( function() {
								progress = Math.min( progress + Math.random() * 1, 1 );
								instance._setProgress( progress );

								if( progress === 1 ) {
									instance._stop(1);
									clearInterval( interval );
								}
							}, 200 );
					}
				} );
			} );
			
RecordingButton.onclick = function(){		
	if(RecordingButton.checked){
	var selectedDevice = devicesList.value;
	chrome.runtime.sendMessage({
		command: "devicecheck",
		device: selectedDevice
	}, function(response) {
        messageIndex = response.message;
		if(messageIndex != -1){
		$(".blackboard > p").html(messages[messageIndex]);
	}
    });		
	}
	else{
	$(".blackboard > p").html("Switch on the button and Browse by Voice.");
	}
}			

newLoginButton.onclick = function(){
	chrome.runtime.sendMessage({
		command: "locationcheck",		
	}, function(response) {
        var www = response.website;		
		document.getElementById("webUrl").value = www.split("/")[2];		
});
}

saveButton.onclick = function() {
    var emailUsername = document.getElementById('loginEmail').value;
    var emailPassword = document.getElementById('loginPassword').value;    
    chrome.storage.sync.set({
        "emailUsername": emailUsername
    });
    chrome.storage.sync.set({
        "emailPassword": emailPassword
    });    
}


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
  
  $( ".addedTag" ).click(function() {
  $(this).next().children().slideToggle("fast");
  $(this).next().children().focus();  
});

$("#MasterKeySubmit").click(function(){
if($("#masterPassword").val() != ""){
$("#MasterLogin").hide();
$("#showPassword").show();
}
});

