state = {
	APIURL : "https://www.googleapis.com/youtube/v3/search",
	currentSearch : "",
	nextPageToken : "",
	itemsPerPage : 5
}

$(function() {
	// initial search
	$("#searchform").submit(function(e) {
		e.preventDefault();
		var searchTerm = $("#searchinput").val();
		if (searchTerm) {
			$('.resultlist').empty();
			state.currentSearch = searchTerm;
			getDataFromApi(searchTerm, displayResults);
		}
		$("#searchinput").val("");
	});
	// see more
	$(".seemore").click(function(){
		getDataFromApi(state.currentSearch, displayResults);
	});
});

function getDataFromApi(searchTerm, callback) {
  var settings = {
    url: state.APIURL,
    data: {
	    part: "snippet",
	    maxResults: state.itemsPerPage,
	    q: searchTerm,
        pageToken: state.nextPageToken,
	    order: "viewCount",
	    type: "video",
    	key: "AIzaSyC2bkJzNUsbTKKber3wT8JR2uD11SmWOuE"
	},
    success: callback,
  };
  $.ajax(settings);
}

function displayResults(results) {
	//console.log(results);
	for (var i=0; i<results.items.length; i++) {
		var thumbnail = results.items[i].snippet.thumbnails.default["url"];
		var videoLink = "http://www.youtube.com/watch?v=" + results.items[i].id.videoId;
		var videoTitle = results.items[i].snippet.title;
		var channelTitle = results.items[i].snippet.channelTitle;
		var channelLink = "https://www.youtube.com/channel/" + results.items[i].snippet.channelId;
		if (videoTitle.length > 27) {
			videoTitle = videoTitle.substring(0, 27).trim() + "...";
		}
		// construct html results
		$('.resultlist').append(
			"<div class=\"singleresult\">" +
				"<a class=\"fancybox-media\" href=\"" + videoLink + "\">" +
					"<img src=\"" + thumbnail + "\"></img>" +	
				"</a>" +
				"<div class=\"video-title\">" + videoTitle + "</div>" +
				"<div class=\"channel-link\"><a href=\"" + channelLink + "\" target=\"_blank\">" + channelTitle + "</a></div>" +
			"</div>");	
	}

	// record nextPageToken
	state.nextPageToken = results.nextPageToken;
	
	if (results.items.length >= state.itemsPerPage) {
		$('.seemore').removeClass("hidden");
	} else {
		$('.seemore').addClass("hidden");
	}

	// link fancybox to newly created elements
	$('.fancybox-media').fancybox({
		openEffect  : 'fade',
		closeEffect : 'fade',
		helpers : {
			media : {}
		}
	});
}