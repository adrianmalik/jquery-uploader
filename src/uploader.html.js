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