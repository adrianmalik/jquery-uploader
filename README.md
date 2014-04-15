#jQuery Uploader

The simplest configuration:

 ````html
<script src="/jquery/jquery.js"></script>
<script src="/jquery-uploader/jquery-uploader.js"></script>
 ````

 ````javascript
$('.file').upload({
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


#Requirements
XMLHttpRequest (Level 2), HTML5, jQuery
