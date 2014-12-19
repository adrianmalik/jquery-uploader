jQuery Uploader
==============
jQuery Uploader library is designed for everybody who wants to implement asynchronous files uploader in his project. It is the only uploader which allows you to configure many details and customize your uploading proces however you want.

Simple configuration
==============

 ````html
<script src="/jquery/jquery.js"></script> <!-- At least 2.0 version -->
<script src="/html5-uploader/html5-uploader.js"></script>

<input type="file"> 
<div id="browser"></div> <!-- File browser element -->
<div id="preview"></div> <!-- Place where previews will be displayed -->
 ````

 ````javascript
$('input[type="file"]').upload();
````

Options
==============
- browser - is an {Object} element which allows you to select file from hard drive. It can be button with "Select file" text, it can be dropzone div with "Drop your file here" text, it even can be a span or section or every other html element. It depends on you.
    - render() - is a {Function} where you have to build and return {HTMLElement} of selecting file item.

 ````javascript
$('input[type="file"]').upload({
        browser: {
            render: function() {
                var button = document.createElement('button');
                $(button).text('Select file');
                $('#browser').html(button);
                return button;
            }
        }
});
````
    - onDrop(htmlElement, event) - is a {Function} where you can implement behaviour for file drop moment.

 ````javascript
$('input[type="file"]').upload({
        browser: {
            onDrop: function(htmlElement, event) {
                alert('You have just dropped a file!');
            }
        }
});
````
    - onClick(htmlElement, event) - is a {Function} where you can implement behaviour for browser click moment.

 ````javascript
$('input[type="file"]').upload({
        browser: {
            onClick: function(htmlElement, event) {
                alert('You have just click on select file button!');
            }
        }
});
````
    - onDragOver(htmlElement, event) - is a {Function} where you can implement behaviour for file dragging-over dropzone moment.

 ````javascript
$('input[type="file"]').upload({
        browser: {
            onDragOver: function(htmlElement, event) {
                alert('You have just have your file over dropzone');
            }
        }
});
````
    - onDragEnter(htmlElement, event) - is a {Function} where you can implement behaviour for file dragging-enter dropzone moment.

 ````javascript
$('input[type="file"]').upload({
        browser: {
            onDragEnter: function(htmlElement, event) {
                alert('You have just entered your file to dropzone');
            }
        }
});
````
- preview - is an {Object} element which allows you to conifugre type of files you are going to upload, design and view about preview elements and many more.

    - render() - is a {Function} where you can buid your preview container and all of it's elements.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            render: function() {
                var ul = (new Uploader.Html()).getUl(); //same as document.createElement('ul')
                var li = (new Uploader.Html()).getLi(); //same as document.createElement('li')
                var div = (new Uploader.Html()).getDiv(); //same as...
                var upload = (new Uploader.Html()).getButton(); //same as...
                var cancel = (new Uploader.Html()).getButton(); //...
                var progress = (new Uploader.Html()).getProgress(); //...

                $(upload).text('Upload file');
                $(cancel).text('Cancel');
                $('#preview').html(ul);

                return { 
                    container: ul,
                    item: li,
                    preview: div, //order of this property has meaning
                    progress: progress, //order of this property has meaning
                    upload: upload, //order of this property has meaning
                    cancel: cancel //order of this property has meaning
                };
            }
        }
});
````
    - styles - is an {Object} where you can define styles preview thumbnail.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            styles: { width: '500px', height: '200px' }
        }
});
````
    - maxFiles - is an {Number} value which describes how many files you can upload.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            maxFiles: 4
        }
});
````
    - minFileSize - is an {String} value which describes the minimun file size.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            minFileSize: '1KB'
        }
});
````
    - maxFileSize - is an {String} value which describes the maximum file size.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            maxFileSize: '10MB'
        }
});
````
    - allowedMimeTypes - is an {Object} of allowed mime types strings.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            allowedMimeTypes: ['image/jpeg', 'image/png']
        }
});
````
    - allowedExtensions - is an {Object} of allowed file extensions.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            allowedExtensions: ['jpg', 'png']
        }
});
````
    - forbiddenMimeTypes - is an {Object} of forbidden mime types.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            forbiddenMimeTypes: ['application/pdf']
        }
});
````
    - forbiddenExtensions - is an {Object} of forbidden file extensions.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            forbiddenExtensions: ['pdf']
        }
});
````
    - errorMessages - is an {Object} as set of error messages.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            errorMessages: {
                forbidden: 'You cannot select forbidden file.',
                tooLargeFile: 'Your file is too large.',
                tooSmallFile: 'Your file is too small.',
                tooManyFiles: 'You cannot upload more files.'
            }
        }
});
````
    - error - is an {Function} where you can handle one of the error messages.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            error: function(message) {
                alert(message);
            }
        }
});
````
    - upload - is an {Object} as set of preview upload settings.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            upload: {
                url: '/upload',
                onLoad: function(event, file, upload) {},
                onAbort: function(event, file, upload) {},
                onError: function(event, file, upload) {},
                onLoadEnd: function(event, file, upload) {},
                onTimeout: function(event, file, upload) {},
                onProgress: function(event, file, upload) {},
                onLoadStart: function(event, file, upload) {}
            }
        }
});
````
    - crop - is a {Boolean} value reserved for future reasons to allow cropping images.

 ````javascript
$('input[type="file"]').upload({
        preview: {
            crop: true
        }
});
````

Full configuration
==============
````javascript
$('input[type="file"]').upload({
        browser : {
            render: function() {
                var button = (new Uploader.Html()).getButton();
                $(button).text('Select file');
                $('#browser').html(button);
                return button;
            },
            onDrop: function(htmlElement, event) {},
            onClick: function(htmlElement, event) {},
            onDragOver: function(htmlElement, event) {},
            onDragEnter: function(htmlElement, event) {}
        },
        preview: {
            render: function() { //Renders preview container
                var ul = (new Uploader.Html()).getUl();
                var li = (new Uploader.Html()).getLi();
                var div = (new Uploader.Html()).getDiv();
                var upload = (new Uploader.Html()).getButton();
                var cancel = (new Uploader.Html()).getButton();
                var progress = (new Uploader.Html()).getProgress();

                $(upload).text('Upload file');
                $(cancel).text('Cancel');
                $('#preview').html(ul);

                return {
                    container: ul,
                    item: li,
                    preview: div,
                    progress: progress,
                    upload: upload,
                    cancel: cancel
                };
            },
            styles: { width: 500, height: 300},
            maxFiles: 4,
            minFileSize: '1KB',
            maxFileSize: '10MB',
            allowedMimeTypes: [],
            allowedExtensions: ['jpg'],
            forbiddenMimeTypes: [],
            forbiddenExtensions: [],
            errorMessages: {
                forbidden: 'You cannot select forbidden file.',
                tooLargeFile: 'Your file is too large.',
                tooSmallFile: 'Your file is too small.',
                tooManyFiles: 'You cannot upload more files.'
            },
            error: function(message) {
                alert(message);
            },
            upload: {
                url: '/upload',
                onLoad: function(event, file, upload) {},
                onAbort: function(event, file, upload) {},
                onError: function(event, file, upload) {},
                onLoadEnd: function(event, file, upload) {},
                onTimeout: function(event, file, upload) {},
                onProgress: function(event, file, upload) {},
                onLoadStart: function(event, file, upload) {}
            },
            crop: true //not supported yet
        }
    });
````
