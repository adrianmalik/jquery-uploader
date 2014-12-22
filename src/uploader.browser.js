Uploader.Browser = function(params) {
    var self = this;

    this.htmlElement; /* {HTMLElement} */
    this.onDrop = params.onDrop; /* {Function} */
    this.onClick = params.onClick; /* {Function} */
    this.onDragOver = params.onDragOver; /* {Function} */
    this.onDragEnter = params.onDragEnter; /* {Function} */

    this.render = function() {
        self.htmlElement = params.render();
        return self;
    };

    this.attachOnDrop = function(preview) {
        $(self.htmlElement).on('drop', function(event) {
            event.preventDefault();
            for (var i = 0; i < event.originalEvent.dataTransfer.files.length; i++) {
                preview.renderItem(files[i]);
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

    this.attachOnClick = function(input) {
        $(self.htmlElement).on('click', function(event) {
            event.preventDefault();
            $(input.getHtmlElement()).trigger('click');
            self.onClick(this, event);
        });

        return self;
    };
};