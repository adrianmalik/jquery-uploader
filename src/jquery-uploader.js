/**
 * jQuery Uploader Library v. 2.0.6
 * https://github.com/adrianmalik/jquery-uploader
 *
 * Copyright 2015 Adrian Malik
 * Released under the MIT license
 */
var Uploader = {};

Uploader.Input = function(htmlElement, params) {
    var self = this;

    this.attachOnChange = function(preview) {
        $(htmlElement).on('change', function(event) {
            var target = event.originalEvent.target || event.originalEvent.srcElement;
            var files = target.files;
            for (var i = 0; i < files.length; i++) {
                preview.renderItem(files[i]);
            }
            $(htmlElement).val('');
        });

        return self;
    };

    this.hide = function() {
        $(htmlElement).hide();
        return self;
    };

    this.getHtmlElement = function() {
        return htmlElement;
    };

    this.getName = function() {
        var name = $(htmlElement).attr('name');
        $(htmlElement).removeAttr('name');
        return name;
    }

    return self;
};

Uploader.Preview = function(params, input) {
    var self = this;

    this.counter;
    this.htmlElements;
    this.error = params.error;
    this.render = params.render;
    this.onRenderEnd = params.onRenderEnd;
    this.beforeCancel = params.beforeCancel;
    this.upload = params.upload;
    this.maxFiles = params.maxFiles;
    this.minFileSize = params.minFileSize;
    this.maxFileSize = params.maxFileSize;
    this.errorMessages = params.errorMessages;
    this.allowedMimeTypes = params.allowedMimeTypes;
    this.allowedExtensions = params.allowedExtensions;
    this.forbiddenMimeTypes = params.forbiddenMimeTypes;
    this.forbiddenExtensions = params.forbiddenExtensions;

    this.renderContainer = function() {
        self.htmlElements = self.render();
        return self;
    };

    this.renderItem = function(file) {
        var error = self.validateFile(file);

        if(!error) {
            if (typeof self.counter !== 'number') {
                self.counter = 1;
            } else {
                self.counter++;
            }

            self.handleItem(file);
        } else {
            if(typeof self.error === 'function') {
                self.error(error);
            }
        }
    };

    this.validateFile = function(file) {
        var validator = new Uploader.Validator();
        var error = validator.validateFileExtension(
            file,
            {
                allowedExtensions: self.allowedExtensions,
                forbiddenExtensions: self.forbiddenExtensions
            },
            self.errorMessages
        );

        if (!error) {
            error = validator.validateFileMimeType(
                file,
                {
                    allowedMimeTypes: self.allowedMimeTypes,
                    forbiddenMimeTypes: self.forbiddenMimeTypes
                },
                self.errorMessages
            );
        }

        if (!error) {
            error = validator.validateFileSize(file, self.maxFileSize, self.minFileSize, self.errorMessages);
        }

        if (!error) {
            error = validator.validateFilesNumber(self.maxFiles, self.counter, self.errorMessages);
        }

        return error;
    };

    this.handleItem = function(file) {
        var upload = null;
        var cancel = null;
        var progress = null;
        var previewWrapper = null;
        var item = $(self.htmlElements.item).clone();
        var preview = self.generatePreview(file);

        $(self.htmlElements.container).append(item);

        for (var index in self.htmlElements) {
            if (index !== 'container' && index !== 'item') {
                switch(index) {
                    case 'preview':
                        previewWrapper = $(self.htmlElements[index]).clone();
                        $(item).append(previewWrapper.append(preview));
                        break;
                    case 'upload':
                        upload = $(self.htmlElements[index]).clone();
                        $(item).append(upload);
                        break;
                    case 'cancel':
                        cancel = $(self.htmlElements[index]).clone();
                        $(item).append(cancel);
                        break;
                    case 'progress':
                        progress = $(self.htmlElements[index]).clone();
                        $(item).append(progress);
                        break;
                    default:
                        $(item).append($(self.htmlElements[index]).clone());
                }
            }
        }

        self.attachUploadEvent(upload, cancel, file, progress, item);
        self.onRenderEnd(item);
    };

    this.generatePreview = function(file) {
        var preview;
        var html = new Uploader.Html();
        var thumbnail = new Uploader.Thumbnail();

        switch(self.getHtmlThumbnailTagForFile(file)) {
            case html.TAG_IMG:
                preview = thumbnail.getImage(file);
                break;
            case html.TAG_VIDEO:
                preview = thumbnail.getVideo(file);
                break;
            default:
                preview = thumbnail.getDefault(file);
                break;
        }

        return preview;
    };

    this.getHtmlThumbnailTagForFile = function(file) {
        var mimeType = file.type;

        if (typeof mimeType !== 'string') {
            throw new Error('Invalid mime type for preview');
        }

        var tag = (new Uploader.Html()).TAG_DIV;

        if (mimeType.indexOf('image') != -1) {
            tag = (new Uploader.Html()).TAG_IMG;
        }

        if (mimeType.indexOf('video') != -1) {
            tag = (new Uploader.Html()).TAG_VIDEO;
        }

        return tag;
    };

    this.attachUploadEvent = function(upload, cancel, file, progress, item) {
        var request;

        $(upload).on('click', function(event) {
            request = new Uploader.Request(input.getName(), file, self.upload, upload, progress);
            event.preventDefault();
        });

        $(cancel).on('click', function(event) {
            if (typeof request !== 'undefined') {
                request.abort();
            }
            self.beforeCancel(item);

            $(item).remove();
            self.counter--;
            event.preventDefault();
        });
    };
};

