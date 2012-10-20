# -*- coding:utf-8 -*-

import json, urllib2
from LatLonToTWD97 import LatLonToTWD97
outputList = []
#from math import tan, sin, cos, radians
#
#class LatLonToTWD97(object):
#    """This object provide method for converting lat/lon coordinate to TWD97
#    coordinate
#
#    the formula reference to
#    http://www.uwgb.edu/dutchs/UsefulData/UTMFormulas.htm (there is lots of typo)
#    http://www.offshorediver.com/software/utm/Converting UTM to Latitude and Longitude.doc
#
#    Parameters reference to
#
#http://rskl.geog.ntu.edu.tw/team/gis/doc/ArcGIS/WGS84%20and%20TM2.htm
#
#
#http://blog.minstrel.idv.tw/2004/06/taiwan-datum-parameter.html
#
#    """
#
#    def __init__(self,
#        a = 6378137.0,
#        b = 6356752.314245,
#        long0 = radians(121),
#        k0 = 0.9999,
#        dx = 250000,
#    ):
#        # Equatorial radius
#        self.a = a
#        # Polar radius
#        self.b = b
#        # central meridian of zone
#        self.long0 = long0
#        # scale along long0
#        self.k0 = k0
#        # delta x in meter
#        self.dx = dx
#
#    def convert(self, lat, lon):
#        """Convert lat lon to twd97
#
#        """
#        a = self.a
#        b = self.b
#        long0 = self.long0
#        k0 = self.k0
#        dx = self.dx
#
#        e = (1-b**2/a**2)**0.5
#        e2 = e**2/(1-e**2)
#        n = (a-b)/(a+b)
#        nu = a/(1-(e**2)*(sin(lat)**2))**0.5
#        p = lon-long0
#
#        A = a*(1 - n + (5/4.0)*(n**2 - n**3) + (81/64.0)*(n**4  - n**5))
#        B = (3*a*n/2.0)*(1 - n + (7/8.0)*(n**2 - n**3) + (55/64.0)*(n**4 - n**5))
#        C = (15*a*(n**2)/16.0)*(1 - n + (3/4.0)*(n**2 - n**3))
#        D = (35*a*(n**3)/48.0)*(1 - n + (11/16.0)*(n**2 - n**3))
#        E = (315*a*(n**4)/51.0)*(1 - n)
#
#        S = A*lat - B*sin(2*lat) + C*sin(4*lat) - D*sin(6*lat) + E*sin(8*lat)
#
#        K1 = S*k0
#        K2 = k0*nu*sin(2*lat)/4.0
#        K3 = (k0*nu*sin(lat)*(cos(lat)**3)/24.0) * (5 - tan(lat)**2 + 9*e2*(cos(lat)**2) + 4*(e2**2)*(cos(lat)**4))
#
#        y = K1 + K2*(p**2) + K3*(p**4)
#
#        K4 = k0*nu*cos(lat)
#        K5 = (k0*nu*(cos(lat)**3)/6.0) * (1 - tan(lat)**2 + e2*(cos(lat)**2))
#
#        x = K4*p + K5*(p**3) + self.dx
#        return x, y
if __name__ == '__main__':
    from math import degrees, sqrt, radians
    readInfo = open('parks.txt', 'r')
    parkList = json.load(readInfo)
    c = LatLonToTWD97()
    lat = radians(float('25.057569767389'))
    lon = radians(float('121.61455287873'))
    print 'input lat/lon', degrees(lat), degrees(lon)
    x, y = c.convert(lat, lon)
    print (x, y)

    parkList.sort(key = lambda x :sqrt((lat - float(x['tw97x'])) ** 2 + (lon - float(x['tw97y'])) ** 2 ))

    print parkList[0:4]
    
    #for i in range(1, 166):
    #    parkId = repr('%03d' % i)
    #    parkData = json.load(urllib2.urlopen('http://www.api.cloud.taipei.gov.tw/CSCP_API/trf/pli/rows/' + parkId))
    #    outputList.extend(parkData)
    #writeInfo = open('parks.txt', 'w')
    #writeInfo.write(json.dumps(outputList))
    #writeInfo.close()