(function () {
    'use strict'

    bildgalleri.gallery = (function () {
        document.getElementById("goToGallery").addEventListener('click', function () {
            document.getElementById("photos").style.display = 'none';
            document.getElementById("originalPhoto").style.display = 'none';
            document.getElementById("gallery").style.display = 'inline';

            bildgalleri.flickrService.getGalleries().then(function (result) {
                var temp = JSON.parse(result);
               // console.log(result)
                var galleries = temp.galleries.gallery;
                console.log(galleries)
                for (var key in galleries) {
                    (function(){
                        var galleryName = galleries[key].title._content;
                        console.log(galleries[key].title._content);
                        var option = document.createElement("option");
                        option.innerHTML = galleryName;
                        option.value = galleries[key].id;
                        // append image
                        var src = document.getElementById("galleries");
                        src.appendChild(option);
                    }());
                }

            }, function (error) {
                console.log("token error");
                oauth_object = temp;
            });
            document.getElementById("addToGalleryButton").addEventListener('click', function () {
                var select = document.getElementById("galleries");
                console.log(select.options[select.selectedIndex].text);
                if (select.options[select.selectedIndex].text != undefined) {
                    var galleryId = select.options[select.selectedIndex].value;
                    var photoContainer = document.getElementById("originalPhoto");
                    var photoId;
                    if (photoContainer.childNodes.length > 2) {
                        photoId = photoContainer.childNodes[2].id;
                    }
                    
                    bildgalleri.flickrService.addPhotoToGallery(galleryId, photoId).then(function (result) {
                        console.log("should have added photo: " + result)
                    }, function (error) {

                    }); 
                }
            });

        });
    }());
}());