const jpncities = {
  "Hokkaido": [141.346944, 43.064167],
  "Aomori": [140.740833, 40.824444],
  "Iwate": [141.1525, 39.703611],
  "Miyagi": [140.871944, 38.268889],
  "Akita": [140.1025, 39.718611],
  "Yamagata": [140.363333, 38.255],
  "Fukushima": [140.363333, 37.378611],
  "Ibaraki": [140.4464980803729,36.34082214713679 ],
  "Tochigi": [139.883611, 36.565833],
  "Gunma": [139.060833, 36.391111],
  "Saitama": [139.648889, 35.856944],
  "Chiba": [140.123333, 35.604722],
  "Tokyo": [139.691667, 35.689444],
  "Kanagawa": [139.6425, 35.447778],
  "Niigata": [139.023611, 37.902222],
  "Toyama": [137.211388, 36.695278],
  "Ishikawa": [136.625556, 36.594444],
  "Fukui": [136.221667, 36.065278],
  "Yamanashi": [138.568333, 35.663889],
  "Nagano": [138.181111, 36.651389],
  "Gifu": [136.722222, 35.391111],
  "Shizuoka": [138.383056, 34.976944],
  "Aichi": [136.906667, 35.180278],
  "Mie": [136.508611, 34.730278],
}

const queryString = window.location.search;

const params = new URLSearchParams(queryString);
const loadstatus = document.getElementById('loadstatus');
const btn = document.getElementById('btn');
const wdisp = document.getElementById('w-disp');
const container = document.getElementById('debug-view')
const console = new LunaConsole(container)

const zoomp = params.get('zoomp');
const longitude = params.get('longitude');
const latitude = params.get('latitude');
console.log(zoomp);

const [preLongitude, preLatitude] = [longitude, latitude];

let changedzoomrange = false;
let zoomvalue = 8;

// get weather data from wttr.in
async function wttr(place) {
  wdisp.innerHTML = 'loading...';
  try {
    place = place || '';
    const response = await fetch(`https://wttr.in/${place}?format=j1`);
    if (!response.ok) {
      throw new Error('Weather data could not be fetched');
    }
    const data = await response.json();
    wdisp.innerHTML = data.weather[0].hourly[0].weatherDesc[0].value;

  } catch (error) {
    console.error('Error:', error);
    wdisp.innerHTML = 'Error: ' + error;
    console.log('Error: ' + error);
  }
}

wttr();


const base = document.getElementById('main');

// dpxh
const heightOutput = document.querySelector("#height");
const widthOutput = document.querySelector("#width");

const pitchinput = document.getElementById('pitchinput');
const mapinit = document.getElementById('map');

function getPosition(zoomvalue) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let nowLatitude = position.coords.latitude;
      let nowLongitude = position.coords.longitude;

      map.jumpTo({
        center: [preLongitude || nowLongitude, preLatitude || nowLatitude],
        zoom: zoomvalue || zoomp || 8,
      });
    },
  )
}
function currentPosition(zoomvalue) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      let nowLatitude = position.coords.latitude;
      let nowLongitude = position.coords.longitude;

      map.jumpTo({
        center: [nowLongitude, nowLatitude],
        zoom: zoomvalue || zoomp || 8,
      });
      console.log(nowLongitude, nowLatitude);
    }
  )
}

let map = new maplibregl.Map({
  container: 'map',
  style: 'https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json', // 地図のスタイル
  center: [139.8108103, 35.7100069], // 中心座標
  zoom: 8,
})
map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), 'top-right');
map.addControl(new maplibregl.ScaleControl());
const positionvalue = getPosition();

console.log('welcome to OpenWeather')

async function getWeather() {
  for (const [key, value] of Object.entries(jpncities)) {
    const response = await fetch(`https://wttr.in/${key}?format=j1`);
    if (!response.ok) {
      throw new Error('Weather data could not be fetched');
    }
    const data = await response.json();
    const marker = new maplibregl.Marker()
      .setLngLat(value)
      .setPopup(new maplibregl.Popup().setHTML(`
        <h2>${key}</h2>
        <h3>${data.innerHTML = data.weather[0].hourly[0].weatherDesc[0].value}</h3>
        `))
      .addTo(map);
  }
}

getWeather();
window.onload = currentPosition();
