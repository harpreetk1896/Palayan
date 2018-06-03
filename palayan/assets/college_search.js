"use strict";function school_map(schools){var map_div=document.querySelector('.rv-map');var tout=0,bubble=document.querySelector('.rv-bubble');var ICOMUL=.9;var create_marker=function(i,icon){var lat=parseFloat(schools[i].getAttribute('data-lat'));var lon=parseFloat(schools[i].getAttribute('data-lon'));var ll=new google.maps.LatLng(lat,lon);var m=null,x=450*ICOMUL,y=350*ICOMUL;{y=Math.floor(Math.floor((i)/10)*70*ICOMUL);x=Math.floor(((i)%10)*50*ICOMUL);}
icon.origin=new google.maps.Point(x,y);icon.ya=y;icon.yb=y+420*ICOMUL;m=new google.maps.Marker({map:map,zIndex:(i?908:909),position:ll,icon:icon});m.addListener('click',function(){window.location.href=schools[i].getAttribute('href');});m.addListener('mouseover',function(){clearTimeout(tout);var ll=map.proj.fromLatLngToContainerPixel(this.getPosition());var p=schools[i];var out='<a href="%s">%s</a><br>Sat range: <b>%s</b>';out=out.spf(p.getAttribute('href'),p.querySelector('strong').textContent,p.querySelector('.cll-scr').textContent);bubble.innerHTML=out;bubble.style.left=Math.round(map_div.offsetLeft+ll.x+11)+'px';bubble.style.top=Math.round(map_div.offsetTop+ll.y-22-bubble.offsetHeight)+'px';bubble.removeAttribute('data-hide');});m.addListener('mouseout',function(){tout=setTimeout(function(){bubble.setAttribute('data-hide','');},3500);});return m;};var map,bnds;var init_map=function(){map=new google.maps.Map(map_div,{zoom:14,mapTypeId:google.maps.MapTypeId.ROADMAP,scaleControl:false,zoomControl:true,scrollwheel:true,streetViewControl:true,mapTypeControl:false});bnds=new google.maps.LatLngBounds();var overlay=new google.maps.OverlayView();overlay.draw=function(){};overlay.onAdd=function(){map.proj=this.getProjection();};overlay.setMap(map);};var mico={url:'/images/pins-num-sprite.png',size:new google.maps.Size(30*ICOMUL,40*ICOMUL),scaledSize:new google.maps.Size(480*ICOMUL,810*ICOMUL),origin:null};var update_map=function(){google.maps.event.addListenerOnce(map,'idle',function(){var i,m,l;for(i=0,l=schools.length;i<l;i++){if(schools[i].getAttribute('href')){m=create_marker(i,mico);bnds.extend(m.getPosition());schools[i].mrkr=m;}}
if(!bnds.isEmpty()){map.fitBounds(bnds);if(map.getZoom()>14){map.setZoom(14);}}
else{map.setCenter({lat:parseFloat(map_div.getAttribute('data-lat')),lng:parseFloat(map_div.getAttribute('data-lon'))});map.setZoom(8);}});};return{is_init:function(){return!!map;},is_visible:function(){return!(map_div.offsetParent===null);},refresh:function(){if(!bnds.isEmpty()){map.fitBounds(bnds);}},init:init_map,update:update_map,map:function(){return map;}};}
function filters_menu_activate(){var active_menu=null;var activate=function(evt){var menu=evt.currentTarget.parentElement;if(active_menu&&active_menu===menu){active_menu.setAttribute('data-reveal','');active_menu=null;}
else if(active_menu&&active_menu!==menu){active_menu.setAttribute('data-reveal','');active_menu=menu;active_menu.setAttribute('data-reveal','1');}
else{active_menu=menu;active_menu.setAttribute('data-reveal','1');}};var opts=document.querySelectorAll('form.rv-filter .fltr-item-brief');for(var i=0,l=opts.length;i<l;i++){opts[i].addEventListener('click',activate);}}
function filters_panel_cll_srt(update_obs){var pan=document.querySelector('.fltr-item.cll-srt');var out_pri=pan.querySelector('.fltr-item-brief span:nth-child(2)');var inc_text=function(v){switch(v){case'n':return'School name';case'a':return'Admissions rate';case's':default:return'SAT Range';}};pan.addEventListener('change',function(evt){out_pri.textContent=inc_text(evt.target.value);update_obs({'cll-srt':{'opt-srt':evt.target.value}});});return{init:function(values){var tgt=pan.querySelector('input[name=opt-srt][value='+values['opt-srt']+']');tgt.checked=true;out_pri.textContent=inc_text(values['opt-srt']);}};}
function filters_panel_cll_typ(update_obs){var pan=document.querySelector('.fltr-item.cll-typ');var out_pri=pan.querySelector('.fltr-item-brief span:nth-child(2)');var ctrls=[pan.querySelector('input[name=opt-typ-public]'),pan.querySelector('input[name=opt-typ-pri-np]'),pan.querySelector('input[name=opt-typ-pri-fp]')];var inc_text=function(){var out=[];if(ctrls[0].checked||ctrls[1].checked||ctrls[2].checked)out.push('Custom');if(!out.length)out.push('Any type');return out.join(', ');};pan.addEventListener('change',function(evt){out_pri.textContent=inc_text();var opt={};opt[evt.target.name]=~~evt.target.checked;update_obs({'cll-typ':opt});});return{init:function(values){ctrls[0].checked=values['opt-typ-public'];ctrls[1].checked=values['opt-typ-pri-np'];ctrls[2].checked=values['opt-typ-pri-fp'];out_pri.textContent=inc_text();}};}
function filters_panel_cll_sat(update_obs){var pan=document.querySelector('.fltr-item.cll-sat');var out_pri=pan.querySelector('.fltr-item-brief span:nth-child(2)');var steps=[0,100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600];pan.addEventListener('input',function(evt){var s=steps[evt.target.value];evt.target.previousSibling.textContent=s;});pan.addEventListener('change',function(evt){var s=steps[evt.target.value];evt.target.previousSibling.textContent=s;out_pri.textContent=s;update_obs({'cll-sat':{'opt-scr':~~evt.target.value}});});return{init:function(values){var tgt=pan.querySelector('input[name=opt-scr]');var s=steps[values['opt-scr']];tgt.previousSibling.textContent=s;tgt.value=values['opt-scr'];out_pri.textContent=s;}};}
function filters_panel_setup(){var opts=JSON.parse(cookie(window.college_search_cname));var update_obs=function(opt){var pri_key=Object.keys(opt)[0];for(var sub_key in opt[pri_key]){opts[pri_key][sub_key]=opt[pri_key][sub_key];}
cookie(window.college_search_cname,JSON.stringify(opts),{'path':'/','expires':365});var uri=window.g_paths.city.enc()+'/colleges/';window.location.href=uri;};filters_panel_cll_srt(update_obs).init(opts['cll-srt']);filters_panel_cll_typ(update_obs).init(opts['cll-typ']);filters_panel_cll_sat(update_obs).init(opts['cll-sat']);}
function next_prev_setup(){var next_btn=document.querySelector('.next-prev-nav.next');var prev_btn=document.querySelector('.next-prev-nav.prev');var fnc=function(evt){var ndx=evt.target.getAttribute('data-ndx');var uri=window.g_paths.city.enc()+'/colleges/';if(ndx>1){uri+='pg:'+ndx+'/';}
window.location.href=uri;}
if(next_btn){next_btn.addEventListener('click',fnc);}
if(prev_btn){prev_btn.addEventListener('click',fnc);}}
function vh_fix(force){var bd=document.querySelector('body');var wh=window.innerHeight;var bh=bd.offsetHeight;var fix=function(evt){bd.style.height=window.innerHeight+'px';bd.style.width=window.innerWidth+'px';};if(force){fix();}
if(wh!==bh){}
var is_mobile_safari_7=!!navigator.userAgent.match(/i(Pad|Phone|Pod).+(Version\/7\.\d+ Mobile)/i);if(is_mobile_safari_7){window.addEventListener('orientationchange',fix,true);fix();}};function update_zw_school_btns(schools){var i,l,a,u;for(i=0,l=schools.length;i<l;i++){a=schools[i].nextElementSibling.firstElementChild;if(a){u=schools[i].getAttribute('data-zip');u=r47_paths.re_search.r47()+u.enc()+'/';u+='?cid=prt_areavibes_results';a.setAttribute('href',u);a.setAttribute('target','_blankaff');a.addEventListener('click',function(evt){zw_out_log('res');});}}}
doc_ready(function(){vh_fix();filters_menu_activate();filters_panel_setup();next_prev_setup();var schools=document.querySelectorAll('.tile-listings .rv-list > a');var smap=school_map(schools);update_zw_school_btns(schools);if(smap.is_visible()){smap.init();smap.update();}
var sm_resize=function(){if(!smap.is_init()&&smap.is_visible()){smap.init();smap.update();}
else if(smap.is_init()&&smap.is_visible()){smap.refresh();}};window.addEventListener('resize',debounce(sm_resize,750));var upd_icon=function(mrkr,state){if(mrkr){var ico=mrkr.getIcon();ico.origin.y=(state?ico.yb:ico.ya);mrkr.setZIndex(mrkr.getZIndex()+(state?2:-2));}};for(var i=0,l=schools.length;i<l;i++){schools[i].addEventListener('mouseenter',function(evt){if(evt.target.nodeName.toLowerCase()=='a'){upd_icon(evt.target.mrkr,1);}
evt.preventDefault();});schools[i].addEventListener('mouseleave',function(evt){if(evt.target.nodeName.toLowerCase()=='a'){upd_icon(evt.target.mrkr,0);}
evt.preventDefault();});}});