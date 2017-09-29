$(document).ready(function() {
var streams = ["OgamingSC2", "esl_sc2", "TSM_Bjergsen", "Syndicate", "Reckful", "freecodecamp", "cretetion", "habathcx", "kiichichaosreigns"], markupArr = [], online = [], offline = [];

//call getInfo function for each channel in streams array
streams.forEach(getInfo);

//retrieves API info and displays on the page
function getInfo(username) {
    //get channel information
    $.getJSON("https://wind-bow.gomix.me/twitch-api/channels/" + username + "/?callback=?", function(data) {
    console.log(data);

    //display error message if channel does not exist
    if (data.status == 404 || data.status == null) {
        markupArr.push("<div class='panel' style='background: yellow'><div class='logo'><img src='http://i1378.photobucket.com/albums/ah103/humanforklift/Twitch%20viewer/jean-victor-balin-unknown-blue_zpsrokednch.jpg' alt=" + username + "></div><div class='name' id='name'>" + username + "</div><div class='status error' id='status'>This channel is not working currently. <br />Click or change tabs to remove.</div></div>");
        
    //display channel information
    } else {
        markupArr.push("<div class='panel'><div class='logo'><img src=" + data.logo + " alt=" + data.display_name + "></div><div class='name' id='name'>" + data.display_name + "</div><div class='status' id=" + username + "></div></div>");
    }
    $(".channels").html(markupArr);
    
        //check if channel is streaming
        $.getJSON("https://wind-bow.gomix.me/twitch-api/streams/" + username + "/?callback=?", function(data) {
            console.log(data);
    
            //channel is online
            if (data.stream) {
                $("#" + username).addClass("online").html("Streaming - " + data.stream.channel.status + ".").addClass("stream-name");

            //channel is offline
            } else {
                $("#" + username).addClass("offline").html("This channel is taking a break.");
            }
    
            //check if channel is online or offline to filter
            $(".panel").each(function(i, obj) {
                if ($(this).children().hasClass("online")) {
                    online.push(obj);
                } else if ($(this).children().hasClass("offline")) {
                    offline.push(obj);
                }
            });
        });
    });
}

//change active tab
$("button").on("click", function() {
    $("button").removeClass("active");
    $(this).addClass("active");

    //change placeholder text depending on which tab is active
    $("#search").hasClass("active") ? ($("input").attr("placeholder", "Let's see what else is on..."), $(".channels").hide(), $(".stream-box").css("padding-bottom", "10px")/*, $(".search").on("keyup", search)*/) : ($("input").attr("placeholder", "Search for one of your channels"), $(".channels").show(), $(".stream-box").css("padding-bottom", "0px"));

    //hide search box if online or offline tabs are active
    $("#online").hasClass("active") || $("#offline").hasClass("active") ? $(".search-bar").css("visibility", "hidden") : $(".search-bar").css("visibility", "visible");

});

//sort online streams
$("#online").on("click", function() {
    $(".channels").html(online);
});

//sort offline streams
$("#offline").on("click", function() {
    $(".channels").html(offline);
});

//show all channels
$("#all").on("click", function() {
    $("input").val("");
    $(".stream-box").css({"margin-top" : "auto"});
    markupArr.forEach(function(item) {
        $(".channels").html(online).append(offline);
    });
});

//function to open twitch stream
function openTwitch(name) {
    window.open("https://www.twitch.tv/" + name, "_blank");
}

//add click events to panels
$(document).on("click", "div.panel", function() {
    var name = $(this).children(".name").html();
    //remove panel if invalid channel
    if ($(this).children().hasClass("status error")) {
        $(this).remove();
    //jump to channel in new window
    } else {
        openTwitch(name);
    }
});

//trigger filter function when text is typed in search bar
$("input").keyup(filter);

function filter() {
    var names = $(".name"), val = $("input").val().toLowerCase(), username, page = $(".channels");
    
    //filter through channels in list if all tab is active
    if ($(this).attr("placeholder") == "Search for one of your channels") {
        for (var i = 0; i < names.length; i++) {
            username = names[i].innerHTML.toLowerCase();
        
            if (username.indexOf(val) != -1) {
                $(".panel")[i].style.display = "";
            } else {
                $(".panel")[i].style.display = "none";
            }
        }
    //search for new streams if find more streams tab is active
    } else {
        //enable autocomplete on search bar
        $("input").autocomplete({

            source: function(request, response) {
                $.ajax({
                    type: 'GET',
                    url: 'https://api.twitch.tv/kraken/search/channels?query=' + request.term,
                    headers: {
                        'Client-ID': 'axjhfp777tflhy0yjb5sftsil'
                    },
                    success: function(data) {
                        $(".stream-box").css({"margin-top" : "0px"});
                        var nameArr = [];
                        for (var i = 0; i < data.channels.length; i++) {
                            nameArr.push(data.channels[i].display_name);
                        }
                        response(nameArr);
                    }
                });
            },

            //open twitch channel of clicked autocomplete item
            select: function(event, ui) {
                $("input").val(ui.item.value);
                var channelName = $("input").val();
                openTwitch(channelName);
            }
        });
    }    
}

});