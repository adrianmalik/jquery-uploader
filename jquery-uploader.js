$(document).ready(function() {
    /**
     * Upload function for jQuery library
     *
     * @author Adrian Malik <adrian.malik.89@gmail.com>
     * @version 1.0.0
     */
    $.fn.upload = function (options) {
        var self = this;

        /* Default settings */
        self.options = $.extend( {
            type: 'button',
            trigger: {
                type: 'button'
            },
            preview: {
                selector: '[data-jq-upload-preview]',
                width: 400,
                height: 200
            },
            buttons: {
                upload: { text: 'Upload' },
                cancel: { text: 'Cancel' }
            },
            timeout: 10000,
            selectFileText: 'Select file'
        }, options);

        /* Constant errors of the jQuery uploader */
        self.ERROR_TOO_LARGE_SIZE = 'File is too large. ';
        self.ERROR_TOO_MANY_FILES = 'Too many files selected';
        self.ERROR_NOT_ALLOWED_EXTENSION = 'File has not have allowed extension. ';
        self.ERROR_NOT_ALLOWED_MIME_TYPE = 'File has not have allowed mime type. ';

        /**
         * Validates single file.
         *
         * @param {} file
         */
        self.validateFile = function(file) {
            var error = '';

            error += self.validateFileSize(file);
            error += self.validateFileMimeType(file);
            error += self.validateFileExtension(file);

            return error;
        };

        /**
         * Validates group of files.
         *
         * @param [] files
         */
        self.validateFiles = function(files) {
            var error = self.validateFilesNumber(files);

            return error;
        };

        /**
         * Checks if file has allowed size.
         *
         * @param {} file
         */
        self.validateFileSize = function(file) {
            var error = '';

            if(typeof self.options !== 'undefined') {
                if(typeof self.options.maxSize !== 'undefined') {
                    if(typeof file === 'object') {
                        var size = file.size;

                        if(self.options.maxSize < size) {
                            error = self.ERROR_TOO_LARGE_SIZE;
                        }
                    }
                }
            }

            return error;
        };

        /**
         * Checks if file has allowed mime type
         *
         * @param {} file
         */
        self.validateFileMimeType = function(file) {
            var error = '';

            if(typeof self.options !== 'undefined') {
                if(typeof self.options.allowedMimeTypes !== 'undefined') {
                    if(typeof file === 'object') {
                        var mimeType = file.type;

                        if(self.options.allowedMimeTypes.indexOf(mimeType) === -1) {
                            error = self.ERROR_NOT_ALLOWED_MIME_TYPE;
                        }
                    }
                }
            }

            return error;
        };

        /**
         * Checks if file has allowed extension
         *
         * @param {} file
         */
        self.validateFileExtension = function(file) {
            var error = '';

            if(typeof self.options !== 'undefined') {
                if(typeof self.options.allowedExtensions !== 'undefined') {
                    if(typeof file === 'object') {
                        var extension = file.name.split('.').pop();

                        if(self.options.allowedExtensions.indexOf(extension) === -1) {
                            error = self.ERROR_NOT_ALLOWED_EXTENSION;
                        }
                    }
                }
            }

            return error;
        };

        /**
         * Checks if files number is allowed
         *
         * @param [] files
         */
        self.validateFilesNumber = function(files) {
            var error = '';

            if(typeof self.options !== 'undefined') {
                if(typeof self.options.maxFiles !== 'undefined') {
                    if(isNaN(parseInt(self.options.maxFiles))) {
                        error += 'Wrong maxFiles parameter. It must be an integer';
                    } else {
                        if(files.length > self.options.maxFiles) {
                            error += self.ERROR_TOO_MANY_FILES;
                        }
                    }
                }
            }

            return error;
        }

        /**
         * Sets preview image for one selected in input[type="file"] file.
         *
         * @param {} previewItem
         * @param {} onLoadEvent
         */
        self.setPreviewImage = function(preview, onLoadEvent) {

            var img = new Image();
            var canvas = document.createElement('canvas');

            $(preview).append(canvas);

            img.onload = function(){
                var width = 200;
                var height = 200;

                if(typeof self.options.preview.width !== 'undefined') {
                    width = parseInt(self.options.preview.width);
                }

                if(typeof self.options.preview.height !== 'undefined') {
                    height = parseInt(self.options.preview.height);
                }

                canvas.width = self.options.preview.width;
                canvas.height = self.options.preview.height;
                canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            }

            img.src = onLoadEvent.target.result;
        };

        /**
         * Checks if is preview option is set in construct parameters.
         */
        self.isPreviewOptionSet = function() {
            if(typeof self.options !== 'undefined') {
                if(typeof self.options.preview !== 'undefined') {
                    if(typeof self.options.preview.selector !== 'undefined') {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * Sends file to the server (uploads it)
         */
        self.upload = function(event, file, preview) {
            event.preventDefault();

            //var formData = new FormData($(self).closest('form')[0]);

            var formData = new FormData();
            formData.append('file', file);
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType('application/json');
            xhr.timeout = self.options.timeout;
            xhr.addEventListener('load', function(event) { self.loadHandler(event, file, preview); }, false);
            xhr.addEventListener('error', function(event) { self.errorHandler(event, file, preview); }, false);
            xhr.addEventListener('abort', function(event) { self.abortHandler(event, file, preview); }, false);
            xhr.addEventListener('timeout', function(event) { self.timeoutHandler(event, file, preview); }, false);
            xhr.addEventListener('loadend', function(event) { self.loadendHandler(event, file, preview); }, false);
            xhr.addEventListener('loadstart', function(event) { self.loadstartHandler(event, file, preview); }, false);
            xhr.upload.addEventListener('progress', function(event) { self.progressHandler(event, file, preview); }, false);
            xhr.open('POST', self.options.url);
            xhr.send(formData);
        };

        /**
         * Upload progress
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.progressHandler = function(event, file, preview) {
            $(preview).find('progress').val((event.loaded / event.total) * 100);

            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onProgress === 'function') {
                    self.options.upload.onProgress(event, file, preview);
                }
            }
        };

        /**
         * Upload has been started
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.loadstartHandler = function(event, file, preview) {
            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onLoadStart === 'function') {
                    self.options.upload.onLoadStart(event, file, preview);
                }
            }
        };

        /**
         * Upload has been completed (successfully or failure)
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.loadendHandler = function(event, file, preview) {
            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onLoadEnd === 'function') {
                    self.options.upload.onLoadEnd(event, file, preview);
                }
            }
        };

        /**
         * Upload has been successfully completed
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.loadHandler = function(event, file, preview) {
            try {
                var response = event.target.response;
                var json = JSON.parse(response);

                if(typeof json.data !== 'undefined') {

                }
            } catch (exception) {
                self.setErrorsIfExist([exception]);
            }

            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onSuccess === 'function') {
                    self.options.upload.onSuccess(event, file, preview);
                }
            }
        };

        /**
         * Upload has been failed
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.errorHandler = function(event, file, preview) {
            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onError === 'function') {
                    self.options.upload.onError(event, file, preview);
                }
            }
        };

        /**
         * Upload has been canceled
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.abortHandler = function(event, file, preview) {
            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onAbort === 'function') {
                    self.options.upload.onAbort(event, file, preview);
                }
            }
        };

        /**
         * Upload has been lasted too long (timeout)
         *
         * @param {} event
         * @param {} file
         * @param {} preview
         */
        self.timeoutHandler = function(event, file, preview) {
            if(typeof self.options.upload !== 'undefined') {
                if(typeof self.options.upload.onTimeout === 'function') {
                    self.options.upload.onTimeout(event, file, preview);
                }
            }
        };

        /**
         * Sets buttons ("Upload" , "Cancel") for every selected file
         *
         * @param {} previewItem
         */
        self.setButtons = function(preview, file) {

            var buttonUpload = document.createElement('button');
            var buttonCancel = document.createElement('button')

            buttonUpload.setAttribute('class', 'upload');
            buttonCancel.setAttribute('class', 'cancel');

            $(buttonUpload).html(self.options.buttons.upload.text);
            $(buttonCancel).html(self.options.buttons.cancel.text);

            $(buttonCancel).click(function(clickEvent) {
                clickEvent.preventDefault();
                $(preview).remove()
            });

            $(buttonUpload).click(function(clickEvent) {
                clickEvent.preventDefault();
                self.upload(clickEvent, file, preview);
                $(preview).find('button:first').remove();
            });

            $(preview).append(buttonUpload);
            $(preview).append(buttonCancel);
        };

        /**
         * Sets progress bar
         */
        self.setProgressBar = function(preview) {
            var progressBar = document.createElement('progress');

            progressBar.setAttribute('min', '0');
            progressBar.setAttribute('max', '100');
            progressBar.setAttribute('value', '0');

            $(preview).append(progressBar);
        };

        /**
         * Is run when  change event is triggered on input[type="file"]
         */
        self.onLoadFile = function(files) {
            try {
                var error = self.validateFiles(files);
                var errors = [];

                if(!error) {
                    for(index in files) {
                        var message = self.validateFile(files[index]);
                        if(!message) {
                            if(typeof files[index] === 'object') {
                                var reader = new FileReader();

                                reader.onload = function(file) {
                                    var preview = document.createElement('div');
                                    $(self.options.preview.selector).append(preview);
                                    self.setFileName(preview, file);

                                    return function(onLoadEvent) {
                                        if(self.isPreviewOptionSet()) {
                                            self.setPreviewImage(preview, onLoadEvent);
                                        }

                                        self.setProgressBar(preview);
                                        self.setButtons(preview, file);
                                    };
                                }(files[index]);
                                reader.readAsDataURL(files[index]);
                            }
                        } else {
                            errors.push(files[index].name + ' - ' + message);
                        }
                    }
                } else {
                    errors.push(error);
                }

                return errors;

            } catch(exception) {
                console.log(exception);
            }
        };

        /**
         * Sets file name in the paragraph
         */
        self.setFileName = function(previewItem, file) {
            var paragraph = document.createElement('p');
            paragraph.textContent = file.name;
            $(previewItem).append(paragraph);
        }

        /**
         * Replaces input[type="file"] by upload button or dropzone area
         */
        self.replaceInputFile = function(input) {
            if(typeof self.options.trigger !== 'undefined') {
                if(typeof self.options.trigger.type !== 'undefined') {
                    switch(self.options.trigger.type) {
                        case 'button': self.replaceInputFileByButton(input); break;
                        case 'dropzone': self.replaceInputFileByDropzone(input); break;
                        default: throw 'Wrong upload type';
                    }
                } else {
                    throw 'Undefined upload trigger type';
                }
            } else {
                throw 'Undefined upload trigger';
            }
        };

        /**
         * Replaces input[type="file"] by button
         */
        self.replaceInputFileByButton = function(input) {
            var button = document.createElement('button');

            if(typeof self.options.trigger.attributes === 'object') {
                for(var attributeName in self.options.trigger.attributes) {
                    button.setAttribute(attributeName, self.options.trigger.attributes[attributeName]);
                }
            }

            button.innerHTML = self.options.selectFileText;

            $(button).click(function(clickEvent) {
                clickEvent.preventDefault();
                $(input).trigger('click');
            })

            $(input).after(button);
            $(input).hide();
        };

        /**
         * Replaces input[type="file"] by dropzone area
         */
        self.replaceInputFileByDropzone = function(input) {
            var dropzone = document.createElement('seciton');

            if(typeof self.options.trigger.attributes === 'object') {
                for(attributeName in self.options.trigger.attributes) {
                    dropzone.setAttribute(attributeName, self.options.trigger.attributes[attributeName]);
                }

                if(typeof self.options.trigger.attributes.style === 'undefined') {
                    dropzone.setAttribute('style', 'border: 5px dashed #000; padding:40px;margin:40px;display:block;')
                }
            }

            dropzone.innerHTML = self.options.selectFileText;

            $(dropzone).click(function(clickEvent) {
                clickEvent.preventDefault();
                $(input).trigger('click');
            });

            $(dropzone).on('dragenter', function(dragEnterEvent) {
                $(this).addClass('hover');

                dragEnterEvent.stopPropagation();
                dragEnterEvent.preventDefault();
            });

            $(dropzone).on('dragleave', function(dragLeaveEvent) {
                $(this).removeClass('hover');

                dragLeaveEvent.stopPropagation();
                dragLeaveEvent.preventDefault();
            });

            $(dropzone).on('dragover', function(dragOverEvent) {
                dragOverEvent.stopPropagation();
                dragOverEvent.preventDefault();
            });

            $(dropzone).on('drop', function(dropEvent) {

                dropEvent.preventDefault();

                var files = dropEvent.originalEvent.dataTransfer.files;

                self.setErrorsIfExist(
                    self.onLoadFile(files)
                );
            });

            $(input).after(dropzone);
            $(input).hide();
        };

        /**
         * Sets error if it exists
         */
        self.setErrorsIfExist = function (errors) {
            if(errors.length !== 0) {
                if(typeof self.options.error.selector !== 'undefined') {
                    for(index in errors) {
                        var paragraph = document.createElement('div');
                        $(paragraph).html(errors[index]);

                        if(typeof self.options.error.attributes === 'object') {
                            for(attributeName in self.options.error.attributes) {
                                $(self.options.error.selector).attr(
                                    attributeName,
                                    self.options.error.attributes[attributeName]
                                );
                            }
                        }

                        $(self.options.error.selector).append(paragraph);
                    }
                }
            }
        }

        /**
         * It is run for every uploader on one website. It attaches all events to the input[type="file"] elements.
         */
        return this.each(function() {
            var input = this;

            $(input).change(function(changeEvent) {
                var files = changeEvent.target.files;

                self.setErrorsIfExist(
                    self.onLoadFile(files)
                );
            });

            //Replaces input[type="file"] by button or dropzone
            self.replaceInputFile(input);
        });
    };
});