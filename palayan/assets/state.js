"use strict";function setup_state_map(){var map_div=document.getElementById('map-states');if(map_div.offsetParent===null){var elm=map_div.parentElement.parentElement;elm.parentElement.removeChild(elm);return;}
var bubble=document.querySelector('.map-bubble');var proj=null;var bnds=new google.maps.LatLngBounds();var map=(function(){var opts={maxZoom:14,mapTypeId:google.maps.MapTypeId.ROADMAP};var map=new google.maps.Map(map_div,opts);var overlay=new google.maps.OverlayView();overlay.draw=function(){};overlay.onAdd=function(){proj=this.getProjection();};overlay.setMap(map);return map;})();var places=document.getElementById('all-cities').querySelectorAll('a');var circle={path:google.maps.SymbolPath.CIRCLE,fillColor:'#ff0000',fillOpacity:1,scale:5,strokeColor:'#330000',strokeWeight:1,strokeOpacity:1};var tout;var markers=[];var create_marker=function(i){var lat=parseFloat(places[i].getAttribute('data-lat'));var lon=parseFloat(places[i].getAttribute('data-lon'));var ll=new google.maps.LatLng(lat,lon);var m=new google.maps.Marker({position:ll,icon:circle});m.addListener('click',function(){window.location.href=places[i].href;});m.addListener('mouseover',function(){clearTimeout(tout);var ll=proj.fromLatLngToContainerPixel(this.getPosition());bubble.innerHTML=places[i].outerHTML;bubble.style.left=Math.round(map_div.offsetLeft+ll.x-0)+'px';bubble.style.top=Math.round(map_div.offsetTop+ll.y-0-bubble.offsetHeight)+'px';bubble.removeAttribute('data-hide');});m.addListener('mouseout',function(){tout=setTimeout(function(){bubble.setAttribute('data-hide','');},1500);});markers.push(m);bnds.extend(ll);};var m,i=0,l=places.length;for(;i<l;i++){create_marker(i);}
var mrkclust=new MarkerClusterer(map,markers,{imagePath:'/images/m/m'});if(!bnds.isEmpty()){map.fitBounds(bnds);}}
doc_ready(function(){setTimeout(setup_state_map,2000);});