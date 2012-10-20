/*
    Yahoo!OpenHackDay 2012
    name: contentscript.js
*/

(function() {

/*
 * const
 */

const moon_url_const = 'http://moon.cse.yzu.edu.tw/~s951440/yhack/';
const yhack_url_const = 'http://127.0.0.1:8080/yhack/yhack.php';
const yhack_loading_gif = 'yhack_loading_pac.gif';

const yhack_pages_ref_text = '同類型商家';
const yhack_pages_near_text = '附近商家';
const yhack_pages_basic_info_text = '基本資料';
const yhack_pages_blog_text = '網友評論';
const yhack_pages_photo_text = '相關照片';
const yhack_pages_theather_text = '今日電影時刻表';
const yhack_pages_source_help_text = '資料來源';
const yhack_pages_source_life_plus_text = 'Yahoo! 生活+';
const yhack_pages_parking_text = '停車資訊';
const yhack_events_weather_text = '活動當天氣象預測';

/*
 * addSection
 */
var addSection = function(id, title, is_main) {
    var header = $('<div>')
        .addClass('uiHeader')
        .addClass('uiHeaderTopAndBottomBorder')
        .addClass('infoSectionHeader')
        .addClass('uiHeaderSection')
        .append($('<h4>')
            .addClass('uiHeaderTitle')
            .addClass('yhack_title_section')
            .append($('<span>')
                .addClass('yhack_icon_section')
                .append($('<img>')
                    .attr('src', moon_url_const + 'yhack_facebook_16.png')))
            .append(title));

    className = 'yhack_loading';
    if (is_main !== undefined && is_main === true)
        className = className + '_main';

    var body = $('<div>')
        .addClass('yhack_content')
        .append($('<div>')
            .addClass(className)
            .append($('<img>')
                .attr('width', '16')
                .attr('height', '16')
                .attr('src', moon_url_const + yhack_loading_gif)))
        .hide().fadeIn();

    var section = $('<div>')
        .attr('id', id)
        .append(header)
        .append(body);

    $('#pagelet_info').before(section);
}

/*
 * addSideSection
 */
var addSideSection = function(id, title) {
    var header = $('<div>')
        .addClass('uiHeader')
        .addClass('uiHeaderTopBorder')
        .addClass('mbs')
        .addClass('pbs')
        .addClass('uiSideHeader')
        .append($('<h6>')
            .addClass('uiHeaderTitle')
            .addClass('yhack_title_section')
            .append($('<span>')
                .addClass('yhack_icon_section')
                .append($('<img>')
                    .attr('src', moon_url_const + 'yhack_facebook_16.png')))
            .append(title));

    var body = $('<div>')
        .addClass('yhack_content')
        .append($('<div>')
            .addClass('yhack_loading')
            .append($('<img>')
                .attr('width', '16')
                .attr('height', '16')
                .attr('src', moon_url_const + yhack_loading_gif)))
        .hide().fadeIn();

    var section = $('<div>')
        .attr('id', id)
        .append(header)
        .append(body);

    $('#tips_main_box').before(section);
}

/*
 * appendSource
 */
var appendSource = function(url) {
    var yhack_pages_source_text = $('<span>')
        .addClass('fsm')
        .addClass('fwn')
        .addClass('fcg')
        .attr('id', 'yhack_pages_source_text')
        .append(yhack_pages_source_help_text)
        .append($('<a>')
            .attr('href', url)
            .attr('target', '_blank')
            .text(yhack_pages_source_life_plus_text
                + ' (' + $('.profileName').text() + ')'));
    $('.fbProfileByline').append(yhack_pages_source_text);
}

/*
 * appendBasicInfo
 */
var appendBasicInfo = function(obj) {
    var yhack_pages_basic_content = $('<table>')
        .attr('id', 'yhack_pages_basic_content');
    $('#yhack_basic_info_section .yhack_content').append(yhack_pages_basic_content);

    for (var item in obj) {
        var get_sep_item = obj[item].search('：');
        var data_label = obj[item]
            .substr(0,get_sep_item).replace(/\s*/g, '');
        var data_value = obj[item]
            .substr(get_sep_item + 1, obj[item].length);

        var data_value = data_value.replace(/\(\d{1,3}\)/g,', ');
        console.log(data_value);

        yhack_pages_basic_content.append($('<tr>')
            .append($('<td>')
                .addClass('yhack_table_section_label_style')
                .append($('<span>')
                    .addClass('yhack_table_section_label')
                    .text(data_label)))
            .append($('<td>')
                .append($('<span>')
                    .addClass('yhack_table_section_value')
                    .text(data_value))))
            .hide().fadeIn();
    }
}

/*
 * appendComments
 */
var appendComments = function(obj) {
    for (var comment in obj) {
        var title = '';
        var href = '';

        for (var item in obj[comment]) {
            if (item == 'href')
                href = obj[comment][item]
            if (item == 'title')
                title = obj[comment][item]
        }

        $('#yhack_pages_blog_section .yhack_content').append($('<div>')
            .addClass('phs')
            .append($('<a>')
                .attr('target', '_blank')
                .attr('href', href)
                .text(title))
            .hide().fadeIn());
    }
}

/*
 * appendPhotos
 */
var appendPhotos = function(obj) {
    var yhack_photos_pool = $('<div>')
        .addClass('fbProfilePhotoBar')
        .attr('id', 'container');
    $('#yhack_photos_section .yhack_content').append(yhack_photos_pool);

    for (var item in obj) {
        link = obj[item].replace('//','http://');
        yhack_photos_pool.append($('<a>')
            .attr('href', link.replace('200x200', '450x450'))
            .attr('rel', 'shadowbox')
            .attr('title', $('.profileName').text())
            .append($('<img>')
                .addClass('yhack_facebook_img')
                .attr('src', link)));
    }

    Shadowbox.init({'overlayOpacity':'0.8'});
}

/*
 * appendTheather
 */
var appendTheather = function() {
    addSection('yhack_theather_info_section_text', yhack_pages_theather_text);
    var yhack_theather_info_table = $('<table>')
        .attr('id', 'yhack_theather_info_table');
    $('#yhack_theather_info_section_text').append(yhack_theather_info_table);

    var url = yhack_url_const
        + '?mode=theather&theather_name='
        + encodeURI($('.profileName').text());
    $.get(url, {}, function(data) {
        var theather_obj = jQuery.parseJSON(data);
        var theather_counter = 0;
        console.log(theather_obj);

        for (var th_key in theather_obj) {
            var get_theather_url = '';
            var get_theather_image = '';
            var get_theather_name = '';
            var get_theather_time = new Array();
            var get_theather_time_text = '';
            for (var th_item in theather_obj[th_key]) {
                if (th_item == 'url') {
                    console.log(theather_obj[th_key][th_item]);
                    get_theather_url = theather_obj[th_key][th_item];
                }
                else if (th_item == 'img') {
                    console.log(theather_obj[th_key][th_item]);
                    get_theather_image = theather_obj[th_key][th_item];
                }
                else if (th_item == 'name') {
                    console.log(theather_obj[th_key][th_item]);
                    get_theather_name = theather_obj[th_key][th_item];
                }
                else if (th_item == 'time') {
                    console.log(theather_obj[th_key][th_item]);
                    for (var th_time in theather_obj[th_key][th_item]) {
                        get_theather_time.push(theather_obj[th_key][th_item][th_time]);
                    }
                }

                for (var k=0;k<get_theather_time.length;k++){
                    get_theather_time_text = get_theather_time.join('\t');
                }
            }

            yhack_theather_info_table.append($('<tr>')
                .addClass('theather_default_show')
                .append($('<td>')
                    .append($('<a>')
                        .attr('target', '_blank')
                        .attr('href', get_theather_url)
                        .append($('<img>')
                            .attr('src', get_theather_image))))
                .append($('<td>')
                    .append($('<a>')
                        .attr('target', '_blank')
                        .attr('href', get_theather_url)
                        .text(get_theather_name))
                    .append('<hr>')
                    .append(get_theather_time_text)).hide().fadeIn());
        }

        $('.yhack_loading_theather .yhack_content').hide();
    });
}

/*
 * appendPark
 */
var appendPark = function(obj) {
    
    for (var item in obj) {
        //console.log(obj[item]);
        var address = new Array();
        var name = new Array();
        var totalBike = new Array();
        var totalCar = new Array();
        var totalMotor = new Array();
         
        for (var key in obj[item]) {

            
            if (key == 'address')
                address.push(obj[item][key]);
            else if (key == 'name')
                name.push(obj[item][key]);
            else if (key == 'totalBike')
                totalBike.push(obj[item][key]);
            else if (key == 'totalCar')
                totalCar.push(obj[item][key]);
            else if (key == 'totalMotor')
                totalMotor.push(obj[item][key]);
        }
        
        for (var i=0;i<name.length;i++)
        {
            $('#yhack_more_parking_section .yhack_content').append($('<div>')
            .addClass('yhack_sidebar_section')
            .addClass('phs')
            .append('<span class="yhack_table_section_label">' + name[i] + '</span>')
            .append('<br />')
            .append('<a href="#">' + address[i] + '</a>')
            .append('<br />')
            .append('總汽車位: ' + totalCar[i])
            .append('<br />')
            .append('總摩托車位: ' + totalMotor[i])
            .append('<hr />')
            .append('總腳踏車位: ' + totalBike[i])
            .append('<br />'));
        }
        
         
    }
}


/*
* add_screen_mask
*/
var add_screen_mask = function(obj) {
    var yhack_screen_mask = $('<div>')
        .addClass('yhack_screen_mask')
        .attr('id', 'yhack_screen_mask')
        .height($(document).height());

    $('body').append(yhack_screen_mask);

    // add yhack_logo_ya_resize & yhack_logo_hook_resize
    var yhack_logo_hook_resize = $('<div>')
        .addClass('yhack_logo_hook_resize')
        .attr('id', 'yhack_logo_hook_resize');
    $('body').append(yhack_logo_hook_resize);
    
    var yhack_logo_ya_resize = $('<div>')
        .addClass('yhack_logo_ya_resize')
        .attr('id','yhack_logo_ya_resize');
    $('body').append(yhack_logo_ya_resize);


    $('#yhack_logo_ya_resize').animate({'left':'300px'});
    $('#yhack_logo_hook_resize').animate({'left':'300px'});
}

/*
* remove_screen_mask
*/
var remove_screen_mask = function(obj) {
    $('#yhack_logo_ya_resize')
        .transition({ scale: 2.0,opacity: 0 }, function() {
            $(this).remove();
        });
    $('#yhack_logo_hook_resize')
        .transition({ scale: 2.0,opacity: 0 }, function() {
            $(this).remove();
        });

    $(yhack_screen_mask).removeClass('yhack_screen_mask');

}

/*
 * appendMore
 */
var appendMore = function(obj) {
    for (var type in obj) {
        if (type == 'data_rel') {
            for (var inner_rel in obj[type]) {
                var title = '';
                var href = '';

                for (var fin_rel in obj[type][inner_rel]) {
                    if (fin_rel == 'href')
                        href = obj[type][inner_rel][fin_rel];
                    else if (fin_rel == 'title')
                        title = obj[type][inner_rel][fin_rel];
                }

                $('#yhack_more_ref_section .yhack_content').append($('<div>')
                    .addClass('yhack_sidebar_section')
                    .addClass('phs')
                    .append($('<a>')
                        .attr('target', '_blank')
                        .attr('href', href)
                        .text(title)));
            }
        }
        else if (type == 'data_near') {
            for (var inner in obj[type]) {
                var title = '';
                var href = '';

                for (var fin in obj[type][inner]) {
                    if (fin == 'href')
                        href = obj[type][inner][fin];
                    else if (fin == 'title')
                        title = obj[type][inner][fin];
                }

                $('#yhack_more_near_section .yhack_content').append($('<div>')
                    .addClass('yhack_sidebar_section')
                    .addClass('phs')
                    .append($('<a>')
                        .attr('target', '_blank')
                        .attr('href', href)
                        .text(title)));
            }
        }
    }
}

/*
 * entry point
 */
$(document).ready(function() {
    var action = window.location.pathname.match(/\/\w{3,10}\//);

    /*** pages ***/
    if (action == '/pages/') {
        console.log('[check] facebook /pages/ loaded');

        if ($("#fbTimelineNavTopRow").hasClass('clearfix'))
        {
            console.log("timeline");
        }
        else
        {
            add_screen_mask();
        }

        

        // get geo information
        var get_lat_lon_url = $('.mtm').find('a').attr('href');
        get_lat_lon_url = (get_lat_lon_url
            .toString()
            .match(/\d{1,3}\.\d{1,20}_\d{1,3}\.\d{1,20}/))[0];

        console.log(get_lat_lon_url);
        var get_ymap_lat = get_lat_lon_url
            .substr(0, get_lat_lon_url.search('_'));
        var get_ymap_lon = get_lat_lon_url
            .substr(get_lat_lon_url.search('_') + 1, get_lat_lon_url.length);


        // add sections
        addSection('yhack_basic_info_section', yhack_pages_basic_info_text, true);
        addSection('yhack_pages_blog_section', yhack_pages_blog_text);
        addSection('yhack_photos_section', yhack_pages_photo_text);
        addSideSection('yhack_more_near_section', yhack_pages_near_text);
        addSideSection('yhack_more_ref_section', yhack_pages_ref_text);
        addSideSection('yhack_more_parking_section', yhack_pages_parking_text);

        // query data
        $('body').append(yhack_screen_mask);
        var url = yhack_url_const
            + '?mode=search&query='
            + encodeURI($('.profileName').text());

        var search_ajax_get = $.get(url, {}, function(data) {
            appendSource(data);
            console.log(get_ymap_lat);
            console.log(get_ymap_lon);

            var url = yhack_url_const
                + '?mode=basic&url=' + data
                + '&storelat=' + get_ymap_lat + '&storelon=' + get_ymap_lon + '&query=' + encodeURI($('.profileName').text());

            $.get(url, {}, function(data) {
                var theather_filter_text = ['影城','電影院','威秀','戲院','喜滿客'];
                theather_filter_bool = false;
                for (var i = 0; i < theather_filter_text.length; i++) {
                    if ($('.profileName').text().search(theather_filter_text[i])!=-1){
                        theather_filter_bool = true;
                    }
                }

                console.log(theather_filter_bool);
                if (theather_filter_bool)
                    appendTheather();

                var obj = jQuery.parseJSON(data);
                $('.yhack_loading').fadeOut(500);
                $('.yhack_loading_main').fadeOut(500, function() {
                    
                    remove_screen_mask();

                    for (var key in obj) {
                        if (key == 'basic')
                            appendBasicInfo(obj[key]);
                        else if (key == 'comments')
                            appendComments(obj[key]);
                        else if (key == 'photos')
                            appendPhotos(obj[key]);
                        else if (key == 'more')
                            appendMore(obj[key]);
                        else if (key == 'park')
                            appendPark(obj[key]);
                    }
                });
            });
        }).error(function() {
            console.log("search error");
            remove_screen_mask();
            $('.yhack_loading').fadeOut(500);
            $('.yhack_loading_main').fadeOut(500);
        });
    }

    /*** events ***/
    else if (action == '/events/') {
        console.log('[check] facebook /events/ loaded');

        var getvalue = ($('#pagelet_event_details').find('a'))[0];
        get_date = (getvalue.toString().match(/[A-Z]\w{3,20}\/\d{1,2}/))[0];
        get_address = $('.fbEventLocationInfo').text();

        //var get_lat_lon = $('._8m').children('._6a').children('._6a._6b').children('.fsm.fwn.fcg').has('a').children().eq(1).attr('href');
        var get_lat_lon = $('a[href^="http://bing.com/maps/"]').attr('href');
        get_lat_lon = get_lat_lon.match(/\d{1,3}\.\d{1,20}_\d{1,3}\.\d{1,20}/)[0];
        var get_lat = get_lat_lon.substr(0, get_lat_lon.indexOf('_'));
        var get_lon = get_lat_lon.substr(get_lat_lon.indexOf('_') + 1);

        if (get_lon!='')
        {
            add_screen_mask();
        }
            
        // console.log(get_date);
        // console.log(get_address);
        // console.log(get_lat);
        // console.log(get_lon);
        $.get(yhack_url_const + '?mode=events&address=' + encodeURI(get_address) + '&date=' + get_date + '&lat=' + get_lat + '&lon=' + get_lon, {}, function(data){
            var obj = jQuery.parseJSON(data);
            //console.log(obj);

            var temp_low = '';
            var temp_high = '';
            var temp_img = '';
            var temp_url = '';
            for (var item in obj) {
                if (item == 'temp_low')
                    temp_low = obj[item];
                else if (item == 'temp_high')
                    temp_high = obj[item];
                else if (item == 'img')
                    temp_img = obj[item];
                else if (item == 'url')
                    temp_url = obj[item];
            }

            //console.log(temp_img);
            if (temp_img.length > 3) {
                $($(".ego_section")[0]).prepend("<div class='uiHeader uiHeaderTopBorder mbs uiSideHeader'>"
                + "<div class='clearfix uiHeaderTop'>"
                + "<div>"
                + "<h6 tabindex='0' class='uiHeaderTitle yhack_title_section' aria-hidden='true'>" + yhack_events_weather_text + "</h6>"
                + "</div></div></div>"
                + "<a class='uiHeaderActions yhack_weather_link' target='_blank' href='"
                + temp_url + "'><div class='ego_unit_container'>"
                + "<div class='ego_unit'>"
                + "<div class='_4u8'>"
                + "<img class='yhack_weather_image' src='" + temp_img + "' />"
                + "<div class='yhack_weather_widget'>"
                + "<span class='yhack_weather_high_temp'>" + temp_high + "&degc</span>"
                + "<span class='yhack_weather_low_temp'>" + temp_low + "&degc</span>"
                + "</div></div></div></a></div>");


                remove_screen_mask();
                

                /*
                $(".ego_section").prepend($('<div>')
                    .append($('<div>')
                        .addClass('uiHeader')
                        .addClass('uiHeaderTopBorder')
                        .addClass('mbs')
                        .addClass('uiSideHeader')
                        .append($('<div>')
                            .addClass('clearfix')
                            .addClass('uiHeaderTop')
                            .append($('<div>')
                                .append($('<h6>')
                                    .addClass('uiHeaderTitle')
                                    .addClass('yhack_title_section')
                                    .text(yhack_events_weather_text)))))
                    .append($('<div>')
                        .append($('<a>')
                            .addClass('uiHeaderActions')
                            .addClass('yhack_weather_link')
                            .attr('target', '_blank')
                            .attr('href', temp_url)
                            .append($('<div class="ego_unit_container">')
                                .append($('<div class="ego_unit">')
                                    .append($('<div class="_4u8">')
                                        .append($('<img>')
                                            .addClass('yhack_weather_image')
                                            .attr('src', 'temp_img'))
                                        .append($('<div class="yhack_weather_widget">')
                                            .append($('<span>')
                                                .addClass('yhack_weather_high_temp')
                                                .text(temp_high + '&degc'))
                                            .append($('<span>')
                                                .addClass('yhack_weather_low_temp')
                                                .text(temp_low + '&degc')))))))));
                */
            }
            else
            {
                $('#yhack_logo_ya_resize')
                    .transition({ scale: 2.0,opacity: 0 }, function() {
                        $(this).remove();
                    });
                $('#yhack_logo_hook_resize')
                    .transition({ scale: 2.0,opacity: 0 }, function() {
                        $(this).remove();
                    });

                $(yhack_screen_mask).removeClass('yhack_screen_mask');
            }
        });
    }
});

})();

