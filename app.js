const $=s=>document.querySelector(s), app=$('#app');
let unit='C', data=null, place=null;
try{unit=localStorage.getItem('sc-unit')||'C'}catch(e){}
$('#unit').textContent='°'+unit;

const W={0:['Clear sky','☀️','clear'],1:['Mostly clear','🌤️','clear'],2:['Partly cloudy','⛅','cloud'],3:['Overcast','☁️','cloud'],
45:['Fog','🌫️','fog'],48:['Freezing fog','🌫️','fog'],51:['Light drizzle','🌦️','rain'],53:['Drizzle','🌦️','rain'],55:['Heavy drizzle','🌧️','rain'],
56:['Freezing drizzle','🌧️','rain'],57:['Freezing drizzle','🌧️','rain'],61:['Light rain','🌦️','rain'],63:['Rain','🌧️','rain'],65:['Heavy rain','🌧️','rain'],
66:['Freezing rain','🌧️','rain'],67:['Freezing rain','🌧️','rain'],71:['Light snow','🌨️','snow'],73:['Snow','🌨️','snow'],75:['Heavy snow','❄️','snow'],
77:['Snow grains','🌨️','snow'],80:['Rain showers','🌦️','rain'],81:['Rain showers','🌧️','rain'],82:['Violent showers','⛈️','storm'],
85:['Snow showers','🌨️','snow'],86:['Snow showers','❄️','snow'],95:['Thunderstorm','⛈️','storm'],96:['Thunderstorm, hail','⛈️','storm'],99:['Thunderstorm, hail','⛈️','storm']};
const info=c=>W[c]||['Unknown','🌡️','cloud'];

const SKY={
 'clear-1':['#1f5fd0','#5aa2ee','#bfe0fa'],'clear-0':['#0a1230','#1b2a5e','#3b4a8a'],
 'cloud-1':['#4a6b8f','#7d9bb8','#b8c9d8'],'cloud-0':['#141c2e','#2a3650','#47546f'],
 'fog-1':['#7b8794','#a3adb7','#cfd6dc'],'fog-0':['#262c36','#3d4552','#596271'],
 'rain-1':['#2d4560','#4d6781','#7b92a6'],'rain-0':['#0d1626','#1c2c44','#33465f'],
 'snow-1':['#6f8cae','#a5bcd4','#dbe6f0'],'snow-0':['#1a2540','#33456a','#566a92'],
 'storm-1':['#261f45','#3f3a69','#5f5b88'],'storm-0':['#0a0818','#1a1535','#2f2858']};

const T=c=>unit==='C'?Math.round(c):Math.round(c*9/5+32);
const sp=k=>unit==='C'?Math.round(k)+' km/h':Math.round(k*.621)+' mph';
const dirs=['N','NE','E','SE','S','SW','W','NW'];
const fmtH=t=>{const h=+t.slice(11,13);return h===0?'12 AM':h<12?h+' AM':h===12?'12 PM':(h-12)+' PM'};
const fmtT=t=>{const h=+t.slice(11,13),m=t.slice(14,16);return ((h%12)||12)+':'+m+(h<12?' AM':' PM')};
const dow=(t,i)=>i===0?'Today':new Date(t+'T12:00').toLocaleDateString('en',{weekday:'short'});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

async function geocode(q){
 const r=await fetch('https://geocoding-api.open-meteo.com/v1/search?count=5&language=en&name='+encodeURIComponent(q));
 if(!r.ok)throw 0;return (await r.json()).results||[];
}
async function load(p){
 place=p;app.innerHTML='<div class="state"><div class="spin"></div><p>Fetching the sky over '+esc(p.name)+'…</p></div>';
 try{
  const u='https://api.open-meteo.com/v1/forecast?latitude='+p.lat+'&longitude='+p.lon+
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl'+
  '&hourly=temperature_2m,weather_code,precipitation_probability'+
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max'+
  '&timezone=auto&forecast_days=7';
  const r=await fetch(u);if(!r.ok)throw 0;
  data=await r.json();
  try{localStorage.setItem('sc-place',JSON.stringify(p))}catch(e){}
  render();
 }catch(e){
  app.innerHTML='<div class="state"><h1>No signal</h1><p>We couldn’t reach the weather service. Check your connection and try again.</p><div class="row"><button id="retry">Try again</button></div></div>';
  $('#retry').onclick=()=>load(p);
 }
}

