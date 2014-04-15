#jQuery Uploader

The simplest configuration:

 ````html
<script src="/jquery/jquery.js"></script>
<script src="/jquery-uploader/jquery-uploader.js"></script>
 ````

 ````javascript
$('input[type="file"]').upload({
   url: '/upload'
});
````

 ````html
<form enctype="multipart/form-data" action="/javascript.php" method="post">
    <input type="file" name="file"  multiple="multiple"/>
    <div data-jq-upload-error></div>
    <div data-jq-upload-preview></div>
</form>
  ````

#jQuery Uploader Options 
 ````javascript
$('input[type="file"]').upload({
    url: '/', //The url where the file will be sent to
    preview: { 
        selector: '[data-jq-upload-preview]', //Selector of item where preview will be displayed
        width: 400, //Width of preview image
        height: 200 //Height or preview image
    },
    trigger: {
        type: 'button', //Available options ['button', 'dropzone']
        attributes: {                                   // ['id', 'class', 'style'...]
            id: 'button-id', //Trigger id attribute 
            class: 'button-class', //Trigger class attribute
            style: 'width:100px' //Trigger style attribute
            ... //You can add whatever attribute here you want to
        }
    },
    selectFileText: 'Select file from your hard drive', //Text displayed inside button or dropzone
    timeout: 8000, //Timeout of ajax request
    maxFiles: 4, //Max available number of uploaded files
    maxSize: '80000000', //Max size of single file in bytes
    allowedMimeTypes: ['image/jpeg'], //Allowed mimetypes of uploaded files
    allowedExtensions: ['jpg'], //Allowed extensions of uploaded files
    error: {
        selector: '[data-jq-upload-error]',
        attributes: {
            style: 'border:1px solid red; color:red;'
        }
    },
    buttons: {
        upload: {
            text: 'Upload a file'
        },
        cancel: {
            text: 'Remove a file'
        }
    },
    upload: {
        onAbort: function(event, file, preview) {},
        onError: function(event, file, preview) {},
        onTimeout: function(event, file, preview) {},
        onSuccess: function(event, file, preview) {},
        onLoadEnd: function(event, file, preview) {},
        onProgress: function(event, file, preview) {},
        onLoadStart: function(event, file, preview) {}
    }
});
````
