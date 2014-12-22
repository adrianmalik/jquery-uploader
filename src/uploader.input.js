Uploader.Input = function(htmlElement, params) {
    var self = this;

    new function() {
        if ($(htmlElement).prop('tagName').toLowerCase() !== 'input') {
            throw new Error('Missing input file');
        }

        if ($(htmlElement).attr('type') !== 'file') {
            throw new Error('Input must have type "file"');
        }

        if (params.preview.maxFiles > 1) {
            $(htmlElement).attr('multiple', 'multiple');
        }
    }();

    this.attachOnChange = function(preview) {
        $(htmlElement).on('change', function(event) {
            var files = event.originalEvent.srcElement.files;
            for (var i = 0; i < files.length; i++) {
                preview.renderItem(files[i]);
            }
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

    return self;
};