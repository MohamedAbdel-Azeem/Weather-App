import tailwindcss from "./output.css";
import {WeatherApiKey} from "../API-Keys.js"; // The File API-Keys.js is git ignored

window.onload = async function(){
  const location = await getLocation();
  GeneralContent(location);
}


function GeneralContent(initialLocation){
    console.log(initialLocation);
    const content = document.getElementById('content');
    content.classList = 'w-full flex flex-col flex-grow justify-center';
    const header = document.createElement('header');
    header.classList = 'w-full h-1/6 flex flex-col justify-center items-center bg-slate-500';
    const main = document.createElement('main');
    main.classList = 'w-full flex flex-col flex-grow space-y-24 justify-center items-center bg-slate-200 px-4';

    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'Weather App';
    headerTitle.classList.add('text-4xl', 'text-center', 'font-bold', 'text-slate-50', 'py-4');
    header.appendChild(headerTitle);

    const cityInput = document.createElement('input');
    cityInput.type = 'text';
    cityInput.placeholder = 'City';
    cityInput.classList = 'w-1/4 max-md:w-1/2 rounded-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5';
    cityInput.id = 'cityInput';
    
    const mainDiv = document.createElement('div');
    mainDiv.classList = 'w-full h-full flex flex-col items-center px-4';

    if (initialLocation === null){
      const errorDiv = document.createElement('div');
      errorDiv.classList = 'w-1/2 p-16 rounded-lg border-2 border-slate-500 text-center text-slate-500 outline-none m-5 bg-red-400';
      errorDiv.innerHTML = "<h2 class='text-2xl text-slate-900 font-semibold'>Geolocation is not supported by this browser ! <br> <em> Search for a City instead? </em> </h2>";
      mainDiv.appendChild(errorDiv);
    }
    
    
    main.appendChild(cityInput);
    main.appendChild(mainDiv);

    content.appendChild(header);
    content.appendChild(main);
}


async function getLocation() {
  try {
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
  } catch (error) {
    console.log("An error occurred while getting the location.");
    return null;
  }
}

async function getWeatherData(lat,lng){
  const url = `http://api.weatherapi.com/v1/current.json?key=${WeatherApiKey}&q=${lat},${lng}&aqi=no`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}