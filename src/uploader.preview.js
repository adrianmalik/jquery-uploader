Uploader.Preview = function(params) {
    var self = this;

    this.counter; /* {Number} */
    this.htmlElements; /* {HTMLElement} */
    this.crop = params.crop; /* {Boolean} */
    this.error = params.error; /* {Function} */
    this.render = params.render; /* {Function} */
    this.styles = params.styles; /* {Object} */
    this.upload = params.upload; /* {Object} */
    this.maxFiles = params.maxFiles; /* {Number} */
    this.minFileSize = params.minFileSize; /* {String} */
    this.maxFileSize = params.maxFileSize; /* {String} */
    this.errorMessages = params.errorMessages; /* {Object} */
    this.allowedMimeTypes = params.allowedMimeTypes; /* {Object} */
    this.allowedExtensions = params.allowedExtensions; /* {Object} */
    this.forbiddenMimeTypes = params.forbiddenMimeTypes; /* {Object} */
    this.forbiddenExtensions = params.forbiddenExtensions; /* {Object} */

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

        if (!error) {
            error = validator.validateCropping(self.getHtmlThumbnailTagForFile(file), self.crop);
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
    };

    this.generatePreview = function(file) {
        var preview;
        var styles = self.styles;

        var html = new Uploader.Html();
        var thumbnail = new Uploader.Thumbnail();

        switch(self.getHtmlThumbnailTagForFile(file)) {
            case html.TAG_IMG:
                preview = thumbnail.getImage(file, styles);
                break;
            case html.TAG_VIDEO:
                preview = thumbnail.getVideo(file, styles);
                break;
            default:
                preview = thumbnail.getDefault(file, styles);
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

        $(upload).on('click', function() {
            request = new Uploader.Request(upload, file, progress, self.upload).send();
        });

        $(cancel).on('click', function() {
            if (typeof request !== 'undefined') {
                request.abort();
            }

            $(item).remove();
            self.counter--;
        });
    };
};