#for storing in residential locality names of a particular city in a file
import requests
import csv
from bs4 import BeautifulSoup
import urllib3
import simplejson as json
urllib3.disable_warnings()
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

city = input("enter the city name (in small letters)")
page = requests.get('https://www.commonfloor.com/%s-city'%city,verify=False)
soup = BeautifulSoup(page.text, 'html.parser')

f =open('locality_names.txt', 'w')

data = soup.find_all('ul',attrs={'class':'ullinks footer-locality-list'})
for div in data:
    links = div.findAll('a')
    for a in links:
        names = a.contents[0]
        f.write(names+'\n')#for storing in locality_names.txt' file
f.close()


#for getting the  latitute and longitude of all the locations in a file
rfile=open("locality_names.txt","r")
wfile=open('loc_latlang.txt','w')

k=0
for line in rfile:
    if (k % 4 == 0): #so as to reduce the number of requests/locations as a limit of 250 requests in news API
        line = line.rstrip()
        page = requests.get("https://maps.googleapis.com/maps/api/geocode/json?address="+line+','+city+",+CA&key=AIzaSyA_pfGSZv6TqYx8FIFXuKha7iWpm0wLsJU")
        file = open("res.json", "w")
        file.write(page.content)
        file.close()
        connection_file = open('res.json', 'r')
        conn_string = json.load(connection_file)
        print conn_string
        if(conn_string['results'] != [] ):
            lat = conn_string['results'][0]['geometry']['location']['lat']
            lang = conn_string['results'][0]['geometry']['location']['lng']
            wfile.write(line+","+str(lat)+","+str(lang)+'\n')
    k=k+1

rfile.close()
wfile.close()


#To generate search urls for all the locations to get results from NEWS API
rfile=open('loc_latlang.txt','r')
wfile=open('url.txt','w')

s1="(Rape OR molestation OR harassment OR (acid AND attack OR victim))"
s2="(Theft OR Pickpocketing OR burglary)"

url1="https://newsapi.org/v2/everything?sources=the-times-of-india,the-hindu,google-news-in&q="
url2="&from=2016-01-01&sortBy=popularity&apiKey=68871acb53824f258e3a7b17a4216333"
k=0
for loc in rfile:
    loc = loc.rstrip()
    line=loc.split(',')
    wfile.write(url1+line[0]+" AND "+city+" AND "+s1+url2+'\n')
    wfile.write(url1+line[0]+" AND "+city+" AND "+s2+url2+'\n')

rfile.close()
wfile.close()

#To get data from API for all the generated urls

#import requests
#import simplejson as json
file2 = open("result.txt", "w")
file=open("url.txt","r")
i=0
for line in file:
   line=line.rstrip()
   response=requests.get(line)
   file = open("res.json", "w")
   file.write(response.content)
   file.close()
   connection_file = open('res.json', 'r')
   conn_string = json.load(connection_file)
   r=conn_string['totalResults']
   i=i+1
   file2.write(str(r)+" ")
   if i==2 :
       file2.write('\n')
       i=0

file2.close()
file.close()


# To scale(1-100) the result and storing it in a different file(lat,long,loc_name,scaled_res) used by html page for display
l1=[]
l2=[]

file = open("result.txt", "r")
fileloc = open("loc_latlang.txt", "r")
for line in file:
    list=line.split()
    l1.append(float(list[0]))
    l2.append(float(list[1]))

mx=max(l1)
mn=min(l1)
l3=[]
for k in l1:
  p=((k-mn)/(mx-mn))*100
  l3.append(p)

mx=max(l2)
mn=min(l2)
l4=[]
for k in l2:
  p=((k-mn)/(mx-mn))*100
  l4.append(p)

file=open("DisplayFiles\LocalDataDisplayFiles\CrimeAgainstWomen.txt","w")
file2=open("DisplayFiles\LocalDataDisplayFiles\Theft.txt","w")
i=0
for line in fileloc:
    file.write(line.rstrip()+","+str(l3[i])+"\n")
    file2.write(line.rstrip()+","+str(l4[i]) + "\n")
    i=i+1

file.close()
file2.close()