
function ami_midclass(){var cont,i_elm=[];var mmm=[];var calc_pos=function(min,med,max,mhi){var p,m;if(med==mhi)return 50;if(med<mhi){m=50/((max-med)/med);p=(mhi-med)/med*m;p=Math.min(52,p);}
else{m=50/((min-med)/med);p=(mhi-med)/med*Math.abs(m);p=Math.max(-52,p);}
return p+50;};var is_outside=function(pct){return!(pct>=0&&pct<=100);};var logit=function(){var params={which:'ami',param1:null,param2:null,param3:null};$.ajax({type:'post',dataType:'json',url:'/ax_logger/',data:params});};var price_changed=function(mhi){for(var i=0;i<3;i++){var pos=calc_pos(mmm[i][0],mmm[i][1],mmm[i][2],mhi);i_elm[i][3].innerText='$'+commas(mhi);i_elm[i][3].style.left=pos+'%';i_elm[i][3].style.color=is_outside(pos)?'#f00':'';}};(function init(cont){if(cont){var inp=document.querySelector('.ami-midclass-form input[name="compare-mhi"]');if(inp){document.querySelector('.ami-midclass-form').addEventListener('submit',function(evt){evt.preventDefault();});i_elm=[cont.querySelectorAll('.ami-graph:nth-of-type(1) i'),cont.querySelectorAll('.ami-graph:nth-of-type(2) i'),cont.querySelectorAll('.ami-graph:nth-of-type(3) i')];mmm=[[i_elm[0][0].innerText,i_elm[0][1].innerText,i_elm[0][2].innerText],[i_elm[1][0].innerText,i_elm[1][1].innerText,i_elm[1][2].innerText],[i_elm[2][0].innerText,i_elm[2][1].innerText,i_elm[2][2].innerText]];var num=function(el){return parseInt(el.replace(/\D/g,''),10);};for(var i=0;i<mmm.length;i++)mmm[i]=mmm[i].map(num);inp.addEventListener('input',function(evt){price_changed(parseInt(evt.target.value,10));if(logit){logit();logit=undefined;}});price_changed(parseInt(inp.value,10));}}})(document.querySelector('.ami-midclass'));}