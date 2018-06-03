#getting data through web scraping of major cities
import requests
file=open("Major_cities.txt","r")
l1=[]
for line in file:
    line=line.rstrip()
    page=requests.get("https://www.numbeo.com/crime/in/"+line)
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(page.content, 'html.parser')
    for el in soup.find_all(class_="table_indices"):
      k=el

    var = list(k.children)[3]
    var2 = list(var.children)[2]
    val= var2.get_text()
    val=val.lstrip()
    print (line+" "+val)
    l1.append(float(val))

file.close()

#Scaling the results
mx=max(l1)
mn=min(l1)
l3=[]
for k in l1:
  p=((k-mn)/(mx-mn))*100
  l3.append(p)

rfile = open("long_lat_cities.txt", "r")
wfile= open("DisplayFiles/CrimeRate.txt",'w')
i=0
for line in rfile:
    line=line.rstrip()
    wfile.write(line+","+str(l3[i])+"\n")
    i=i+1

rfile.close()
wfile.close()