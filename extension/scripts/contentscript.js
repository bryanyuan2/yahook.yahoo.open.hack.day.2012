/*
    Yahoo!OpenHackDay 2012
    name: contentscript.js
*/

(function() {

    $(document).ready(function() {

        /*
            const var
        */
        var moon_url_const = "http://moon.cse.yzu.edu.tw/~s951440/yhack/";
        var yhack_url_const = "http://127.0.0.1:8080/yhack/yhack.php";
        var yhack_loading_gif = "yhack_loading_pac.gif";

        /*
            const text content
        */
        var yhack_pages_ref_text = "同類型商家";
        var yhack_pages_near_text = "附近商家";
        var yhack_pages_basic_info_text = "基本資料";
        var yhack_pages_blog_text = "網友評論";
        var yhack_pages_photo_text = "相關照片";
        var yhack_pages_theather_text = "今日電影時刻表";
        var yhack_pages_source_help_text = "資料來源";
        var yhack_pages_source_life_plus_text = "Yahoo! 生活+";
        var yhack_events_weather_text = "活動當天氣象預測";
        

        var pathname = window.location.pathname;
        var action = pathname.match(/\/\w{3,10}\//);
        
        /*
            when the facebook url equal to [www.facebook.com/pages/*]
        */
        if (action=="/pages/")
        {
            console.log("[check] facebook /pages/ loaded");


            var test = document.createElement('div');
            $(test).addClass("screenMask").attr("id","fuck");
            $('.screenMask').height($(document).height());
            $("body").append(test);

            

            var get_lat_lon_url = $(".mtm").find("a").attr('href');

            get_lat_lon_url = (get_lat_lon_url.toString().match(/\d{1,3}\.\d{1,20}_\d{1,3}\.\d{1,20}/))[0];
            console.log(get_lat_lon_url);
            var get_ymap_lon = get_lat_lon_url.substr(0,get_lat_lon_url.search("_"));
            var get_ymap_lat = get_lat_lon_url.substr(get_lat_lon_url.search("_")+1,get_lat_lon_url.length);
            
            
            // yhack_basic_info_section
            var yhack_basic_info_section = document.createElement('div');
            var yhack_basic_info_section_text = document.createElement('div');
            
            $(yhack_basic_info_section).addClass("uiHeader")
            .addClass("uiHeaderTopAndBottomBorder")
            .addClass("infoSectionHeader")
            .addClass("uiHeaderSection")
            .attr('id', 'yhack_basic_info_section')
            .append("<h4 tabindex='0' class='uiHeaderTitle yhack_title_section'><span class='yhack_icon_section'><img src='"+moon_url_const+"yhack_facebook_16.png'></span>" + yhack_pages_basic_info_text + "</h4>");

            $("#pagelet_info").before(yhack_basic_info_section);
            $(yhack_basic_info_section).after(yhack_basic_info_section_text);
            
            $("<div class='yhack_loading'><img width='16' height='16' src='" + moon_url_const + yhack_loading_gif + "' /><br /></div>").hide().appendTo(yhack_basic_info_section_text).fadeIn();
                                

            // yhack_pages_blog_section
            var yhack_pages_blog_section = document.createElement('div');
            var yhack_pages_blog_section_text = document.createElement('div');
            $(yhack_pages_blog_section_text).attr("id","yhack_pages_blog_section_text");

            $(yhack_pages_blog_section).addClass("uiHeader")
            .addClass("uiHeaderTopAndBottomBorder")
            .addClass("infoSectionHeader")
            .addClass("uiHeaderSection")
            .attr('id', 'yhack_pages_blog_section')
            .append("<h4 tabindex='0' class='uiHeaderTitle yhack_title_section'><span class='yhack_icon_section'><img src='"+moon_url_const+"yhack_facebook_16.png'></span>" + yhack_pages_blog_text + "</h4>");

            $("#pagelet_info").before(yhack_pages_blog_section);
            $(yhack_pages_blog_section).after(yhack_pages_blog_section_text);
            
            $("<div class='yhack_loading'><img width='16' height='16' src='" + moon_url_const + yhack_loading_gif + "' /><br /></div>").hide().appendTo(yhack_pages_blog_section_text).fadeIn();
            

            // add yhack_more_near_section
            var yhack_more_near_section = document.createElement('div');
            var yhack_more_near_section_text = document.createElement('div');
            
            $(yhack_more_near_section).addClass("uiHeader")
            .addClass("uiHeaderTopBorder")
            .addClass("mbs")
            .addClass("pbs")
            .addClass("uiSideHeader")
            .attr("id","yhack_more_near_section")
            .append("<h6 tabindex='0' class='uiHeaderTitle yhack_title_section' aria-hidden='true'><span class='yhack_icon_section'><img src='"+moon_url_const+"yhack_facebook_16.png'></span>" + yhack_pages_near_text + "</h6>");

            $("#tips_main_box").before(yhack_more_near_section);
            $(yhack_more_near_section).after(yhack_more_near_section_text);

            var yhack_more_near_section_pcontent = "<div class='yhack_loading'><img width='16' height='16' src='" + moon_url_const + yhack_loading_gif + "' /><br /></div>";
            $(yhack_more_near_section_pcontent).hide().appendTo(yhack_more_near_section_text).fadeIn();
            

            // add yhack_more_ref_section
            var yhack_more_ref_section = document.createElement('div');
            var yhack_more_ref_section_text = document.createElement('div');
            
            $(yhack_more_ref_section).addClass("uiHeader")
            .addClass("uiHeaderTopBorder")
            .addClass("mbs")
            .addClass("pbs")
            .addClass("uiSideHeader")
            .attr("id","yhack_more_ref_section")
            .append("<h6 tabindex='0' class='uiHeaderTitle yhack_title_section' aria-hidden='true'><span class='yhack_icon_section'><img src='"+moon_url_const+"yhack_facebook_16.png'></span>" + yhack_pages_ref_text + "</h6>");

            $("#tips_main_box").before(yhack_more_ref_section);

            $(yhack_more_ref_section).after(yhack_more_ref_section_text);
            $("<div class='yhack_loading'><img width='16' height='16' src='" + moon_url_const + yhack_loading_gif + "' /><br /></div>").hide().appendTo(yhack_more_ref_section_text).fadeIn();

            // add yhack_photos_section
            var yhack_photos_section = document.createElement('div');
            var yhack_photos_section_text = document.createElement('div');

            $(yhack_photos_section).addClass("uiHeader")
            .addClass("uiHeaderTopAndBottomBorder")
            .addClass("infoSectionHeader")
            .addClass("uiHeaderSection")
            .attr('id', 'yhack_photos_section')
            .append("<h4 tabindex='0' class='uiHeaderTitle yhack_title_section'><span class='yhack_icon_section'><img src='"+moon_url_const+"yhack_facebook_16.png'></span>" + yhack_pages_photo_text + "</h4>");

            $("#pagelet_info").before(yhack_photos_section);
            
            $(yhack_photos_section).after(yhack_photos_section_text);
            $("<div class='yhack_loading'><img width='16' height='16' src='" + moon_url_const + yhack_loading_gif + "' /><br /></div>").hide().appendTo(yhack_photos_section_text).fadeIn();

            /*
                search mode
            */
            $.get(yhack_url_const + "?mode=search&query=" + encodeURI($(".profileName").text()), {}, function(data){

                get_url_data = data;

                // add yhack_pages_source_text
                var yhack_pages_source_text = document.createElement('span');
                $(yhack_pages_source_text).addClass("fsm")
                .addClass("fwn")
                .addClass("fcg")
                .attr('id', 'yhack_pages_source_text')
                .append("\t" + yhack_pages_source_help_text + "<a target='_blank' href='" + get_url_data + "' >" + yhack_pages_source_life_plus_text + " (" + $(".profileName").text() + ")</a>");
                
                $(".fbProfileByline").append(yhack_pages_source_text);

                /*
                    basic mode
                */
                $.get(yhack_url_const + "?mode=basic&url=" + get_url_data + "&query=" + encodeURI($(".profileName").text()), {}, function(data){
                    
                    var theather_filter_text = ['影城','電影院','威秀','戲院','喜滿客'];
                    theather_filter_bool = false;
                    for(var i=0;i<theather_filter_text.length;i++) {
                        if ($(".profileName").text().search(theather_filter_text[i])!=-1){
                            theather_filter_bool = true;
                        }
                    }

                    console.log(theather_filter_bool);

                    if (theather_filter_bool==true){
                        
                        console.log("the theather !");

                        // yhack_theather_info_section
                        var yhack_theather_info_section = document.createElement('div');
                        var yhack_theather_info_section_text = document.createElement('div');

                        $(yhack_theather_info_section_text).attr('id','yhack_theather_info_section_text');
                        
                        $(yhack_theather_info_section).addClass("uiHeader")
                        .addClass("uiHeaderTopAndBottomBorder")
                        .addClass("infoSectionHeader")
                        .addClass("uiHeaderSection")
                        .attr('id', 'yhack_theather_info_section')
                        .append("<h4 tabindex='0' class='uiHeaderTitle yhack_title_section'>" + yhack_pages_theather_text + "</h4>");

                        $("#pagelet_info").before(yhack_theather_info_section);
                        $(yhack_theather_info_section).after(yhack_theather_info_section_text);

                        
                        $("<div class='yhack_loading_theather'><img width='16' height='16' src='" + moon_url_const + yhack_loading_gif + "' /><br /></div>").hide().appendTo(yhack_theather_info_section_text).fadeIn();

                        // add yhack_pages_basic_table
                        var yhack_theather_info_table = document.createElement('table');
                        
                        $(yhack_theather_info_table).attr('id','yhack_theather_info_table');
                        $(yhack_theather_info_section_text).append(yhack_theather_info_table);

                        $.get(yhack_url_const + "?mode=theather&theather_name=" + encodeURI($(".profileName").text()), {}, function(data){
                            
                            var theather_obj = jQuery.parseJSON(data);
                            var theather_counter = 0;
                            console.log(theather_obj);
                            
                            for (var th_key in theather_obj)
                            {

                                var get_theather_url = "";
                                var get_theather_image = "";
                                var get_theather_name = "";
                                var get_theather_time = new Array();
                                var get_theather_time_text = "";

                                for (var th_item in theather_obj[th_key])
                                {
                                    
                                    if (th_item=='url'){
                                        console.log(theather_obj[th_key][th_item]);   
                                        get_theather_url = theather_obj[th_key][th_item];                       
                                    }
                                    else if (th_item=='img'){
                                        console.log(theather_obj[th_key][th_item]);
                                        get_theather_image = theather_obj[th_key][th_item];                             
                                    }
                                    else if (th_item=='name'){
                                        console.log(theather_obj[th_key][th_item]);
                                        get_theather_name = theather_obj[th_key][th_item];                                
                                    }
                                    else if (th_item=='time'){
                                        console.log(theather_obj[th_key][th_item]);
                                        for (var th_time in theather_obj[th_key][th_item])
                                        {
                                            get_theather_time.push(theather_obj[th_key][th_item][th_time]);
                                        }                              
                                    }

                                    for (var k=0;k<get_theather_time.length;k++){
                                        get_theather_time_text = get_theather_time.join("\t");
                                    
                                    }
                                }


                                $("<tr class='theather_default_show'><td><a target='_blank' href='" + get_theather_url + "'><img src='" + get_theather_image + "' /></a></td><td><a target='_blank' href='" + get_theather_url + "'>" + get_theather_name + "</a><hr />" + get_theather_time_text + "</td></tr>").hide().appendTo(yhack_theather_info_table).fadeIn();
                                
                            }

                            $(".yhack_loading_theather").hide();
                        });
                        
                        

                    }
                    else {
                        console.log("not the theather !");
                    }

                    var obj = jQuery.parseJSON(data);
                    console.log(obj);
                    $("#yhack_bar").after("<ul class='tags'></ul>");

                    // add yhack_pages_basic_table
                    var yhack_pages_basic_content = document.createElement('table');
                    $(yhack_pages_basic_content).attr('id','yhack_pages_basic_content');
                    $(yhack_basic_info_section).after(yhack_pages_basic_content);

                    $(".yhack_loading").fadeOut(500);
                                
                    for (var key in obj)
                    {
                        /*
                            load basic information
                        */
                        if (key == 'basic')
                        {
                            for (var item in obj[key])
                            {
                                var get_sep_item = obj[key][item].search('：');

                                var data_label = obj[key][item].substr(0,get_sep_item);
                                var data_value = obj[key][item].substr(get_sep_item+1,obj[key][item].length);

                                var data_value = data_value.replace(/\(\d{1,3}\)/g,", ");
                                console.log(data_value);
        
                                
                                $("<tr><td class='yhack_table_section_label_style'><span class='yhack_table_section_label'>"+ data_label + "</span></td>" + "<td><span class='yhack_table_section_value'>\t\t"+ data_value + "</span></td></tr>").hide().appendTo(yhack_basic_info_section_text).fadeIn();
                                
                            }
                        }
                        /*
                            load comments from Yahoo! Life+
                        */
                        else if (key == 'comments')
                        {
                            for (var comment in obj[key])
                            {
                                var title = "";
                                var href = "";

                                for (var item in obj[key][comment])
                                {                                
                                    if (item == 'href')
                                        href = obj[key][comment][item]
                                    if (item == 'title')
                                        title = obj[key][comment][item]    
                                }

                                $("<div class='phs'><a target='_blank' href='" + href + "'>" + title + "</a></div>").hide().appendTo(yhack_pages_blog_section_text).fadeIn();

                            }

                        }
                        /*
                            load photos from Yahoo! Life+
                        */
                        else if (key == 'photos')
                        {
                            // add yhack_photos_pool
                            var yhack_photos_pool = document.createElement('div');
                            $(yhack_photos_pool).addClass("fbProfilePhotoBar").attr("id","container");
                            $("#yhack_photos_section").after($(yhack_photos_pool));

                            for (var item in obj[key])
                            {
                                link = obj[key][item].replace('//','http://');
                                $("#container").append("<a href='" + link.replace('200x200','450x450') + "' rel='shadowbox' title='" + $(".profileName").text() + "'> <img class='yhack_facebook_img' width='95' height='68' src='" + link + "' /></a>");
                            }

                            // init shadowbox jquery effect
                            Shadowbox.init();
                            
                        }
                        /*
                            load more restaurants from Yahoo! Life+
                        */
                        else if (key == 'more')
                        {
                            for (var type in obj[key])
                            {
                                
                                if (type == 'data_rel')
                                {
                                    for (var inner_rel in obj[key][type])
                                    {
                                        var title = "";
                                        var href = "";

                                        for (var fin_rel in obj[key][type][inner_rel])
                                        {
                                            if (fin_rel == 'href')
                                                href = obj[key][type][inner_rel][fin_rel];
                                            else if (fin_rel == 'title')
                                                title = obj[key][type][inner_rel][fin_rel];
                                        }
                                        $("#yhack_more_ref_section").after("<div class='yhack_sidebar_section phs'><a target='_blank' href='" + href + "'>" + title + "</a></div>");
                                    }
                                }
                                else if (type == 'data_near')
                                {
                                    for (var inner in obj[key][type])
                                    {
                                        var title = "";
                                        var href = "";

                                        for (var fin in obj[key][type][inner])
                                        {
                                            if (fin == 'href')
                                                href = obj[key][type][inner][fin];
                                            else if (fin == 'title')
                                                title = obj[key][type][inner][fin];
                                        }
                                        $("#yhack_more_near_section").after("<div class='yhack_sidebar_section phs'><a target='_blank' href='" + href + "'>" + title + "</a></div>");
                                    }

                                    
                                }
                                
                            }
                        }
                        
                    }
                    
                });
            });
            
        }
        
        //Yahoo Weather
        else if (action=="/events/")
        {

            console.log("[check] facebook /events/ loaded");
            
            var getvalue = ($("#pagelet_event_details").find('a'))[0];
            get_date = (getvalue.toString().match(/[A-Z]\w{3,20}\/\d{1,2}/))[0];
            get_address = $(".fbEventLocationInfo").text();

            var get_lat_lon = $("._8m").children("._6a ").children("._6a._6b").children(".fsm.fwn.fcg").has('a').children().eq(1).attr('href');
            get_lat_lon = get_lat_lon.match(/\d{1,3}\.\d{1,20}_\d{1,3}\.\d{1,20}/)[0]; 
            var get_lat = get_lat_lon.substr(0, get_lat_lon.indexOf('_'));
            var get_lon = get_lat_lon.substr(get_lat_lon.indexOf('_') + 1);

            // console.log(get_date);
            // console.log(get_address);
            // console.log(get_lat);
            // console.log(get_lon);
            $.get(yhack_url_const + "?mode=events&address=" + encodeURI(get_address) + "&date=" + get_date + "&lat=" + get_lat + "&lon=" + get_lon, {}, function(data){
                var obj = jQuery.parseJSON(data);
                //console.log(obj);

                var temp_low = "";
                var temp_high = "";
                var temp_img = "";
                var temp_url = "";

                for (var item in obj)
                {
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
                
                if (temp_img.length > 3)
                {
                    $(".ego_section").children(".uiHeader").before("<div class='uiHeader uiHeaderTopBorder mbs uiSideHeader'>"
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
                }

                             
            });
            

        }

        
        
    });

})();

