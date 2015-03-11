jQuery Uploader
==============
jQuery Uploader library is designed for everybody who wants to implement asynchronous files uploader in his project. It is the only uploader which allows you to configure many details and customize your uploading proces however you want.


Simple configuration
==============
Html code:
 ````html
<script src="/js/jquery.js"></script> <!-- At least 2.0 version -->
<script src="/js/jquery-uploader.js"></script>

<input type="file">
<div id="browser"></div> <!-- File browser element -->
<div id="preview"></div> <!-- Place where previews will be displayed -->
 ````
JavaScript code:
 ````javascript
$(document).ready(function() {
    $('input').upload({
        browser: {
            render: function() {
                var button = document.createElement('button');
                $(button).text('Select file');
                $('#browser').html(button);
                return button;
            }
        },
        preview: {
            render: function () {
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
});
````

Full configuration
==============
Html code:
 ````html
<script src="/js/jquery.js"></script> <!-- At least 2.0 version -->
<script src="/js/jquery-uploader.js"></script>

<input type="file">
<div id="browser"></div> <!-- File browser element -->
<div id="preview"></div> <!-- Place where previews will be displayed -->
 ````
JavaScript code:
 ````javascript
$(document).ready(function() {
    $('input').upload({
        browser: {
            render: function() {
                var button = document.createElement('button');
                $(button).text('Select file');
                $('#browser').html(button);
                return button;
            },
            onDrop: function(htmlElement, event) {},
            onClick: function(htmlElement, event) {},
            onDragOver: function(htmlElement, event) {},
            onDragEnter: function(htmlElement, event) {},
            onDragLeave: function(htmlElement, event) {}
        },
        preview: {
            render: function () {
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
            },
            maxFiles: 4,
            minFileSize: '1KB',
            maxFileSize: '10MB',
            allowedMimeTypes: ['image/jpeg', 'image/png'],
            allowedExtensions: ['jpg', 'png'],
            forbiddenMimeTypes: ['application/pdf'],
            forbiddenExtensions: ['pdf'],
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
            }
        }
    });
});
````