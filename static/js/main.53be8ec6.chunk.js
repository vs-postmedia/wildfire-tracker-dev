(this["webpackJsonpbc-wildfire-tracker"]=this["webpackJsonpbc-wildfire-tracker"]||[]).push([[0],{20:function(e,t,a){e.exports=a(55)},42:function(e,t,a){},43:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){},46:function(e,t,a){},47:function(e,t,a){},48:function(e,t,a){e.exports=a.p+"static/media/BentonSansCond-Regular.43cd4ac7.otf"},49:function(e,t,a){e.exports=a.p+"static/media/BentonSansCond-RegItalic.69a4217c.otf"},50:function(e,t,a){e.exports=a.p+"static/media/BentonSansCond-Bold.6f6753fd.otf"},51:function(e,t,a){e.exports=a.p+"static/media/BentonSansCond-BoldItalic.a6640d89.otf"},52:function(e,t,a){e.exports=a.p+"static/media/Shift-Bold.cdd38a86.otf"},53:function(e,t,a){e.exports=a.p+"static/media/Shift-BoldItalic.5c3edbfd.otf"},54:function(e,t,a){},55:function(e,t,a){"use strict";a.r(t);var o=a(0),r=a.n(o),n=a(19),s=a.n(n),i=a(9),l=a(2),c=a(3),p=a(5),u=a(4),d=a(7),f=a.n(d),m=a(6),h=a(8),g=a.n(h);a(42);var v=function(e){return"\n\t\t<div>\n\t\t\t<h3>".concat(e.GEOGRAPHIC,'</h3>\n\t\t\t<p class="status ').concat(e.FIRE_STATU.toLowerCase().replace(/\s/g,"-"),'">Status: ').concat(e.FIRE_STATU,"</p>\n\t\t\t<p>A fire of ").concat(function(e){var t=(e.CURRENT_SI/100).toFixed(2);return t<.01?"less than 0.01":t}(e)," square kilometres started on ").concat(e.ignition_date,".</p>\n\n\t\t\t<p>Suspected cause: ").concat(""===(t=e.FIRE_CAUSE)?"unknown":t.toLowerCase(),"</p>\n\t\t</div>\n\t");var t},y=(a(43),function(e){Object(p.a)(a,e);var t=Object(u.a)(a);function a(e){var o;return Object(l.a)(this,a),(o=t.call(this,e)).state={},o.popup=new g.a.Popup({closeButton:!1,closeOnClick:!0}),o.showPopup=o.showPopup.bind(Object(m.a)(o)),o.hidePopup=o.hidePopup.bind(Object(m.a)(o)),o}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.data;this.extent_calcuted=!1,this.range=this.props.range?this.props.range:[3,50],g.a.accessToken=this.props.config.accessToken,this.map=new g.a.Map({center:[this.props.center[1],this.props.center[0]],container:this.mapContainer,maxZoom:this.props.maxZoom,minZoom:this.props.minZoom,style:this.props.mapboxStyle,zoom:this.props.zoom}),e.features&&this.renderMap(e)}},{key:"componentDidUpdate",value:function(e){this.state.mapIsLoaded?this.props.data!==e.data&&this.map.getSource("wildfires").setData(this.props.data):this.renderMap(this.props.data),this.props.selectedFeature&&this.props.selectedFeature!==e.data&&(this.flyToLocation(this.props.selectedFeature),this.showPopup(this.props.selectedFeature,!0))}},{key:"flyToLocation",value:function(e){this.map.flyTo({center:e.geometry.coordinates,zoom:8})}},{key:"getExtent",value:function(e){var t=[];return e.forEach((function(e){t.push(parseFloat(e.properties.CURRENT_SI))})),[Math.min.apply(Math,t),Math.max.apply(Math,t)]}},{key:"hidePopup",value:function(){this.map.getCanvas().style.cursor="",this.popup.remove()}},{key:"mapRange",value:function(e,t,a){return t[0]+(a-e[0])*(t[1]-t[0])/(e[1]-e[0])}},{key:"prepData",value:function(e){var t=this;this.extent_calcuted||(this.extent=this.getExtent(e.features),this.extent_calcuted=!0),e.features.forEach((function(e,a){var o=t.mapRange(t.extent,t.range,e.properties.CURRENT_SI);e.properties.radius=4*Math.log(o)})),e.features.sort((function(e,t){return t.CURRENT_SI-e.CURRENT_SI}))}},{key:"setupPopupText",value:function(e){return v(e)}},{key:"showPopup",value:function(e,t){var a,o;t?(a={lng:e.geometry.coordinates[0],lat:e.geometry.coordinates[1]},o=this.setupPopupText(e.properties)):(a=e.lngLat,o=this.setupPopupText(e.features[0].properties)),this.map.getCanvas().style.cursor="pointer",this.popup.setLngLat(a).setHTML(o).addTo(this.map)}},{key:"renderMap",value:function(e){var t=this;this.prepData(e),this.map.on("load",(function(){for(var a,o=t.map.getStyle().layers,r=0;r<o.length;r++)if("symbol"===o[r].type){a=o[r].id;break}t.map.addSource("evacs_alerts",{type:"vector",url:"mapbox://ngriffiths-postmedia.ckqmy02um05r021lgvokgjxs1-3fgu5"}),t.map.addLayer({id:"evac-data",source:"evacs_alerts","source-layer":"Evacs_and_alerts",type:"fill",paint:{"fill-color":["match",["get","OA_STATUS"],"Alert","#FACE7C","Order","#e67154","Tactical","#A7A9AB","#A7A9AB"],"fill-opacity":.6}},a),t.map.addLayer({id:"evac-data-text",minzoom:6,source:"evacs_alerts","source-layer":"Evacs_and_alerts",type:"symbol",filter:[">",["get","AREA_SQM"],22e7],layout:{"symbol-placement":"point","text-field":["format",["concat","Evacuation ",["get","OA_STATUS"]],{"font-scale":.9,"font-weight":800}]},paint:{"text-color":"rgba(255,255,255,1)","text-halo-blur":.25,"text-halo-color":["match",["get","OA_STATUS"],"Alert","#F6B31C","Order","#DD2D25","Tactical","#A7A9AB","#A7A9AB"],"text-halo-width":1}}),t.map.addSource("wildfires",{type:"geojson",data:e}),t.map.addLayer({id:"wildfires",type:"circle",source:"wildfires",paint:{"circle-color":["match",["get","FIRE_STATU"],"New","#DD2D25","Out of Control","#DD2D25","Being Held","#F26B21","Under Control","#0062A3","Out","#6D6E70","#9b3f86"],"circle-opacity":.7,"circle-radius":["*",["get","radius"],1],"circle-stroke-width":.5,"circle-stroke-color":"#FFF"}},a),t.map.addControl(new g.a.NavigationControl),t.map.on("click","wildfires",t.showPopup),t.map.on("mouseenter","wildfires",t.showPopup),t.map.on("mouseleave","wildfires",t.hidePopup),t.map.on("mouseenter","places",(function(){this.map.getCanvas().style.cursor="pointer"})),t.map.on("mouseleave","places",(function(){this.map.getCanvas().style.cursor=""}))})),this.setState({mapIsLoaded:!0})}},{key:"render",value:function(){var e=this;return r.a.createElement("div",{ref:function(t){return e.mapContainer=t}})}}]),a}(o.Component));a(44);var _=function(e){var t=function(e){var t={out_fires:0,new_fires:0,held_fires:0,controlled_fires:0,last_update:"Waiting for data..."};if(e.data.features){var a=e.data.features,o=a.reduce((function(e,t){return e+parseFloat(t.properties.CURRENT_SI)}),0);t.km_burned=(o/100).toFixed(0),t.total_fires=a.length+1,t.last_update=a.length>0?function(e){var t=new Date(parseInt(e)),a=(o=t.getUTCMonth(),["January","February","March","April","May","June","July","August","September","October","November","December"][parseInt(o)]);var o;return"".concat(a," ").concat(t.toLocaleDateString().split("/")[1],", ").concat(t.getUTCFullYear()," at ").concat(t.toLocaleTimeString())}(a[0].properties.last_update):"Not available";for(var r=0;r<a.length;++r)"New"===a[r].properties.FIRE_STATU|"Out of Control"===a[r].properties.FIRE_STATU|"Fire of Note"===a[r].properties.FIRE_STATU?t.new_fires++:"Being Held"===a[r].properties.FIRE_STATU?t.held_fires++:"Under Control"===a[r].properties.FIRE_STATU?t.controlled_fires++:t.out_fires++}return t}(e);return r.a.createElement("div",{className:"summary-box",onClick:e.toggleFireTypeHandler},r.a.createElement("h2",null,"Latest wildfire stats"),r.a.createElement("div",{className:"stat-box"},r.a.createElement("div",{className:"stat"},r.a.createElement("p",{className:"big-num new"},t.new_fires),r.a.createElement("p",{className:"label"},"New")),r.a.createElement("div",{className:"stat"},r.a.createElement("p",{className:"big-num being-held"},t.held_fires),r.a.createElement("p",{className:"label"},"Held")),r.a.createElement("div",{className:"stat"},r.a.createElement("p",{className:"big-num under-control"},t.controlled_fires),r.a.createElement("p",{className:"label"},"Controlled")),r.a.createElement("div",{className:"stat"},r.a.createElement("p",{className:"big-num out"},t.out_fires),r.a.createElement("p",{className:"label"},"Out*"))),r.a.createElement("p",{className:"last-update"},"Last updated: ",t.last_update),r.a.createElement("p",{className:"note"},"Source: B.C. Wildfire Service. Note: *Tap to toggles views."))},E=(a(45),"open");function T(e){console.log(e);var t=document.getElementById("listings");"open"===E?(e.target.className="closed",t.className="listings closed",E="closed"):(e.target.className="open",t.className="listings open",E="open")}var b=function(e){var t,a=e.data.length>0?e.data.filter((function(e){return"Fire of Note"===e.properties.FIRE_STATU})):[];return t=a.length>0?a.sort((function(e,t){return t.properties.CURRENT_SI-e.properties.CURRENT_SI})).map((function(t){return function(e,t){var a=Math.round(e.CURRENT_SI/100*10)/10,o=e.FIRE_NT_NM,n=a>.1?"".concat(a," sq. km"):"Spot fire";return r.a.createElement("li",{key:e.FIRE_NUMBE,id:e.fire_id,className:"item",onClick:t},r.a.createElement("h4",{className:"title"},o),r.a.createElement("p",{className:"size"},n),r.a.createElement("p",{className:"location"},e.location))}(t.properties,e.flyToLocation)})):r.a.createElement("li",{className:"no-fires"},"Currently there are no fires of note in B.C."),r.a.createElement("div",{className:"sidebar"},r.a.createElement("div",{className:"header"},r.a.createElement("h2",null,"Fires of Note"),r.a.createElement("div",{className:"button"},r.a.createElement("input",{type:"checkbox",id:"switch",className:"open",onChange:T}),r.a.createElement("label",{htmlFor:"switch"}))),r.a.createElement("ul",{id:"listings",className:"listings ".concat(E)},t))},F=(a(46),window.innerWidth>400?5:4),S=window.innerWidth>400?[51.5,-124]:[54,-125],N=function(e){Object(p.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(l.a)(this,a);for(var o=arguments.length,r=new Array(o),n=0;n<o;n++)r[n]=arguments[n];return(e=t.call.apply(t,[this].concat(r))).map_options={center:S,classField:"FIRE_STATU",maxZoom:10,minZoom:3,zoom:F},e}return Object(c.a)(a,[{key:"render",value:function(){return r.a.createElement(o.Fragment,null,r.a.createElement("h1",null,"B.C. Wildfire Tracker"),r.a.createElement(y,{center:this.map_options.center,circleMarkerClassField:this.map_options.classField,config:this.props.config,container:"mapview",data:this.props.data,mapboxStyle:this.props.mapboxStyle,maxZoom:this.map_options.maxZoom,minZoom:this.map_options.minZoom,selectedFeature:this.props.selectedFeature,zoom:this.map_options.zoom}),r.a.createElement(_,{data:this.props.data_all,toggleFireTypeHandler:this.props.toggleFireTypeHandler}),r.a.createElement(b,{data:this.props.data_fon,flyToLocation:this.props.flyToLocation}))}}]),a}(o.Component),w=function(e){Object(p.a)(a,e);var t=Object(u.a)(a);function a(){var e;Object(l.a)(this,a);for(var o=arguments.length,r=new Array(o),n=0;n<o;n++)r[n]=arguments[n];return(e=t.call.apply(t,[this].concat(r))).state={data:[],data_all:[],data_fon:[],selected_feature:null},e}return Object(c.a)(a,[{key:"componentDidMount",value:function(){var e=this;f.a.get(this.props.currentData).then((function(t){var a={type:"FeatureCollection",features:t.data.features.filter((function(e){return"Out"!==e.properties.FIRE_STATU}))};e.setState({data:a,data_all:t.data}),e.setupFiresOfNote(t.data)})),this.flyToLocation=this.flyToLocation.bind(this),this.toggleFireTypeHandler=this.toggleFireTypeHandler.bind(this)}},{key:"setupFiresOfNote",value:function(e){var t=this,a=[];a.push(f.a.get(this.props.fonData)),a.push(f.a.get(this.props.firePerimeters)),f.a.all(a).then((function(a){var o=a.filter((function(e){return e.config.url.includes("fon.json")}))[0].data,r=(a.filter((function(e){return e.config.url.includes("perimeters.json")}))[0].data,e.features.filter((function(e){if("Fire of Note"===e.properties.FIRE_STATU){var t=o.filter((function(t){return t.fire_id===e.properties.FIRE_NT_ID}))[0];return e.properties=Object(i.a)(Object(i.a)({},t),e.properties),e}})).filter((function(e){return e.properties.fire_name})));t.setState({data_fon:r})}))}},{key:"filterFireData",value:function(e){if("new"===e){var t=[];return this.state.data_all.features.forEach((function(a){var o=a.properties.FIRE_STATU.replace(/\s/g,"-").toLowerCase();o===e|"out-of-control"===o&&t.push(a)})),t}return this.state.data_all.features.filter((function(t){return t.properties.FIRE_STATU.replace(/\s/g,"-").toLowerCase()===e}))}},{key:"flyToLocation",value:function(e){this.setState({selected_feature:this.state.data_fon.filter((function(t){return parseInt(t.properties.fire_id)===parseInt(e.target.parentNode.id)}))[0]})}},{key:"toggleFireTypeHandler",value:function(e){var t={type:"FeatureCollection"},a=e.target.className.split(" ")[1];a===this.state.data_displayed?(t.features=this.state.data_all.features.filter((function(e){return"Out"!==e.properties.FIRE_STATU})),a=null):"out"===a?(console.log("OUT"),t=this.state.data_all):t.features=this.filterFireData(a),this.setState({data_displayed:a,data:t})}},{key:"render",value:function(){return r.a.createElement(o.Fragment,null,r.a.createElement(N,{config:this.props.mapboxConfig,selectedFeature:this.state.selected_feature,data:this.state.data,data_all:this.state.data_all,data_fon:this.state.data_fon,mapboxStyle:this.props.mapboxStyle,tiles:this.props.tiles,flyToLocation:this.flyToLocation,toggleFireTypeHandler:this.toggleFireTypeHandler}))}}]),a}(o.Component),C=(a(47),{accessToken:"pk.eyJ1IjoibmdyaWZmaXRocy1wb3N0bWVkaWEiLCJhIjoiY2p5eWluaDR1MHoycTNpbnZhYnE1ZGJ5YyJ9.ky9G5qVIJn0gz_y7tULp6Q"});var k=function(){return r.a.createElement(w,{fonData:"https://vs-postmedia-data.sfo2.digitaloceanspaces.com/fon.json",currentData:"https://vs-postmedia-data.sfo2.digitaloceanspaces.com/wildfires.json",firePerimeters:"https://vs-postmedia-data.sfo2.digitaloceanspaces.com/perimeters.json",mapboxConfig:C,mapboxStyle:"mapbox://styles/mapbox/outdoors-v11"})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(48),a(49),a(50),a(51),a(52),a(53),a(54);s.a.render(r.a.createElement(k,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[20,1,2]]]);
//# sourceMappingURL=main.53be8ec6.chunk.js.map