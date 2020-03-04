$(window).resize(function() {
    $('#content-table-main').height($(window).height() - '100px');
});

$(window).trigger('resize');
