var Uploader = {};
jQuery.fn.upload = function(construct) {
    var params = (new Uploader.Filter()).filterParams(construct);
    var browser = new Uploader.Browser(params.browser);
    var preview = new Uploader.Preview(params.preview);
    var input = (new Uploader.Input(this[0], params));

    input.hide().attachOnChange(preview);

    browser.render();
    browser.attachOnClick(input);
    browser.attachOnDrop(preview);
    browser.attachOnDragEnter();
    browser.attachOnDragOver();

    preview.renderContainer();
};