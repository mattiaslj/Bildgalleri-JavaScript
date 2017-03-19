(function () {
    'use strict'

    bildgalleri.gallery = (function () {
        /*
                Eventlistener
            */
        document.getElementById("goToGallery").addEventListener('click', function () {
            document.getElementById("photos").style.display = 'none';
            document.getElementById("originalPhoto").style.display = 'none';
            document.getElementById("gallery").style.display = 'inline';

            // 12 are the number of children that always should be in gallery..
            // rest should be redrawn every time
            if (document.getElementById("gallery").childNodes.length > 12) {
                while (document.getElementById("gallery").childNodes.length > 12) {
                    document.getElementById("gallery").removeChild(document.getElementById("gallery").lastChild);
                }
            }

            bildgalleri.flickrService.getGalleries().then(function (result) {
                var temp = JSON.parse(result);
                var galleries = temp.galleries.gallery;

                // empty select element in case user added new one
                document.getElementById("galleries").innerHTML = '';
                for (var key in galleries) {
                    (function () {
                        var galleryName = galleries[key].title._content;
                        var option = document.createElement("option");
                        option.innerHTML = galleryName;
                        option.value = galleries[key].id;
                        // append option
                        var src = document.getElementById("galleries");
                        src.appendChild(option);

                        printGallery(galleries[key].id);
                    }());
                }

            }, function (error) {
                console.log("token error");
                oauth_object = temp;
            });

            /*
                Eventlistener
            */
            document.getElementById("addToGalleryButton").addEventListener('click', function () {
                var select = document.getElementById("galleries");

                if (select.options[select.selectedIndex].text != undefined) {
                    var galleryId = select.options[select.selectedIndex].value;
                    var photoContainer = document.getElementById("originalPhoto");
                    var photoId;

                    if (photoContainer.childNodes.length > 2) {
                        photoId = photoContainer.childNodes[2].id;
                    }

                    bildgalleri.flickrService.addPhotoToGallery(galleryId, photoId).then(function (result) {
                        document.getElementById("photos").style.display = 'none';
                        document.getElementById("originalPhoto").style.display = 'inline';
                        document.getElementById("gallery").style.display = 'none';
                    }, function (error) {

                    });
                }
            });

            /*
                Eventlistener
                Creates a new gallery
            */
            document.getElementById("createGalleryButton").addEventListener('click', function () {
                var galleryName = document.getElementById("newGalleryName");
                var galleryDescription = document.getElementById("galleryDescription");
                if (galleryName.value != undefined && galleryName.value.trim() != ''
                    && galleryDescription.value != undefined && galleryDescription.value.trim() != '') {

                    bildgalleri.flickrService.createGallery(galleryName.value, galleryDescription.value).then(function (result) {
                        document.getElementById("photos").style.display = 'none';
                        document.getElementById("originalPhoto").style.display = 'inline';
                        document.getElementById("gallery").style.display = 'none';
                    }, function (error) {

                    });
                } else {
                    alert("galery must have a name")
                }

            });


            // prints out al images in a gallery
            function printGallery(galleryId) {
                var container = document.createElement("div");
                container.id = galleryId;
                container.class = "galleryContainer";

                var gallery = document.getElementById("gallery");
                gallery.appendChild(container);

                bildgalleri.flickrService.getPhotos(galleryId).then(function (result) {
                    var photos = JSON.parse(result);
                    photos = photos.photos.photo;
                    for (var key in photos) {
                        // closure to make eventlisteners stick to its object
                        (function () {
                            var photoID = photos[key].id;
                            var photoUrl = "http://farm" + photos[key].farm + ".static.flickr.com/"
                                + photos[key].server + "/" + photos[key].id
                                + "_" + photos[key].secret + "_" + "b.jpg";

                            // create img
                            var img = document.createElement("img");
                            img.src = photoUrl;
                            img.style.height = '300px';
                            img.style.width = '300px';

                            // append image to #photos
                            var src = document.getElementById(galleryId);
                            src.appendChild(img);
                            var button = document.createElement("button");
                            button.innerHTML = "Delete";
                            button.onclick = function () {
                                var photoIds;
                                for (var photo in photos) {
                                    console.log(photos[photo].id)
                                    if (photos[photo].id == photoID) {
                                        break;
                                    }
                                    photoIds += photos[photo].id + ',';
                                    console.log(photoIds)
                                }
                                
                                bildgalleri.flickrService.deletePhoto(galleryId,photoIds[0], photoIds).then(function (result) {
                                    console.log(result)
                                    }, function (error) {

                                    });
                            }
                            src.appendChild(button);


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
                                temp.id = photos[key].id + '_' + photos[key].secret;
                                temp.style.height = '800px';
                                temp.style.width = '800px';
                                // append image
                                var src = document.getElementById("originalPhoto");
                                src.appendChild(temp);
                            }

                            

                        }());
                    }

                }, function (error) {

                });

            }
        });
    }());
}());