Uploader.Request = function(name, file, params, upload, progress) {
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
        if (request.status != 200) {
            params.onError(event, file, upload);
        } else {
            params.onSuccess(event, file, upload);
        }

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

    var formData = new FormData();
    formData.append(name, file);
    formData = params.beforeSend(formData, file, upload);
    request.send(formData);
    return request;
};

Uploader.Thumbnail = function() {
    var self = this;

    this.getImage = function(file) {
        var img = (new Uploader.Html()).getImg();
        var reader = new FileReader();

        reader.onloadend = function() {
            img.src = reader.result;
        };

        reader.readAsDataURL(file);

        return img;
    };

    this.getVideo = function(file) {
        var video = new (Uploader.Html()).getVideo();
        var reader = new FileReader();

        reader.onloadend = function() {
            video.src = reader.result;
        };

        reader.readAsDataURL(file);

        return video;
    };

    this.getDefault = function(file) {
        return file.name;
    };

    this.filterParams = function(params) {
        var html = new Uploader.Html();

        if (typeof params !== html.TYPE_OBJECT) {
            params = {};
        }

        if (typeof params.container !== html.TYPE_OBJECT) {
            params.container = html.getUl();
            $('#preview').html(params.container);
        }

        if (typeof params.item !== html.TYPE_OBJECT) {
            params.item = html.getLi();
        }

        if (typeof params.preview !== html.TYPE_OBJECT) {
            params.preview = html.getDiv();
        }

        if (typeof params.progress !== html.TYPE_OBJECT) {
            params.progress = html.getProgress();
        }

        if (typeof params.upload !== html.TYPE_OBJECT) {
            params.upload = html.getButton();
            params.upload.setAttribute('class', 'upload');
            $(params.upload).text('Upload');
        }

        if (typeof params.cancel !== html.TYPE_OBJECT) {
            params.cancel = html.getButton();
            params.cancel.setAttribute('class', 'cancel');
            $(params.cancel).text('Cancel');
        }

        return params;
    };
};

