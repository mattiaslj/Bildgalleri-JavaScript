(function () {
    'use strict'

    bildgalleri.gallery = (function () {
        document.getElementById("addToGallery").addEventListener('click', function () {

            bildgalleri.flickrService.getGalleries().then(function (result) {
                var temp = JSON.parse(result);
                console.log(temp)

            }, function (error) {
                console.log("token error");
                oauth_object = temp;
            });
            document.getElementById("photos").style.display = 'none';
            document.getElementById("originalPhoto").style.display = 'none';
            document.getElementById("gallery").style.display = 'inline';

            var img = document.getElementById("originalPhoto");
            var info = img.childNodes[2].id;
            //   var test = bildgalleri.flickrService.getInfo(id, secret);
            // console.log(test)

        });
    }());
}());