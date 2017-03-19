
(function () {
    'use strict';
    (function () {
        bildgalleri.main = (function () {

            // This prompts user to log in to flickr and allow full access for application
            bildgalleri.flickrService.getToken().then(function (result) {
                /*
                    Load images when first entering page
                */
                loadRecentImages();

                /*
                    EventListener for Searchbutton
                    search flickr for images by tags
                */
                document.getElementById("searchButton").addEventListener('click', function () {
                    // remove old images if its a first search
                    if (!bildgalleri.flickrService.userSearched())
                        document.getElementById("photos").innerHTML = "";

                    userSearch();
                });

                /*
                   EventListener for Load More Images Button
                */
                document.getElementById("loadImages").addEventListener('click', function () {
                    // if user searched it wants to see more images related to search
                    // else user gets to see random new pictures
                    if (bildgalleri.flickrService.userSearched()) {
                        userSearch();
                    } else {
                        loadRecentImages();
                    }

                });

                /*
                    EventListener for Get recent Button
                */
                document.getElementById("getRecentButton").addEventListener('click', function () {
                    document.getElementById("photos").innerHTML = "";
                    loadRecentImages();
                });

                /*
                    EventListener for back button, hides divs and displays #photos
                */
                document.getElementById("back").addEventListener("click", function () {
                    document.getElementById("originalPhoto").style.display = 'none';
                    document.getElementById("gallery").style.display = 'none';
                    document.getElementById("photos").style.display = 'inline';
                });

                /*
                    uses flickrService.getRecent on entering homepage
                */
                function loadRecentImages() {
                    var method = "flickr.photos.getRecent";
                    bildgalleri.flickrService.getRecent().then(function (response) {
                        var result = JSON.parse(response);
                        var result = result.photos.photo;
                        appendImages(result);

                    }, function (error) {
                        console.log("something went wrong")
                    });
                }

                function userSearch() {
                    var method = "flickr.photos.search";
                    var tags = document.getElementById("searchField").value;
                    // Get images from flickr
                    bildgalleri.flickrService.search(tags).then(function (response) {
                        var result = JSON.parse(response);
                        var result = result.photos.photo;

                        // append images to mainContent
                        appendImages(result);
                    }, function (error) {
                        console.log("something went wrong");
                    });
                }

                // creates image objects and attaches eventlistener.
                // appens images to dom
                var appendImages = function (jsonObj) {
                    document.getElementById("photos").style.display = 'inline';
                    document.getElementById("originalPhoto").style.display = 'none';
                    document.getElementById("gallery").style.display = 'none';
                    for (var key in jsonObj) {
                        // closure to make eventlisteners stick to its object
                        (function () {
                            var photoUrl = "http://farm" + jsonObj[key].farm + ".static.flickr.com/"
                                + jsonObj[key].server + "/" + jsonObj[key].id
                                + "_" + jsonObj[key].secret + "_" + "b.jpg";

                            // create img
                            var img = document.createElement("img");
                            img.src = photoUrl;
                            img.style.height = '300px';
                            img.style.width = '300px';

                            // append image to #photos
                            var src = document.getElementById("photos");
                            src.appendChild(img);
                            //  src.appendChild(link);

                            // add eventlistener to every image
                            img.onclick = function () {
                                // hide all images
                                document.getElementById("photos").style.display = 'none';
                                document.getElementById("gallery").style.display = 'none';
                                var test = document.getElementById("originalPhoto");
                                if (test.childNodes.length > 2) {
                                    test.removeChild(test.childNodes[2]);
                                }
                                document.getElementById("originalPhoto").style.display = 'inline';
                                var temp = document.createElement("img");
                                temp.src = photoUrl;
                                temp.id = jsonObj[key].id + '_' + jsonObj[key].secret;
                                temp.style.height = '800px';
                                temp.style.width = '800px';
                                // append image
                                var src = document.getElementById("originalPhoto");
                                src.appendChild(temp);
                            };
                        }());
                    }
                }
            }, function (error) {
                console.log("token error");
                oauth_object = temp;
            });
        }());
    }());
}());

