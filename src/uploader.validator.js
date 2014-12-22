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

    this.validateCropping = function(tag, isCropping) {
        var error = null;
        var html = new Uploader.Html();

        if (isCropping && tag !== html.TAG_IMG) {
            error = 'You can only crop images.';
        }

        return error;
    };
};