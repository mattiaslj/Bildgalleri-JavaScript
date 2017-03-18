
(function () {
    'use strict';
    (function () {
        bildgalleri.main = (function () {

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
                    document.getElementById("mainContent").innerHTML = "";

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
                document.getElementById("mainContent").innerHTML = "";
                loadRecentImages();
            });

            /*
                uses flickrService.getRecent on entering homepage
            */
            function loadRecentImages() {
                var method = "flickr.photos.getRecent";
                bildgalleri.flickrService.flickrService(method, "").then(function (response) {
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
                bildgalleri.flickrService.flickrService(method, tags).then(function (response) {
                    var result = JSON.parse(response);
                    var result = result.photos.photo;

                    // append images to mainContent
                    appendImages(result);
                }, function (error) {
                    console.log("something went wrong");
                });
            }

            /*
                ####### Help methods ###########
            */

            var appendImages = function (jsonObj) {
                for (var key in jsonObj) {
                    var photoUrl = "http://farm" + jsonObj[key].farm + ".static.flickr.com/"
                        + jsonObj[key].server + "/" + jsonObj[key].id
                        + "_" + jsonObj[key].secret + "_" + "b.jpg";
                    /*
                      var a_href = "http://www.flickr.com/photos/" +
                      jsonObj[key].owner + "/" + jsonObj[key].id + "/";
                    
                      var link = document.createElement("a");
                      link.href = a_href;
                      link.innerHTML = key;*/

                    var img = document.createElement("img");
                    img.src = photoUrl;
                    img.style.height = '300px';
                    img.style.width = '300px';
                    var src = document.getElementById("mainContent");
                    src.appendChild(img);
                    // src.appendChild(link);
                }
            }



        }());
    }());
}());