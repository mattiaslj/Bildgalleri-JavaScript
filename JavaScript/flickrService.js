(function () {
    bildgalleri.flickrService = (function () {

        // hardcoded
        var key = "92217f00479cdc382a7c4de5ef0a8ec1";
        var secret = "98e6e56a3b566d95";
        var oauth_object;
        var isSearch = false;
        var page = 0;


        // return: Promise
        // url: flicker api url
        // httpMethod: 'POST' or 'GET'
        var service = function (url, httpMethod) {
            return new Promise(resolve => {
                var req = new XMLHttpRequest();
                req.open(httpMethod, url)

                req.onload = function () {
                    if (req.status == 200) {
                        resolve(req.response);
                    }
                    else {
                        reject(Error(req.statusText));
                    }
                };

                req.onerror = function () {
                    reject(Error("Network Error"));
                };

                req.send();
            });
        }

        // return: Promise, gets users oauthObject from flickr
        var getToken = function () {
            return new Promise(resolve => {
                // Make sure user is logged in
                if (window.location.href.indexOf("frob") == -1) {
                    window.location = bildgalleri.flickrService.login();
                }

                // setup authentication link
                var method = 'flickr.auth.getToken';
                var currentUrl = window.location.href.split('=', 2);
                var frob = currentUrl[1];
                var api_sig = bildgalleri.MD5.MD5(secret + 'api_key' + key + 'formatjson' + 'frob' + frob + 'method' + method + 'nojsoncallback1');
                var url = 'https://api.flickr.com/services/rest/?method=flickr.auth.getToken&api_key=' + key +
                    '&frob=' + frob +
                    '&format=json&nojsoncallback=1' +
                    '&api_sig=' + api_sig;

                // Get oauth object
                service(url, 'GET').then(function (result) {
                    oauth_object = JSON.parse(result);
                    if (oauth_object.stat == 'fail') {
                        window.location = bildgalleri.flickrService.login();
                    } else {
                        oauth_object = JSON.parse(result);
                        void resolve();
                    }

                }, function (error) {

                });
            });
        }

        // prompts user to log into flickr
        var login = function () {
            var signatureString = bildgalleri.MD5.MD5(secret + 'api_key' + key + 'permsdelete');
            var apiLink = 'http://flickr.com/services/auth/?api_key=' + key + '&perms=delete&api_sig=' + signatureString;
            return apiLink;
        }

        var addPhotoToGallery = function (galleryId, photoId) {
            console.log('gal = ' + galleryId + '         pho : ' + photoId)
            var method = 'flickr.galleries.addPhoto';
            var httpMethod = 'POST';
            var token;
            var userId = oauth_object.auth.user.nsid;
            token = oauth_object.auth.token._content;
            var api_sig = bildgalleri.MD5.MD5(secret + 'api_key' + '' + key + 'auth_token' + token + 'formatrest' + 'gallery_id' + galleryId + 'method' + method + 'photo_id' + photoId);
            var url = 'https://api.flickr.com/services/rest/?method=' + method +
                '&api_key=' + key +
                '&format=rest' + 
                '&gallery_id=' + galleryId +
                '&photo_id=' + photoId +
                '&auth_token=' + token +
                '&api_sig=' + api_sig;
            return service(url, httpMethod);
        }

        // returns users galleries
        var getGalleries = function () {
            var method = 'flickr.galleries.getList';
            var httpMethod = 'GET';
            var token;
            var userId = oauth_object.auth.user.nsid;
            token = oauth_object.auth.token._content;
            var api_sig = bildgalleri.MD5.MD5(secret + 'api_key' + '' + key + 'auth_token' + token + 'formatjson' + 'method' + method + 'nojsoncallback1');
            var url = 'https://api.flickr.com/services/rest/?method=' + method +
                '&api_key=' + key +
              //  '&user_id=' + userId +
                '&format=json' +
                '&nojsoncallback=1' +
                '&auth_token=' + token +
                '&api_sig=' + api_sig;
            return service(url, httpMethod);
        }

        // create a user gallery - NOT implemented correctly yet
        var createGallery = function (title, description) {
            var httpMethod = 'POST'
            var url = 'https://api.flickr.com/services/rest/?method=flickr.galleries.create' +
				'&api_key=' + key +
				'&title=' + title +
				'&description=' + description +
				'&format=json' +
				'&nojsoncallback=1' +
				'&auth_token=' + authToken +
				'&api_sig=' + apisig;

            return service(url, httpMethod);
        }

        // searches flickr based on tags, returns photos in json
        var search = function (tags) {
            var url;
            var method;
            var httpMethod = 'GET'
            // empty search gives recent photos
            if (tags == null || tags.trim() === '') {
                // reset pageCount
                page = 0;
                isSearch = false;

                method = "flickr.photos.getRecent";
                url = 'https://api.flickr.com/services/rest/?method=' +
                    method + '&api key=' + key + '&tags=' +
                    '&safe_search=1&per_page=2&format=json&nojsoncallback=1';
            } else {
                // add to pagecount to not get same images
                method = 'flickr.photos.search';
                page += 1;
                isSearch = true;
                url = 'https://api.flickr.com/services/rest/?method=' + method +
                    '&api key=' + key + '&tags=' + tags +
                    '&safe_search=1&page=' + page +
                    '&per_page=2&format=json&nojsoncallback=1';
            }
            return service(url, httpMethod);
        }

        //  returns recently added photos in json
        var getRecent = function () {
            var url;
            var httpMethod = 'GET'
            var method = 'flickr.photos.getRecent';
            url = 'https://api.flickr.com/services/rest/?method=' +
                method + '&api key=' + key + '&per_page=2&format=json&nojsoncallback=1';

            return service(url, httpMethod);
        }

        var userSearched = function () {
            return isSearch;
        }

        return {
            addPhotoToGallery: addPhotoToGallery,
            getToken: getToken,
            login: login,
            getGalleries: getGalleries,
            createGallery: createGallery,
            getRecent: getRecent,
            search: search,
            userSearched: userSearched
        };
    }());
})();