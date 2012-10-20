#!/usr/bin/env python
# -*- coding: utf-8 -*-

#
# Yahoo Open Hack Day 2012
# author: bryanyuan2, blackcan, jason2506
# last modify: 20121008
#

import webapp2

from google.appengine.api import users
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import urllib
import urllib2
import sys
import json
import re
from HTMLParser import HTMLParser
from BeautifulSoup import BeautifulSoup
from LatLonToTWD97 import LatLonToTWD97
from math import sqrt, radians

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

class MainPage(webapp2.RequestHandler):

    #
    # remove_tags
    #
    def remove_tags(self,html):
        s = MLStripper()
        s.feed(html)
        return s.get_data()

    #
    # remove_tab_space
    #
    def remove_tab_space(self,text):
        return text.replace('\t','').replace('\n','')

    #
    # [pages] search_the_most_releated
    #
    def search_the_most_releated(self,query,yhack_yahoo_life_const_url):
        query = query.decode('utf-8', 'ignore')
        query = '%20'.join(query)
        query = query.encode('utf-8', 'ignore')
        search_url = "http://tw.ipeen.lifestyle.yahoo.net/search/?kw=" + str(query) + "&adkw="
        print search_url
        html = urllib2.urlopen(search_url).read()
        if html.find('to="c" code="4"') > -1:
            search_url = "http://tw.ipeen.lifestyle.yahoo.net/search/?kw=" + str(query) + "&c=4"
            html = urllib2.urlopen(search_url).read() 
        soup = BeautifulSoup(html)
        get_first_data = soup.find('div', attrs={'class': 'serData'}).find('h2').find('a')
        get_search_href = yhack_yahoo_life_const_url + str(get_first_data['href'])
        return get_search_href

    #
    # [pages] yhack_pages_get_photos
    #
    def yhack_pages_get_photos(self,url):
        url = url.replace('/shop/','/shop/photos/');
        html = urllib2.urlopen(url).read()
        soup = BeautifulSoup(html)
        get_photos_img = soup.findAll('a', attrs={'rel': 'shop_photos_share'});
        photos_data = {}
        for key in range(0,len(get_photos_img)): 
            #print get_photos_img[key].find('img')['src'];
            photos_data['photo_'+str(key)] = get_photos_img[key].find('img')['src'];
        return photos_data;
        
    #
    # [pages] yhack_pages_get_comments
    #
    def yhack_pages_get_comments(self,soup,yhack_yahoo_life_const_url):
        title_set = soup.findAll('h2', attrs={'class': 'absTitle'})
        data_list = {}

        for i in range(0,len(title_set)): 
            data_item = {}
            get_href = yhack_yahoo_life_const_url + str(title_set[i].find('a')['href'])
            get_title = str(title_set[i].find('a').contents[0]) 
            #print get_href
            #print get_title
            data_item['href'] = get_href
            data_item['title'] = get_title
            data_list["comments_"+str(i)] = data_item
        return data_list    

    #
    # [pages] yhack_pages_get_basic_information
    #
    def yhack_pages_get_basic_information(self,soup):
        shop_info = soup.find('table', attrs={'class': 'binfo'})
        get_shop_info = shop_info.findAll('td')
        
        data_list = {}

        for i in range (0,len(get_shop_info)):
            row = self.remove_tab_space(self.remove_tags(str(get_shop_info[i].find('div', attrs={'class': 'itm'}))))
            data_list["basic_"+str(i)] = row
        return data_list
    #
    # [pages] yhack_pages_get_parks
    #
    def yhack_pages_get_parks(self, park_list, lat, lon):
        readParkText = open(park_list, 'r')
        parkList = json.loads(readParkText.read())
        latlonTransfer = LatLonToTWD97()
        latWGS = radians(float(lat))
        lonWGS = radians(float(lon))
        latTWD, lonTWD = latlonTransfer.convert(latWGS, lonWGS)

        parkList = filter(lambda x:sqrt((latTWD - float(x['tw97x'])) ** 2.0 + (lonTWD - float(x['tw97y'])) ** 2.0 ) < 3000.0, parkList)
        parkList.sort(key = lambda x :sqrt((latTWD - float(x['tw97x'])) ** 2 + (lonTWD - float(x['tw97y'])) ** 2 ))
        
        if len(parkList) > 4:
            return parkList[0:4]
        else:
            return parkList


    #
    # [pages] yhack_pages_get_more_shops
    #
    def yhack_pages_get_more_shops(self,soup,yhack_yahoo_life_const_url):
        
        data_all = {}
        data_rel = {}
        data_near = {}

        shop_rel = soup.findAll('div', attrs={'class': 'sblock rec'})
        
        for i in range (0,len(shop_rel)):
            if (i == 0):
                get_names = shop_rel[i].findAll('div', attrs={'class': 'name'});
                for j in range (0,len(get_names)):
                    list_near = {};
                    list_near["title"] = get_names[j].find('a').contents[0];
                    list_near["href"] = yhack_yahoo_life_const_url + str(get_names[j].find('a')['href']);
                    data_near["near_" + str(j)] = list_near;
            
            if (i == 1):
                get_names = shop_rel[i].findAll('div', attrs={'class': 'name'})
                for j in range (0,len(get_names)):
                    list_rel = {};
                    list_rel["title"] = get_names[j].find('a').contents[0]
                    list_rel["href"] = yhack_yahoo_life_const_url + str(get_names[j].find('a')['href']);
                    data_rel["rel_" + str(j)] = list_rel;
            
        data_all['data_rel'] = data_rel;
        data_all['data_near'] = data_near;
        
        return data_all;
        

    #
    # [events] [weather] yhack_events_get_lat_lon
    #
    def yhack_events_get_lat_lon(self,address):
        geocoder_api_url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&sensor=false'
        geocoder_api_json = urllib2.urlopen(geocoder_api_url).read()
        
        json_data = json.loads(geocoder_api_json)
        
        if (json_data['results']):
            lat = json_data['results'][0]['geometry']['location']['lat']
            lon = json_data['results'][0]['geometry']['location']['lng']
            return [lat, lon]
        else:
            return False

    #
    # [events] [weather] yhack_events_get_woeid
    #
    def yhack_events_get_woeid(self,yhack_yahoo_app_id,define_lat,define_lon):
        location = str(define_lon) + "," + str(define_lat)
        
        woeid_api_url = "http://where.yahooapis.com/geocode?location=" + str(location) + "&flags=J&gflags=R&appid=" + str(yhack_yahoo_app_id)
        woeid_api_json = urllib2.urlopen(woeid_api_url).read()
        json_data = json.loads(woeid_api_json)
        get_woeid = json_data['ResultSet']['Results'][0]['woeid']
        return get_woeid

    #
    # [events] [weather] yhack_events_get_yahoo_weather
    #
    def yhack_events_get_yahoo_weather(self,woeid,date):
        weather_url = "http://weather.yahooapis.com/forecastrss?w=" + str(woeid) + '&u=c'
        weather_data = urllib2.urlopen(weather_url).read()
        weather_data_page_id = weather_data[weather_data.find('forecast/') + 9 : weather_data.find('_c.html</link>')] 
        weather_url = "http://www.weather.com/weather/tenday/" + weather_data_page_id
        weather_data = urllib2.urlopen(weather_url).read()
        data_parser = BeautifulSoup(weather_data)
        return_dic = {}
        if date == '': 
            datepart = data_parser.find('div', 'wx-daypart')
            return_dic['img'] = datepart.div.img.get('src')
            temp_high = datepart.div.find('p', 'wx-temp').text
            return_dic['temp_high'] = int(round((float(temp_high[:temp_high.find('&')]) - 32.0) * 5 / 9)) 
            temp_low = datepart.div.find('p', 'wx-temp-alt').text
            return_dic['temp_low'] = int(round((float(temp_low[:temp_low.find('&')]) - 32.0) * 5 / 9))
            return_dic['url'] = 'http://weather.yahoo.com/forecast/' + weather_data_page_id + '.html'
        else:
            dateFound = False
            date = date[0:3] + ' ' + date[date.find('/') + 1:]
            for datepart in data_parser.findAll('div', 'wx-daypart'):
                if datepart.h3.span.string == date:
                    return_dic['img'] = datepart.div.img.get('src')
                    temp_high = datepart.div.find('p', 'wx-temp').text
                    return_dic['temp_high'] = int(round((float(temp_high[:temp_high.find('&')]) - 32.0) * 5 / 9)) 
                    temp_low = datepart.div.find('p', 'wx-temp-alt').text
                    return_dic['temp_low'] = int(round((float(temp_low[:temp_low.find('&')]) - 32.0) * 5 / 9))
                    return_dic['url'] = 'http://weather.yahoo.com/forecast/' + weather_data_page_id + '.html'
                    dateFound = True
                    break
            if not dateFound:
                return_dic = 'date_not_found'
        return return_dic

    #
    # [pages] yhack_pages_get_yhack_movies
    #
    def yhack_pages_get_yhack_movies(self,theater_list,define_theater_name):
        
        if (define_theater_name==''):
            define_theater_name = u"信義威秀影城"

        define_theater_name = define_theater_name.decode('utf-8')

        readResult = open(theater_list, 'r')
        theater_list = json.loads(readResult.read())
        #print jsonResult[0][0]
        theater_info_url = ''
        movie_list_output = {}
        for i in range(len(theater_list)):
            theater_list[i].append(0)
            for ch in define_theater_name:
                if ch in theater_list[i][0]:
                    theater_list[i][-1] += 1
        
        theater_list.sort(key = lambda theater : theater[-1], reverse = True)

        theater_info_url = theater_list[0][2]       

        if theater_info_url:
            theater_info_page = urllib2.urlopen(theater_info_url).read()
            theater_parser = BeautifulSoup(theater_info_page)
            movie_div_list = theater_parser.find('div', id = 'ymvttr').findAll('div', 'item clearfix')
            for i in range(0,len(movie_div_list)):
                movie_list_item = {}
                movie_name = movie_div_list[i].find('h4').find('a').contents[0]
                movie_img = movie_div_list[i].find('img')['src']
                movie_url = movie_div_list[i].find('h4').find('a')['href']
                
                movie_times = {}
                
                get_time_list = movie_div_list[i].findAll('span', 'tmt')
                
                for j in range(0,len(get_time_list)):
                    movie_times[str(j)] = get_time_list[j].contents[0]
                
                """
                self.response.write(movie_name)
                self.response.write("\n")
                self.response.write(movie_img)
                self.response.write("\n")
                self.response.write(movie_url)
                self.response.write("\n")
                self.response.write(movie_times)
                self.response.write("\n")
                """
                
                movie_list_item['time'] = movie_times
                movie_list_item['name'] = movie_name
                movie_list_item['url'] = movie_url
                movie_list_item['img'] = movie_img
                movie_list_output["movie_"+str(i)] = movie_list_item
                
        return movie_list_output
        
    #
    # [main] get 
    #
    def get(self):
        
        print 'Content-Type: text/plain'
        
        # const data
        yhack_yahoo_life_const_url = "http://tw.ipeen.lifestyle.yahoo.net"
        yhack_yahoo_app_id = "9AZ8FWjV34EVwK86ODdtBih4E01nLm4927JH88O_t2qirXMjus36eFqw6Y7ZYyMAiFXand2cOppgISU-"
        yhack_gae_theater_list = "theater_list.txt"
        yhack_gae_park_list = "parks.txt"

        # general
        mode = urllib.unquote(self.request.get('mode')).encode('utf8')
        query = urllib.unquote(self.request.get('query')).encode('utf8')
        url = urllib.unquote(self.request.get('url')).encode('utf8')
        storelat = urllib.unquote(self.request.get('storelat')).encode('utf8')
        storelon = urllib.unquote(self.request.get('storelon')).encode('utf8')
        # weather
        address = urllib.unquote(self.request.get('address')).encode('utf8')
        date = urllib.unquote(self.request.get('date')).encode('utf8')
        lat = urllib.unquote(self.request.get('lat')).encode('utf8')
        lon = urllib.unquote(self.request.get('lon')).encode('utf8')
        
        # theather
        theather_name = urllib.unquote(self.request.get('theather_name')).encode('utf8')

        search_the_most_releated_data = ""

        if (mode == "search"):

            search_the_most_releated_data = self.search_the_most_releated(query,yhack_yahoo_life_const_url)
            self.response.write(search_the_most_releated_data);
        
        if (mode == "basic"):
            
            container = {} 
            html = urllib2.urlopen(url).read()
            soup = BeautifulSoup(html)

            get_basic = self.yhack_pages_get_basic_information(soup)
            get_comments = self.yhack_pages_get_comments(soup,yhack_yahoo_life_const_url)
            get_more = self.yhack_pages_get_more_shops(soup,yhack_yahoo_life_const_url)
            get_photo = self.yhack_pages_get_photos(url)
            get_park = self.yhack_pages_get_parks(yhack_gae_park_list, storelat, storelon)

            container['basic'] = get_basic
            container['comments'] = get_comments
            container['more'] = get_more
            container['photos'] = get_photo
            container['park'] = get_park
            
            self.response.write(json.dumps(container));
            
            
        if (mode == "events"):
            
            #define_address = "台北"
            #define_date = "October/9"

            define_address = address
            define_date = date
            define_lat = lat
            define_lon = lon
            
            lat_lon_list = []
            if (define_lat):
                lat_lon_list = [define_lat, define_lon]
            else:
                lat_lon_list = self.yhack_events_get_lat_lon(define_address)
            if (lat_lon_list):
                woeid = self.yhack_events_get_woeid(yhack_yahoo_app_id,lat_lon_list[0], lat_lon_list[1])
                get_weather_final = self.yhack_events_get_yahoo_weather(woeid, define_date)
                self.response.write(json.dumps(get_weather_final));
            else:
                self.response.write("{}");

        if (mode == "theather"):

            self.response.write(json.dumps(self.yhack_pages_get_yhack_movies(yhack_gae_theater_list,theather_name)));


application = webapp2.WSGIApplication(
    [('/yhack/yhack.php', MainPage)],
    debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()
