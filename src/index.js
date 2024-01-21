import tailwindcss from "./output.css";
import {WeatherApiKey} from "../API-Keys.js"; // The File API-Keys.js is git ignored

window.onload = function(){
  const location = getLocation();
  GeneralContent(location);
}


function GeneralContent(initialLocation){
    const content = document.getElementById('content');
    const header = document.createElement('header');
    header.classList = 'w-full h-1/6 flex flex-col justify-center items-center bg-slate-500';
    const main = document.createElement('main');
    main.classList = 'w-full h-5/6 flex flex-col space-y-8 justify-center items-center bg-slate-100 px-4';

    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'Weather App';
    headerTitle.classList.add('text-4xl', 'text-center', 'font-bold', 'text-slate-50', 'py-4');
    header.appendChild(headerTitle);

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.placeholder = 'City';
    cityInput.classList = 'w-1/4 h-10 rounded-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5';
    cityInput.id = 'cityInput';
    main.appendChild(cityInput);

    content.appendChild(header);
    content.appendChild(main);
}


async function getLocation() {
  if (navigator.geolocation) {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const positionData = [position.coords.latitude, position.coords.longitude];
    console.log(positionData);
    return positionData;
  } else { 
    console.log("Geolocation is not supported by this browser.");
    return null;
  }
}

async function getWeatherData(lat,lng){
  const url = `http://api.weatherapi.com/v1/current.json?key=${WeatherApiKey}&q=${lat},${lng}&aqi=no`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}