function setSky(theme,day){
 const s=SKY[theme+'-'+day]||SKY['cloud-1'],r=document.documentElement.style;
 r.setProperty('--s1',s[0]);r.setProperty('--s2',s[1]);r.setProperty('--s3',s[2]);
 document.querySelector('meta[name=theme-color]')||document.head.insertAdjacentHTML('beforeend','<meta name="theme-color" content="'+s[0]+'">');
 document.querySelector('meta[name=theme-color]').content=s[0];
 fx.mode=theme==='rain'||theme==='storm'?'rain':theme==='snow'?'snow':'none';
}
function render(){
 const c=data.current,d=data.daily,h=data.hourly,[label,emoji,theme]=info(c.weather_code);
 setSky(theme,c.is_day);
 const start=Math.max(0,h.time.findIndex(t=>t>=c.time.slice(0,13)+':00'));
 let hours='';
 for(let i=start;i<start+24&&i<h.time.length;i++){
  const p=h.precipitation_probability[i];
  hours+='<div class="h'+(i===start?' now':'')+'"><span>'+(i===start?'Now':fmtH(h.time[i]))+'</span><i>'+info(h.weather_code[i])[1]+'</i><b>'+T(h.temperature_2m[i])+'°</b><em>'+(p>=20?p+'%':'')+'</em></div>';
 }
 const lo=Math.min(...d.temperature_2m_min),hi=Math.max(...d.temperature_2m_max);
 let days='';
 d.time.forEach((t,i)=>{
  const a=d.temperature_2m_min[i],b=d.temperature_2m_max[i];
  days+='<div class="day"><span>'+dow(t,i)+'</span><i title="'+info(d.weather_code[i])[0]+'">'+info(d.weather_code[i])[1]+'</i><div class="bars"><span class="lo">'+T(a)+'°</span><div class="track"><div class="fill" style="left:'+((a-lo)/(hi-lo||1)*100)+'%;right:'+(100-(b-lo)/(hi-lo||1)*100)+'%"></div></div><span>'+T(b)+'°</span></div></div>';
 });
 const uv=d.uv_index_max[0],uvTxt=uv<3?'Low':uv<6?'Moderate':uv<8?'High':uv<11?'Very high':'Extreme';
 const dir=c.wind_direction_10m,where=[place.name,place.admin1,place.country].filter((x,i,a)=>x&&a.indexOf(x)===i).slice(0,2).join(', ');
 app.innerHTML=
 '<section class="hero rise"><div class="place">'+esc(where)+'</div><div class="sub">'+new Date(c.time).toLocaleDateString('en',{weekday:'long',month:'long',day:'numeric'})+' · '+fmtT(c.time)+'</div>'+
 '<div class="temp" aria-label="'+T(c.temperature_2m)+' degrees">'+T(c.temperature_2m)+'<sup>°</sup></div>'+
 '<div class="cond">'+emoji+' '+label+'</div><div class="range">Feels like '+T(c.apparent_temperature)+'° · High '+T(d.temperature_2m_max[0])+'° · Low '+T(d.temperature_2m_min[0])+'°</div></section>'+
 '<section class="panel rise"><h2>Next 24 hours</h2><div class="hours">'+hours+'</div></section>'+
 '<section class="panel rise"><h2>7-day forecast</h2>'+days+'</section>'+
 '<div class="grid rise">'+
 '<section class="panel"><h2>Wind</h2><div class="big">'+sp(c.wind_speed_10m)+'</div><div class="note"><span class="arrow" style="transform:rotate('+(dir+180)+'deg)">↑</span> from the '+dirs[Math.round(dir/45)%8]+'</div></section>'+
 '<section class="panel"><h2>Humidity</h2><div class="big">'+c.relative_humidity_2m+'%</div><div class="note">'+(c.relative_humidity_2m>70?'Feels muggy':c.relative_humidity_2m<35?'Dry air':'Comfortable')+'</div></section>'+
 '<section class="panel"><h2>UV index</h2><div class="big">'+Math.round(uv)+' <small style="font-size:16px;font-weight:300">'+uvTxt+'</small></div><div class="meter"><u style="left:'+Math.min(uv/12*100,100)+'%"></u></div></section>'+
 '<section class="panel"><h2>Rain chance today</h2><div class="big">'+(d.precipitation_probability_max[0]??0)+'%</div><div class="note">Pressure '+Math.round(c.pressure_msl)+' hPa</div></section>'+
 '<section class="panel" style="grid-column:1/-1"><h2>Sun</h2><div class="sun"><span>🌅 Sunrise <b>'+fmtT(d.sunrise[0])+'</b></span><span>🌇 Sunset <b>'+fmtT(d.sunset[0])+'</b></span></div></section>'+
 '</div>';
}
function welcome(msg){
 setSky('clear',1);
 app.innerHTML='<div class="state rise"><h1>Skycast</h1><p>'+(msg||'Search for a city, or let us find the weather where you are.')+'</p><div class="row"><button id="w-loc">📍 Use my location</button><button class="chip">Lagos</button><button class="chip">London</button><button class="chip">Tokyo</button></div></div>';
 $('#w-loc').onclick=locate;
 document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>pick(b.textContent));
}

