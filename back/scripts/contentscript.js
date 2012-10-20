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
        var yhack_pages_ref_text = "同類型餐廳";
        var yhack_pages_near_text = "附近餐廳";
        var yhack_pages_basic_info_text = "基本資料";
        var yhack_pages_blog_text = "食記食評";
        var yhack_pages_photo_text = "相關照片";


        var pathname = window.location.pathname;
        var action = pathname.match(/\/\w{3,10}\//);
        
        
        /*
            when the facebook url equal to [www.facebook.com/pages/*]
        */
        if (action=="/pages/")
        {
            console.log("[check] facebook /pages/ loaded");
            
            // yhack_basic_info_section
            var yhack_basic_info_section = document.createElement('div');

            $(yhack_basic_info_section).addClass("uiHeader")
            .addClass("uiHeaderTopAndBottomBorder")
            .addClass("infoSectionHeader")
            .addClass("uiHeaderSection")
            .attr('id', 'yhack_basic_info_section')
            .css('visible','hidden')
            .append("<h4 tabindex='0' class='uiHeaderTitle'>" + yhack_pages_basic_info_text + "</h4>");


            $("#pagelet_info").before(yhack_basic_info_section);

            // yhack_pages_blog_section
            var yhack_pages_blog_section = document.createElement('div');

            $(yhack_pages_blog_section).addClass("uiHeader")
            .addClass("uiHeaderTopAndBottomBorder")
            .addClass("infoSectionHeader")
            .addClass("uiHeaderSection")
            .attr('id', 'yhack_pages_blog_section')
            .css('visible','hidden')
            .append("<h4 tabindex='0' class='uiHeaderTitle'>" + yhack_pages_blog_text + "</h4>");

            $("#pagelet_info").before(yhack_pages_blog_section);


            $("#yhack_bar").after("<img src='" + moon_url_const + "yhack_loading.gif' />");

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
                .append("\t資料來源 <a target='_blank' href='" + get_url_data + "' >Yahoo! 生活+ (" + $(".profileName").text() + ")</a>");
            
                $(".fbProfileByline").append(yhack_pages_source_text);

                /*
                    basic mode
                */
                $.get(yhack_url_const + "?mode=basic&url=" + get_url_data + "&query=" + encodeURI($(".profileName").text()), {}, function(data){
                    
                    var obj = jQuery.parseJSON(data);
                    console.log(obj);
                    $("#yhack_bar").after("<ul class='tags'></ul>");

                    // add yhack_pages_basic_table
                    var yhack_pages_basic_content = document.createElement('table');
                    $(yhack_pages_basic_content).attr('id','yhack_pages_basic_content');
                    $(yhack_basic_info_section).after(yhack_pages_basic_content);

                                
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
        
                                $(yhack_pages_basic_content).append("<tr><td class='test'><span class='basic_data_label'>"+ data_label + "</span></td>" + "<td><span class='basic_data_value'>\t\t"+ data_value + "</span></td></tr>");


                                
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
                                $(yhack_pages_blog_section).after("<div class='phs'><a target='_blank' href='" + href + "'>" + title + "</a></div>");    
                            }
                        }
                        /*
                            load photos from Yahoo! Life+
                        */
                        else if (key == 'photos')
                        {
                            // add yhack_photos_section
                            var yhack_photos_section = document.createElement('div');
                            $(yhack_photos_section).addClass("uiHeader")
                            .addClass("uiHeaderTopAndBottomBorder")
                            .addClass("infoSectionHeader")
                            .addClass("uiHeaderSection")
                            .attr('id', 'yhack_photo')
                            .css('visible','hidden')
                            .append("<h4 tabindex='0' class='uiHeaderTitle'>" + yhack_pages_photo_text + "</h4>");

                            $("#pagelet_info").before(yhack_photos_section);
                            
                            // add yhack_photos_pool
                            var yhack_photos_pool = document.createElement('div');
                            $(yhack_photos_pool).addClass("fbProfilePhotoBar").attr("id","container");
                            $("#yhack_photo").after($(yhack_photos_pool));

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
                            // add yhack_more_near_section
                            var yhack_more_near_section = document.createElement('div');
                            $(yhack_more_near_section).addClass("uiHeader")
                            .addClass("uiHeaderTopBorder")
                            .addClass("mbs")
                            .addClass("pbs")
                            .addClass("uiSideHeader")
                            .attr("id","yhack_near")
                            .append("<h6 tabindex='0' class='uiHeaderTitle' aria-hidden='true'>" + yhack_pages_near_text + "</h6>");

                            // add yhack_more_ref_section
                            var yhack_more_ref_section = document.createElement('div');
                            $(yhack_more_ref_section).addClass("uiHeader")
                            .addClass("uiHeaderTopBorder")
                            .addClass("mbs")
                            .addClass("pbs")
                            .addClass("uiSideHeader")
                            .attr("id","yhack_ref")
                            .append("<h6 tabindex='0' class='uiHeaderTitle' aria-hidden='true'>" + yhack_pages_ref_text + "</h6>");

                            $("#tips_main_box").before(yhack_more_near_section);
                            $("#tips_main_box").before(yhack_more_ref_section);


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
                                        $("#yhack_ref").after("<div class='fb_sidebar_data_text phs'><a target='_blank' href='" + href + "'>" + title + "</a></div>");
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
                                        $("#yhack_near").after("<div class='fb_sidebar_data_text phs'><a target='_blank' href='" + href + "'>" + title + "</a></div>");
                                    }
                                }
                                
                            }
                        }
                        
                    }
                    
                });
            });
            
        }

        else if (action=="/events/")
        {

            console.log("[check] facebook /events/ loaded");
            
            //

            /*
            var getvalue = ($("#pagelet_event_details").find('a'))[0];
            get_date = (getvalue.toString().match(/[A-Z]\w{3,20}\/\d{1,2}/))[0];
            get_address = $(".fbEventLocationInfo").text();

            console.log(get_date);
            console.log(get_address);
            
            $.get(yhack_url_const + "?mode=events&address=" + encodeURI(get_address) + "&date=" + get_date, {}, function(data){
                var obj = jQuery.parseJSON(data);
                //console.log(obj);

                var temp_low = "";
                var temp_high = "";
                var temp_img = "";

                for (var item in obj)
                {
                    if (item == 'temp_low')
                        temp_low = obj[item];
                    else if (item == 'temp_high')
                        temp_high = obj[item];
                    else if (item == 'img')
                        temp_img = obj[item];

                }

                console.log(temp_low);
                console.log(temp_high);
                console.log(temp_img);
                            
                $("#contentArea").append("氣溫:" + temp_low + " ~ " + temp_high + "<img width='64' height='64' src='" + temp_img + "' />");
            });

            */


            var get_all = $(".fbPlaceFlyoutEllipsis").text();
            var get_address = $(".fbPlaceFlyoutEllipsis").find('a').text();
            //var sub_address = get_all.replace(get_address,'').toString();
            
            var getvalue = ($("#pagelet_event_details").find('a'))[0];
            get_date = (getvalue.toString().match(/[A-Z]\w{3,20}\/\d{1,2}/))[0];

            
            $.get(yhack_url_const + "?mode=events&address=" + encodeURI(get_address).replace('%20','') + "&date=" + get_date, {}, function(data){
                console.log(data);
            });
            
            

        }

        
        
    });

})();

