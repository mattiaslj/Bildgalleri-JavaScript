(function () {
	bildgalleri.flickrService = (function () {

		var key = "92217f00479cdc382a7c4de5ef0a8ec1";
		var secret = "98e6e56a3b566d95";
		var isSearch = false;
		var page = 0;

		var service = function (url) {
			return new Promise(resolve => {
				var req = new XMLHttpRequest();
				req.open('GET', url);

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

		var search = function (tags) {
			var url;
			var method;
			// empty search gives recent photos
			if (tags == null || tags.trim() === '') {
				// reset pageCount
				page = 0;
				isSearch = false;

				method = "flickr.photos.getRecent";
				url = 'https://api.flickr.com/services/rest/?method=' +
					method + '&api key=' + key + '&tags=' +
					'&safe_search=1&per_page=24&format=json&nojsoncallback=1';
			} else {
				// add to pagecount to not get same images
				method = 'flickr.photos.search';
				page += 1;
				isSearch = true;
				url = 'https://api.flickr.com/services/rest/?method=' + method +
					'&api key=' + key + '&tags=' + tags +
					'&safe_search=1&page=' + page +
					'&per_page=24&format=json&nojsoncallback=1';
			}
			return service(url);
		}

		var getRecent = function () {
			var url;
			var method = 'flickr.photos.getRecent';
			url = 'https://api.flickr.com/services/rest/?method=' +
				method + '&api key=' + key + '&per_page=24&format=json&nojsoncallback=1';

			return service(url);
		}

		var userSearched = function () {
			return isSearch;
		}

		return {
			getRecent: getRecent,
			search: search,
			userSearched: userSearched
		};
	}());
})();