Uploader.Validator = function() {

    var convertFileSizeToBytes = function(size) {
        var letters = '';
        var bytes = '';

        for (index in size) {
            if (isNaN(size[index])) {
                letters += size[index];
            } else {
                bytes += size[index];
            }
        }

        bytes = parseInt(bytes);

        if (letters) {
            switch (letters.toUpperCase()) {
                case 'B': break;
                case 'KB': bytes = bytes * 1024; break;
                case 'MB': bytes = bytes * 1024 * 1024; break;
                case 'GB': bytes = bytes * 1024 * 1024 * 1024; break;
                case 'TB': bytes = bytes * 1024 * 1024 * 1024 * 1024; break;
                case 'PB': bytes = bytes * 1024 * 1024 * 1024 * 1024 * 1024; break;
            }
        }

        return bytes;
    };

    this.validateFileSize = function(file, maxFileSize, minFileSize, errorMessages) {
        var error = null;

        if (typeof maxFileSize === 'string') {
            var maxFileSize = convertFileSizeToBytes(maxFileSize);

            if (file.size > maxFileSize) {
                if(typeof errorMessages === 'object'
                    && typeof errorMessages.tooLargeFile !== 'string'
                    && errorMessages.tooLargeFile) {
                    error = errorMessages.tooLargeFile;
                } else {
                    error = 'Your file is too large.';
                }
            }
        }

        if (typeof minFileSize === 'string') {
            var minFileSize = convertFileSizeToBytes(minFileSize);

            if (file.size < minFileSize) {
                if(typeof errorMessages === 'object'
                    && typeof errorMessages.tooSmallFile !== 'string'
                    && errorMessages.tooSmallFile) {
                    error = errorMessages.tooSmallFile;
                } else {
                    error = 'Your file is too small.';
                }
            }
        }

        return error;
    };

    this.validateFileMimeType = function(file, mimeTypes, errorMessages) {
        var error = null;
        var allowedMimeTypes = mimeTypes.allowedMimeTypes;
        var forbiddenMimeTypes = mimeTypes.forbiddenMimeTypes;

        if (typeof allowedMimeTypes === 'object' && allowedMimeTypes.length > 0) {
            if(allowedMimeTypes.indexOf(file.type) === -1) {
                if(typeof errorMessages === 'object'
                    && typeof errorMessages.forbidden !== 'string'
                    && errorMessages.forbidden) {
                    error = errorMessages.forbidden;
                } else {
                    error = 'File is forbidden.';
                }
            }
        }

        if (typeof forbiddenMimeTypes === 'object' && forbiddenMimeTypes.length > 0) {
            if(forbiddenMimeTypes.indexOf(file.type) !== -1) {
                if(typeof errorMessages === 'object'
                    && typeof errorMessages.forbidden !== 'string'
                    && errorMessages.forbidden) {
                    error = errorMessages.forbidden;
                } else {
                    error = 'File is forbidden.';
                }
            }
        }

        return error;
    };

    this.validateFilesNumber = function(maxFiles, filesCounter, errorMessages) {
        var error = null;

        if (typeof maxFiles === 'number') {
            if (filesCounter >= maxFiles) {
                if (typeof errorMessages === 'object'
                    && typeof errorMessages.tooManyFiles !== 'string'
                    && errorMessages.tooManyFiles) {
                    error = errorMessages.tooManyFiles;
                } else {
                    error = 'You cannot upload more files.';
                }
            }
        }

        return error;
    };


    this.validateFileExtension = function(file, extensions, errorMessages) {
        var error = null;
        var allowedExtensions = extensions.allowedExtensions;
        var forbiddenExtensions = extensions.forbiddenExtensions;

        if (typeof allowedExtensions === 'object' && allowedExtensions.length > 0) {
            var extension = file.name.split('.').pop();
            if(allowedExtensions.indexOf(extension) === -1) {
                if(typeof errorMessages === 'object'
                    && typeof errorMessages.forbidden !== 'string'
                    && errorMessages.forbidden) {
                    error = errorMessages.forbidden;
                } else {
                    error = 'File is forbidden.';
                }
            }
        }

        if (typeof forbiddenExtensions === 'object' && forbiddenExtensions.length > 0) {
            var extension = file.name.split('.').pop();
            if(forbiddenExtensions.indexOf(extension) !== -1) {
                if(typeof errorMessages === 'object'
                    && typeof errorMessages.forbidden !== 'string'
                    && errorMessages.forbidden) {
                    error = errorMessages.forbidden;
                } else {
                    error = 'File is forbidden.';
                }
            }
        }

        return error;
    };
};

