import tailwindcss from "./output.css";
import { getWeatherData } from "./api.js";

window.onload = async function () {
  const location = await getLocation();
  GeneralContent(location);
};

let isCelcius = true;

function GeneralContent(initialLocation) {
  const content = document.getElementById("content");
  content.classList = "w-full flex flex-col flex-grow justify-center";
  const header = document.createElement("header");
  header.classList =
    "w-full lg:h-1/6 h-36 px-8 bg-slate-500 flex flex-row justify-between items-center";
  const main = document.createElement("main");
  main.classList =
    "w-full flex flex-col flex-grow space-y-16 justify-center items-center bg-slate-200 px-4";

  const headerTitle = document.createElement("h1");
  headerTitle.textContent = "Weather App";
  headerTitle.classList.add(
    "text-4xl",
    "text-center",
    "font-bold",
    "text-slate-50",
    "py-4"
  );

  const cityInput = document.createElement("input");
  cityInput.type = "text";
  cityInput.placeholder = "City";
  cityInput.classList =
    "w-1/4 max-md:w-1/2 rounded-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5";
  cityInput.id = "cityInput";

  const metricInput = document.createElement("input"); // Celsius or Fahrenheit Switch
  metricInput.type = "checkbox";
  metricInput.checked = true;
  metricInput.classList =
    "w-1/4 max-md:w-1/2 rounded-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5";
  metricInput.id = "metricInput";

  const mainDiv = document.createElement("div");
  mainDiv.classList = "w-full h-full flex flex-col items-center px-4";

  if (initialLocation === null) {
    mainDiv.appendChild(
      errorDiv(
        "Geolocation is not supported by this browser !",
        "Search for a City instead?"
      )
    );
  } else {
    WeatherDiv(mainDiv, initialLocation);
  }

  header.appendChild(cityInput);
  header.appendChild(headerTitle);
  header.appendChild(metricRadioButtonsList());

  main.appendChild(mainDiv);

  content.appendChild(header);
  content.appendChild(main);
}

async function WeatherDiv(mainDiv, initialLocation) {
  const weatherData = await getWeatherData({
    city: null,
    lat: initialLocation[0],
    lng: initialLocation[1],
  });
  const weatherDiv = document.createElement("div");
  weatherDiv.classList = "w-full h-full flex flex-col items-center px-4";
  const weatherDataDiv = document.createElement("div");
  weatherDataDiv.classList =
    "w-1/2 p-16 rounded-lg shadow-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5 bg-slate-400";
  weatherDataDiv.innerHTML = `<h2 class='text-2xl text-slate-900 font-semibold'> ${weatherData.location.region} </h2>
    <h3 class='text-xl text-slate-900 font-semibold'> ${weatherData.location.country}, ${weatherData.location.localtime} </h3>
    <h3 class='text-xl text-slate-900 font-semibold'> Currently: ${weatherData.current.temp_c}°C </h3>`;
  weatherDiv.appendChild(weatherDataDiv);
  mainDiv.appendChild(weatherDiv);
}

function errorDiv(error, solution) {
  const errorDiv = document.createElement("div");
  errorDiv.classList =
    "w-1/2 p-16 rounded-lg border-2 border-slate-500 text-center text-slate-500 outline-none m-5 bg-red-400";
  errorDiv.innerHTML = `<h2 class='text-2xl text-slate-900 font-semibold'> ${error} <br> <em> ${solution} </em> </h2>`;
  return errorDiv;
}

async function getLocation() {
  try {
    if (navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const positionData = [
        position.coords.latitude,
        position.coords.longitude,
      ];
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

function metricRadioButtonsList() {
  // Create the ul element
  const ul = document.createElement("ul");
  ul.className =
    "items-center mr-20 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  // Create the first li element
  const li1 = document.createElement("li");
  li1.className =
    "w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600";

  const div1 = document.createElement("div");
  div1.className = "flex items-center ps-3";

  const input1 = document.createElement("input");
  input1.type = "radio";
  input1.name = "metric";
  input1.checked = true;
  input1.classList =
    "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500";

  input1.addEventListener("click", () => {
    isCelcius = true;
  });

  const label1 = document.createElement("label");
  label1.textContent = "Celsius";
  label1.className =
    "w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";

  div1.appendChild(input1);
  div1.appendChild(label1);
  li1.appendChild(div1);

  // Create the second li element
  const li2 = document.createElement("li");
  li2.className =
    "w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600";

  const div2 = document.createElement("div");
  div2.className = "flex items-center ps-3";

  const input2 = document.createElement("input");
  input2.type = "radio";
  input2.name = "metric";
  input2.classList =
    "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500";

  input2.addEventListener("click", () => {
    isCelcius = false;
  });

  const label2 = document.createElement("label");
  label2.textContent = "Fahrenheit";
  label2.className =
    "w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";

  div2.appendChild(input2);
  div2.appendChild(label2);
  li2.appendChild(div2);

  // Append the li elements to the ul
  ul.appendChild(li1);
  ul.appendChild(li2);

  return ul;
}
