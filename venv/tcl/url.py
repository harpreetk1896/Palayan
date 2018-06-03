
rfile=open('loc_latlang.txt','r')
wfile=open('url.txt','w')

city="Delhi"
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