Uploader.Filter = function() {
    var self = this;

    this.filterParams = function(params) {
        if (typeof params !== 'object') {
            params = {};
        }

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

        if (typeof params.onDragLeave !== 'function') {
            params.onDragLeave = function(htmlElement, event) {};
        }

        if (typeof params.onDragEnter !== 'function') {
            params.onDragEnter = function(htmlElement, event) {};
        }

        if (typeof params.beforeCancel !== 'function') {
            params.beforeCancel = function(item) {};
        }

        return params;
    };

    this.filterPreviewParams = function(params) {
        if (typeof params.upload !== 'object') {
            params.upload = {};
        }

        if (typeof params.onRenderEnd !== 'function') {
            params.onRenderEnd = function(renderedItem) {};
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

        if (typeof params.upload.onSuccess !== 'function') {
            params.upload.onSuccess = function(event, file, upload) {};
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

        if (typeof params.upload.beforeSend !== 'function') {
            params.upload.beforeSend = function(data) {
                return data;
            }
        }

        if (typeof params.upload.url !== 'string') {
            params.upload.url = '/upload';
        }

        if (typeof params.maxFiles !== 'undefined' && isNaN(params.maxFiles)) {
            params.maxFiles = 1;
        }

        return params;
    };
};

Uploader.Browser = function(params) {
    var self = this;

    this.htmlElement; /* {HTMLElement} */
    this.onDrop = params.onDrop; /* {Function} */
    this.onClick = params.onClick; /* {Function} */
    this.onDragOver = params.onDragOver; /* {Function} */
    this.onDragEnter = params.onDragEnter; /* {Function} */
    this.onDragLeave = params.onDragLeave; /* {Function} */

    this.render = function() {
        self.htmlElement = params.render();
        return self;
    };

    this.attachOnDrop = function(preview) {
        $(self.htmlElement).on('drop', function(event) {
            event.preventDefault();
            for (var i = 0; i < event.originalEvent.dataTransfer.files.length; i++) {
                preview.renderItem(event.originalEvent.dataTransfer.files[i]);
            }
            self.onDrop(this, event);
        });

        return self;
    };

    this.attachOnDragEnter = function() {
        $(self.htmlElement).on('dragenter', function(event) {
            event.stopPropagation();
            event.preventDefault();
            self.onDragEnter(this, event);
        });

        return self;
    };

    this.attachOnDragOver = function() {
        $(self.htmlElement).on('dragover', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onDragOver(this, event);
        });

        return self;
    };

    this.attachOnDragLeave = function() {
        $(self.htmlElement).on('dragleave', function (event) {
            event.stopPropagation();
            event.preventDefault();
            self.onDragLeave(this, event);
        });

        return self;
    };

    this.attachOnClick = function(input) {
        $(self.htmlElement).on('click', function(event) {
            event.preventDefault();
            $(input.getHtmlElement()).trigger('click');
            self.onClick(this, event);
        });

        return self;
    };
};

Uploader.Html = function() {
    var self = this;

    this.TAG_UL = 'ul';
    this.TAG_LI = 'li';
    this.TAG_IMG = 'img';
    this.TAG_DIV = 'div';
    this.TAG_SPAN = 'span';
    this.TAG_VIDEO = 'video';
    this.TAG_BUTTON = 'button';
    this.TAG_PROGRESS = 'progress';

    this.TYPE_OBJECT = 'object';
    this.TYPE_STRING = 'string';
    this.TYPE_NUMBER = 'number';
    this.TYPE_UNDEFINED = 'undefined';

    this.getUl = function() {
        return document.createElement(self.TAG_UL);
    };

    this.getLi = function() {
        return document.createElement(self.TAG_LI);
    };

    this.getImg = function() {
        return document.createElement(self.TAG_IMG);
    };

    this.getDiv = function() {
        return document.createElement(self.TAG_DIV);
    };

    this.getSpan = function() {
        return document.createElement(self.TAG_SPAN);
    };

    this.getVideo = function() {
        return document.createElement(self.TAG_VIDEO);
    };

    this.getButton = function() {
        return document.createElement(self.TAG_BUTTON);
    };

    this.getProgress = function() {
        var progress = document.createElement(self.TAG_PROGRESS);
        $(progress).attr('value', '0').attr('max', '100');
        return progress;
    };
};

$(document).ready(function() {
    jQuery.fn.upload = function(construct) {
        var params = (new Uploader.Filter()).filterParams(construct);
        var browser = new Uploader.Browser(params.browser);
        var input = (new Uploader.Input(this[0], params));
        var preview = new Uploader.Preview(params.preview, input);

        input.hide().attachOnChange(preview);

        browser.render();
        browser.attachOnClick(input);
        browser.attachOnDrop(preview);
        browser.attachOnDragEnter();
        browser.attachOnDragOver();
        browser.attachOnDragLeave();

        preview.renderContainer();
    };
});