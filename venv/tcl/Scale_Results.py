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

file=open("CrimeAgainstWomen.txt","w")
file2=open("Theft.txt","w")
i=0
for line in fileloc:
    file.write(line.rstrip()+","+str(l3[i])+"\n")
    file2.write(line.rstrip()+","+str(l4[i]) + "\n")
    i=i+1

file.close()
file2.close()