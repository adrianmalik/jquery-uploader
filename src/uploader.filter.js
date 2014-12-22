Uploader.Filter = function() {
    var self = this;

    this.filterParams = function(params) {
        if (typeof params.browser !== 'object') {
            params.browser = {};
        }

        if (typeof params.preview !== 'object') {
            params.preview = {};
        }

        params.browser = self.filterBrowserParams(params.browser);
        params.preview = self.filterPreviewParams(params.preview);

        return params;
    };

    this.filterBrowserParams = function(params) {
        if (typeof params.render !== 'function') {
            params.render = function () {
                var button = document.createElement('button');
                $(button).text('Select file');
                return button;
            }
        }

        if (typeof params.onDrop !== 'function') {
            params.onDrop = function(htmlElement, event) {};
        }

        if (typeof params.onClick !== 'function') {
            params.onClick = function(htmlElement, event) {};
        }

        if (typeof params.onDragOver !== 'function') {
            params.onDragOver = function(htmlElement, event) {};
        }

        if (typeof params.onDragEnter !== 'function') {
            params.onDragEnter = function(htmlElement, event) {};
        }

        return params;
    };

    this.filterPreviewParams = function(params) {
        if (typeof params.upload !== 'object') {
            params.upload = {};
        }

        if (typeof params.upload.onLoadStart !== 'function') {
            params.upload.onLoadStart = function(event, file, upload) {};
        }

        if (typeof params.upload.onProgress !== 'function') {
            params.upload.onProgress = function(event, file, upload) {};
        }

        if (typeof params.upload.onAbort !== 'function') {
            params.upload.onAbort = function(event, file, upload) {};
        }

        if (typeof params.upload.onError !== 'function') {
            params.upload.onError = function(event, file, upload) {};
        }

        if (typeof params.upload.onLoad !== 'function') {
            params.upload.onLoad = function(event, file, upload) {};
        }

        if (typeof params.upload.onLoadEnd !== 'function') {
            params.upload.onLoadEnd = function(event, file, upload) {};
        }

        if (typeof params.upload.onTimeout !== 'function') {
            params.upload.onTimeout = function(event, file, upload) {};
        }

        if (typeof params.upload.url !== 'string') {
            params.upload.url = '/upload';
        }

        if (typeof params.crop !== 'boolean') {
            params.crop = false;
        }

        if (typeof params.maxFiles !== 'number') {
            params.maxFiles = 1;
        }

        return params;
    };
};