$(document).ready(function() {
        $("#warning").hide();

        function search() {
                //Gets value of search box to use in API call to wikipedia
                var itemToSearch = $("#searchInput").val(), results = [], blurbs = [], pageIds, title, body;

                //Display error message and css animation if not valid input for search
                if (!itemToSearch) {

                        $("#warning").show();
                        $("#searchInput ,#search-btn").addClass("shake");

                        //allow css animation to be repeated if multiple invalid searches performed
                        setTimeout(function () {
                                $("#searchInput ,#search-btn").removeClass("shake");
                        }, 1000);

                } else {

                        $("#warning").hide();

                        //Make api call
                        $.getJSON("https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts%7Cpageimages&generator=search&exsentences=1&exlimit=20&exintro=1&explaintext=1&pilimit=50&gsrsearch=" + itemToSearch + "&origin=*", function(json){
                                results.push(json.query.pages);

                                //returns array of object's own enumerable properties - essentially flattens an array containing an object array
                                pageIds = Object.keys(results[0]);

                                //get and style first 10 results
                                for (var i = 0; i < pageIds.length; i++) {
                                        title = json.query.pages[pageIds[i]].title, body = json.query.pages[pageIds[i]].extract;
                                        blurbs.push("<div class='panel panel-default'><div class='panel-heading'><h3 class='panel-title'>" + title + "</h3></div><div class='panel-body'>" + body + "</br></div></div></div>");
                                }

                                //display results on page
                                $("#result").html(blurbs);

                                //close autocomplete - stops autocomplete showing on screen if quick search is done
                                $("#searchInput").autocomplete("close");

                                //go to relevant wikipedia page on panel click
                                $(".panel").on("click", function() {
                                        var page = this;
                                        var thing = $(this).filter(".panel-default").find(".panel-title").html();
                                        window.open("https://en.wikipedia.org/wiki/" + thing, "_blank");
                                });
                        });
                }
        }

        //Enable autocomplete on search bar
        $("#searchInput").autocomplete({

                //get results from wikipedia to display
                source: function(request, response) {
                        $.getJSON("http://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=" + request.term, function(data) {
                                response(data[1]);
                        });
                },

                //perform search on click autocomplete item
                select: function(event, ui) {
                        $("#searchInput").val(ui.item.value);
                        search();
                }
        });

        //on search bar text entry
        $("#searchInput").on("keydown", function(e) {

                //tidy heading, move search bar to top of screen
                $("#tail").remove();
                $("#heading").css({"margin-top" : "0px"});

                //if enter key pressed close autocomplete menu and run search function
                if (e.which == 13) {
                        $("#searchInput").autocomplete("close");
                        search();
                }
        });

        //perform search on search button click
        $("#search-btn").on("click", function(e) {
                search();
        });
});