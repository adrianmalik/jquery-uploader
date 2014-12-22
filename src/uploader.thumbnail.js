Uploader.Thumbnail = function() {
    var self = this;

    var setStyles = function(htmlElement, styles) {
        if (typeof styles === 'object') {
            for (var property in styles) {
                $(htmlElement).css(property, styles[property]);
            }
        }

        return self;
    };

    this.getImage = function(file, styles) {
        var img = (new Uploader.Html()).getImg();
        var reader = new FileReader();

        reader.onloadend = function() {
            img.src = reader.result;
            setStyles(img, styles);
        };

        reader.readAsDataURL(file);

        return img;
    };

    this.getVideo = function(file, styles) {
        var video = new (Uploader.Html()).getVideo();
        var reader = new FileReader();

        reader.onloadend = function() {
            video.src = reader.result;
            setStyles(video, styles);
        };

        reader.readAsDataURL(file);

        return video;
    };

    this.getDefault = function(file, styles) {
        return '//TODO';
    };

    this.filterParams = function(params) {
        var html = new Uploader.Html();

        if (typeof params !== html.TYPE_OBJECT) {
            params = {};
        }

        if (typeof params.container !== html.TYPE_OBJECT) {
            params.container = html.getUl();
            $('#preview').html(params.container);
        }

        if (typeof params.item !== html.TYPE_OBJECT) {
            params.item = html.getLi();
        }

        if (typeof params.preview !== html.TYPE_OBJECT) {
            params.preview = html.getDiv();
        }

        if (typeof params.progress !== html.TYPE_OBJECT) {
            params.progress = html.getProgress();
        }

        if (typeof params.upload !== html.TYPE_OBJECT) {
            params.upload = html.getButton();
            $(params.upload).text('Upload file');
        }

        if (typeof params.cancel !== html.TYPE_OBJECT) {
            params.cancel = html.getButton();
            $(params.cancel).text('Cancel');
        }

        return params;
    };
};