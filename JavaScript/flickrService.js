(function () {
	bildgalleri.flickrService = (function () {

		var key = "92217f00479cdc382a7c4de5ef0a8ec1";
		var secret = "98e6e56a3b566d95";
		var isSearch = false;
		var page = 0;

		var flickrService = function (method, tags) {

			return new Promise(resolve => {
				var url;
				// empty search gives recent photos
				if (tags == null || tags.trim() === '') {
					// reset pageCount
					page = 0;
					isSearch = false;

					method = "flickr.photos.getRecent";
					url = 'https://api.flickr.com/services/rest/?method=' +
						method + '&api key=' + key + '&tags=' +
						'&safe_search=1&per_page=25&format=json&nojsoncallback=1';
				} else {
					// add to pagecount to not get same images
					page += 1;
					isSearch = true;
					url = 'https://api.flickr.com/services/rest/?method=' +
						method + '&api key=' + key + '&tags=' + tags +
						'&safe_search=1&page=' + page +
						'&per_page=25&format=json&nojsoncallback=1';
				}

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

		var userSearched = function () {
			return isSearch;
		}

		return {
			flickrService: flickrService,
			userSearched: userSearched
		};
	}());
})();
