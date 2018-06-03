import requests
import simplejson as json
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
