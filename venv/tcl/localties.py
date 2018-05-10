import requests
import csv
from bs4 import BeautifulSoup
import urllib3
import simplejson as json
urllib3.disable_warnings()
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

"""city = input("enter the city name (in small letters)")
page = requests.get('https://www.commonfloor.com/%s-city'%city,verify=False)
soup = BeautifulSoup(page.text, 'html.parser')

f =open('locality_names.txt', 'w')

data = soup.find_all('ul',attrs={'class':'ullinks footer-locality-list'})
for div in data:
    links = div.findAll('a')
    for a in links:
        names = a.contents[0]
        #print(names)#for printing on terminal
        f.write(names+'\n')#for storing in locality_names.txt' file
f.close()"""

rfile=open("locality_names.txt","r")
wfile=open('loc_latlang.txt','w')


for line in rfile:
    line = line.rstrip()
    page = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address="+line+",+CA&key=AIzaSyA_pfGSZv6TqYx8FIFXuKha7iWpm0wLsJU")
    file = open("res.json", "w")
    file.write(page.content)
    file.close()
    connection_file = open('res.json', 'r')
    conn_string = json.load(connection_file)
    print conn_string['results'][0]
    lat = conn_string['results'][0]['geometry']['location']['lat']
    lang = conn_string['results'][0]['geometry']['location']['lat']
    wfile.write(line+" "+str(lat)+" "+str(lang)+'\n')


rfile.close()
wfile.close()