async function pick(name){
 try{const r=await geocode(name);if(!r.length)return welcome('No city called “'+esc(name)+'” turned up. Check the spelling or try a nearby city.');
  const x=r[0];load({name:x.name,admin1:x.admin1,country:x.country,lat:x.latitude,lon:x.longitude});
 }catch(e){welcome('Search isn’t working right now. Check your connection and try again.')}
}
function locate(){
 if(!navigator.geolocation)return welcome('Your browser can’t share location. Search for a city instead.');
 app.innerHTML='<div class="state"><div class="spin"></div><p>Finding you…</p></div>';
 navigator.geolocation.getCurrentPosition(async pos=>{
  const lat=+pos.coords.latitude.toFixed(3),lon=+pos.coords.longitude.toFixed(3);
  load({name:'Your location',lat,lon});
 },()=>welcome('Location access was blocked. Allow it in your browser settings, or search for a city.'),{timeout:10000});
}
const q=$('#q'),res=$('#results');let tm;
q.addEventListener('input',()=>{
 clearTimeout(tm);const v=q.value.trim();
 if(v.length<2){res.style.display='none';return}
 tm=setTimeout(async()=>{
  try{const r=await geocode(v);
   res.innerHTML=r.length?r.map((x,i)=>'<li tabindex="0" data-i="'+i+'">'+esc(x.name)+'<small>'+esc([x.admin1,x.country].filter(Boolean).join(', '))+'</small></li>').join(''):'<li>No matches</li>';
   res.style.display='block';
   res.querySelectorAll('li[data-i]').forEach(li=>{
    const go=()=>{const x=r[li.dataset.i];res.style.display='none';q.value='';load({name:x.name,admin1:x.admin1,country:x.country,lat:x.latitude,lon:x.longitude})};
    li.onclick=go;li.onkeydown=e=>{if(e.key==='Enter')go()};
   });
  }catch(e){res.innerHTML='<li>Search unavailable. Check your connection.</li>';res.style.display='block'}
 },280);
});
q.addEventListener('keydown',e=>{if(e.key==='Enter'&&q.value.trim()){res.style.display='none';const v=q.value.trim();q.value='';pick(v)}});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))res.style.display='none'});
$('#loc').onclick=locate;
$('#unit').onclick=()=>{unit=unit==='C'?'F':'C';$('#unit').textContent='°'+unit;try{localStorage.setItem('sc-unit',unit)}catch(e){}if(data)render()};

const fx=Object.assign($('#fx'),{mode:'none'}),ctx=fx.getContext('2d');let P=[];
function size(){fx.width=innerWidth*devicePixelRatio;fx.height=innerHeight*devicePixelRatio}
addEventListener('resize',size);size();
function frame(){
 ctx.clearRect(0,0,fx.width,fx.height);
 if(fx.mode!=='none'){
  const n=fx.mode==='rain'?140:90,k=devicePixelRatio;
  while(P.length<n)P.push({x:Math.random()*fx.width,y:Math.random()*fx.height,v:fx.mode==='rain'?12+Math.random()*10:1+Math.random()*2,r:Math.random()*2+1});
  P.length=n;ctx.strokeStyle='rgba(255,255,255,.35)';ctx.fillStyle='rgba(255,255,255,.8)';
  for(const p of P){
   if(fx.mode==='rain'){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-2*k,p.y+p.v*1.6*k);ctx.lineWidth=k;ctx.stroke();p.y+=p.v*k;p.x-=.5*k}
   else{ctx.beginPath();ctx.arc(p.x,p.y,p.r*k,0,7);ctx.fill();p.y+=p.v*k;p.x+=Math.sin(p.y/60)*.6*k}
   if(p.y>fx.height){p.y=-10;p.x=Math.random()*fx.width}
  }
 }
 requestAnimationFrame(frame);
}
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)frame();

let saved=null;try{saved=JSON.parse(localStorage.getItem('sc-place'))}catch(e){}
saved?load(saved):welcome();