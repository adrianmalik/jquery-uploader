Uploader.Request = function(upload, file, progress, params) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('POST', params.url);
    request.onloadstart = function(event) {
        params.onLoadStart(event, file, upload);
    };
    request.onabort = function(event) {
        params.onAbort(event, file, upload);
    };
    request.onerror = function(event) {
        params.onError(event, file, upload);
    };
    request.onload = function(event) {
        params.onLoad(event, file, upload);
    };
    request.onloadend = function(event) {
        params.onLoadEnd(event, file, upload);
    };
    request.ontimeout = function(event) {
        params.onTimeout(event, file, upload);
    };
    request.onprogress = function(event) {
        if (event.lengthComputable) {
            var value = (event.loaded / event.total) * 100;
            $(progress).attr('value' , value);
        }

        params.onProgress(event, file, upload);
    };

    this.send = function() {
        var formData = new FormData();
        formData.append('files', file);
        request.send(formData);
    };

    return request;
};