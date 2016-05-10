/** Remaining Development
Play tagged videos.
Fullscreen video.
Restore video size.
**/
/**List of commands
1.pause video
2.play video
3.mute video
4.unmute video
5.replay video
6.volume up
7.volume down
8.tag videos
**/

function videoEventHandler(command) {
    console.log("Video Section");
	
	/**Variables/Constants**/
    var videoTagged = false;
    var rangevideoarray = [];
    var videoList = document.getElementsByTagName('video');
    var count = 0;

	/**Looping through List of videos**/
    for (var i = 0; i < videoList.length; i++) {
        var that = videoList[i];
		
		/**Check if video is visible**/
        if ($(that).visible()) {
            var iDiv = videoList[i].parentNode;
            var video = videoList[i];
			
			/**Act only on the first visible video**/
            if ((count == 0 || videoTagged) && command != "tag videos") {
				
				/**Pause video**/
                if (command == "pause video") {
                    console.log("paused");
                    video.pause();
                }
                
				/**Play video**/
				if (command == "play video" && video.paused == true) {
                    console.log("play");
                    video.play();
                }
                
				/**Fullscreen Video**/
				if (command == "fullscreen") {
                    video.requestFullscreen();
                }
                
				/**Mute videos**/
				if (command == "mute video") {
                    console.log("mute");
                    $("video").prop('muted', true);
                }
                
				/**Unmute video**/
				if (command == "unmute video") {
                    console.log("unmute");
                    $("video").prop('muted', false);
                }
                
				/**Replay video**/
				if (command == "replay video") {
                    console.log("replay");
                    location.href = window.location.href;
                }
                
				/**Volume up**/
				if (command == "volume up") {
                    console.log("volume up");
                    $("video").prop('muted', false);
                    if ((video.volume + 0.3) < 1) {
                        video.volume = (video.volume + 0.3);
                    } else {
                        video.volume = 1;
                    }
                }
                
				/**Volume down**/
				if (command == "volume down") {
                    console.log("volumne down");
                    if ((video.volume - 0.3) > 0) {
                        video.volume = (video.volume - 0.3);
                    } else {
                        video.volume = 0;
                    }
                }
                			
				count = count + 1;
            } 
			/**Tagging Videos**/
			else {                
                var iDiv = video.parentNode;
                iDiv.style.border = "thin solid #0000FF";
                iDiv.style.opacity = "0.4";
                var height = video.height;
                var that = video;
                $(that).after("<div id=videonumber" + i + " style='  float: left; top:0; position: absolute; margin-top: " + (height / 4) + ";'><h2 style='color: blue; font-size:20px;'>" + i + "</h2></div>");
                rangevideoarray.push(that);
                videoTagged = true;
            }
        }
    }
}