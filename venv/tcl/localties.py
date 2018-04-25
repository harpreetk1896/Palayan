import requests
import csv
from bs4 import BeautifulSoup
import urllib3
urllib3.disable_warnings()

city = input("enter the city name (in small letters)")
page = requests.get('https://www.commonfloor.com/%s-city'%city,verify=False)
soup = BeautifulSoup(page.text, 'html.parser')

f = csv.writer(open('locality_names.txt', 'w'))
f.writerow(['Name'])


data = soup.find_all('ul',attrs={'class':'ullinks footer-locality-list'})
for div in data:
    links = div.findAll('a')
    for a in links:
        names = a.contents[0]
        #print(names)#for printing on terminal
        f.writerow([names])#for storing in locality_names.csv file

