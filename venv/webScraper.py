import requests
from bs4 import BeautifulSoup
file=open("C:\Users\hp\PycharmProjects\Palayan\Files\Major_cities.txt","r")
file2 = open("Traffic.txt", "w")
for line in file:
    line=line.rstrip()
    page=requests.get("https://www.numbeo.com/traffic/in/"+line)
    soup = BeautifulSoup(page.content, 'html.parser')
    for el in soup.find_all(class_="table_indices"):
     k=el
    var = list(k.children)[3]
    var2 = list(var.children)[2]
    val= var2.get_text()
    val=val.lstrip()
    file2.write(line+" "+val+"\n")
file2.close()