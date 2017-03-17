
(function () {
    'use strict';
    (function () {
        bildgalleri.main = (function () {
            // search flickr for images by tags
            document.getElementById("searchButton").addEventListener('click', function () {
                var method = "flickr.photos.search";
                var tags = document.getElementById("searchField").value;

                bildgalleri.flickrService.flickrService(method, tags).then(function (response) {
                    console.log(response);
                    var result = JSON.parse(response);
                    var result = result.photos.photo;
                    appendImages(result);
                }, function (error) {

                });
            });

            /*
                uses flickrService.getRecent on entering homepage
            */
            function setup() {
                var method = "flickr.photos.getRecent";
                bildgalleri.flickrService.flickrService(method, "").then(function (response) {
                    var result = JSON.parse(response);
                    var result = result.photos.photo;
                    appendImages(result);

                }, function (error) { });
            }
            setup();
        }());


        var appendImages = function (jsonObj) {
            for (var key in jsonObj) {
                console.log()
                var photoUrl = "http://farm" + jsonObj[key].farm + ".static.flickr.com/"
                    + jsonObj[key].server + "/" + jsonObj[key].id
                    + "_" + jsonObj[key].secret + "_" + "b.jpg";

                var a_href = "http://www.flickr.com/photos/" +
                    jsonObj[key].owner + "/" + jsonObj[key].id + "/";

                var link = document.createElement("a");
                link.href = a_href;
                link.innerHTML = key;

                var img = document.createElement("img");
                img.src = photoUrl;
                img.style.height = '300px';
                img.style.width = '300px';
                var src = document.getElementById("mainContent");
                src.appendChild(img);
                src.appendChild(link);
            }
        }
    }());
}());