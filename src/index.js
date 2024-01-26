import tailwindcss from "./output.css";
import { getWeatherData } from "./api.js";
import GlideStyles from "./glide.core.min.css";
import Glide from "@glidejs/glide";
import searchImg from "./assets/searchIcon.png";

window.onload = async function () {
  const location = await getLocation();
  GeneralContent(location, true);
};

let isCelcius = true;
let isHourly = true;
let currentLocation = null;

function GeneralContent(initialLocation, initial) {
  const content = document.getElementById("content");
  content.innerHTML = "";
  content.classList = "w-full flex flex-col flex-grow justify-center";
  const header = document.createElement("header");
  header.classList =
    "w-full lg:h-1/6 h-36 px-8 bg-slate-500 flex flex-row justify-evenly items-center";
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
  const SearchDiv = document.createElement("div");
  SearchDiv.classList = "flex flex-row justify-evenly items-center space-x-4";
  const cityInput = document.createElement("input");
  cityInput.type = "text";
  cityInput.placeholder = "City";
  cityInput.classList =
    "w-1/4 max-md:w-1/2 flex-grow rounded-md border-2 border-slate-500 text-center text-slate-500 outline-none";
  cityInput.id = "cityInput";
  cityInput.addEventListener("keyup", async (e) => {
    if (e.keyCode == 13) {
      if (cityInput.value !== "") {
        GeneralContent(cityInput.value);
      }
    }
  });

  const searchButton = document.createElement("img");
  searchButton.src = searchImg;
  searchButton.width = "25";
  searchButton.height = "25";
  searchButton.classList = "cursor-pointer";
  searchButton.addEventListener("click", async () => {
    if (cityInput.value !== "") {
      GeneralContent(cityInput.value);
    }
  });

  SearchDiv.appendChild(cityInput);
  SearchDiv.appendChild(searchButton);

  const metricInput = document.createElement("input"); // Celsius or Fahrenheit Switch
  metricInput.type = "checkbox";
  metricInput.checked = true;
  metricInput.classList =
    "lg:w-1/4 w-1/2 rounded-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5";
  metricInput.id = "metricInput";

  const mainDiv = document.createElement("div");
  mainDiv.classList = "w-full h-full flex flex-col space-y-8 items-center px-4";

  if (initial) {
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
  } else {
    WeatherDiv(mainDiv, initialLocation, true);
  }

  header.appendChild(SearchDiv);
  header.appendChild(headerTitle);
  header.appendChild(metricRadioButtonsList());

  main.appendChild(mainDiv);
  content.appendChild(header);
  content.appendChild(main);
}

async function WeatherDiv(mainDiv, initialLocation, isCity = false) {
  currentLocation = initialLocation;
  let weatherData;
  if (isCity) {
    weatherData = await getWeatherData({
      city: initialLocation,
      lat: null,
      lng: null,
    });
  } else {
    weatherData = await getWeatherData({
      city: null,
      lat: initialLocation[0],
      lng: initialLocation[1],
    });
  }
  if (weatherData.error) {
    mainDiv.appendChild(errorDiv(weatherData.error.message, "Try Again?"));
  }
  const weatherDiv = document.createElement("div");
  weatherDiv.classList = "w-full flex flex-col items-center px-4";
  const weatherDataDiv = document.createElement("div");
  const currentDayForecast = weatherData.forecast.forecastday[0];
  weatherDataDiv.classList =
    "w-1/2 p-16 rounded-lg shadow-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5 bg-slate-400 flex flex-col space-y-4";
  weatherDataDiv.innerHTML = `<h2 class='text-3xl text-slate-900 font-semibold'> ${
    weatherData.location.name
  } </h2>
    <h3 class='text-2xl text-slate-900 font-semibold'> ${
      weatherData.location.country
    }, ${weatherData.location.localtime} </h3>
    <h3 class='text-xl text-slate-900 font-semibold'> Currently: ${
      isCelcius
        ? weatherData.current.temp_c + "°C"
        : weatherData.current.temp_f + "°F"
    } </h3>
    <h4 class='text-xl text-slate-900 font-semibold'>Max: ${
      isCelcius
        ? currentDayForecast["day"].maxtemp_c + "°C"
        : currentDayForecast["day"].maxtemp_f + "°F"
    } | Low: ${
    isCelcius
      ? currentDayForecast["day"].mintemp_c + "°C"
      : currentDayForecast["day"].mintemp_f + "°F"
  }</h4>
  <h4 class='text-lg text-slate-800 font-semibold'>Sun Rise: ${
    currentDayForecast["astro"].sunrise
  } | Sun Set: ${currentDayForecast["astro"].sunset}</h4>`;

  const extraDataDiv = document.createElement("div");
  extraDataDiv.classList = "w-full flex flex-row justify-evenly items-center";
  extraDataDiv.id = "extraDataDiv";
  weatherDiv.appendChild(weatherDataDiv);
  mainDiv.appendChild(weatherDiv);
  mainDiv.appendChild(switchHourlyDaily(weatherData));
  mainDiv.appendChild(extraDataDiv);
  if (isHourly) {
    HourlyForecastDiv(
      weatherData.forecast.forecastday[0]["hour"],
      weatherData.location.localtime.split(" ")[1]
    );
  } else {
    DailyForecastDiv(weatherData.forecast.forecastday.slice(1));
  }
}

function switchHourlyDaily(weatherData) {
  const ul = document.createElement("ul");
  ul.className =
    "items-center text-md font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  // Create the first li element
  const li1 = document.createElement("li");
  li1.className =
    "w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600";

  const div1 = document.createElement("div");
  div1.className = "flex items-center justify-center px-4";
  div1.style.cursor = "pointer";

  div1.addEventListener("click", () => {
    isHourly = true;
    div1.style.backgroundColor = "green"; // Set color to green when clicked
    div2.style.backgroundColor = "gray"; // Set color to gray when the other div is clicked
    HourlyForecastDiv(
      weatherData.forecast.forecastday[0]["hour"],
      weatherData.location.localtime.split(" ")[1]
    );
  });

  const label1 = document.createElement("label");
  label1.textContent = "Hourly";
  label1.className =
    "w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";

  div1.appendChild(label1);
  li1.appendChild(div1);

  // Create the second li element
  const li2 = document.createElement("li");
  li2.className =
    "w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600";

  const div2 = document.createElement("div");
  div2.className = "flex items-center justify-center px-4";
  div2.style.cursor = "pointer";
  div2.style.backgroundColor = "gray"; // Set initial color to gray

  div2.addEventListener("click", () => {
    isHourly = false;
    div1.style.backgroundColor = "gray"; // Set color to gray when the other div is clicked
    div2.style.backgroundColor = "green"; // Set color to green when clicked
    DailyForecastDiv(weatherData.forecast.forecastday.slice(1));
  });

  if (!isHourly) {
    div1.style.backgroundColor = "gray";
    div2.style.backgroundColor = "green";
  } else {
    div1.style.backgroundColor = "green";
    div2.style.backgroundColor = "gray";
  }

  const label2 = document.createElement("label");
  label2.textContent = "Daily";
  label2.className =
    "w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";

  div2.appendChild(label2);
  li2.appendChild(div2);

  // Append the li elements to the ul
  ul.appendChild(li1);
  ul.appendChild(li2);

  return ul;
}

function HourlyForecastDiv(dayweatherData, currentHour) {
  let newCurrentHour = currentHour.split(":")[0] + ":00";
  let currentIndex = 0;
  const container = document.querySelector("#extraDataDiv");
  container.innerHTML = `<div class="glide mx-8 mb-8">
  <div class="glide__track" data-glide-el="track">
    <ul class="glide__slides">
    </ul>
  </div>
  <div class="glide__arrows flex flex-row justify-center items-center space-x-6" data-glide-el="controls">
    <button class="glide__arrow glide__arrow--left bg-slate-400 mt-4 p-2 rounded-lg shadow-md hover:scale-105" data-glide-dir="<">prev</button>
    <button class="glide__arrow glide__arrow--right bg-slate-400 mt-4 p-2 rounded-lg shadow-md hover:scale-105" data-glide-dir=">">next</button>
  </div>
</div>`;
  const glideList = document.querySelector(".glide__slides");

  dayweatherData.forEach((hour, index) => {
    const glideItem = document.createElement("li");
    const isNow = hour.time.split(" ")[1] === newCurrentHour;
    if (isNow) currentIndex = index;
    glideItem.innerHTML = `<div class='glide__slide rounded-lg shadow-md border-2 border-slate-500 text-center text-slate-500 outline-none ${
      isNow ? "bg-emerald-600" : "bg-slate-400"
    } flex flex-col justify-center items-center'>
    <h2 class='text-2xl text-slate-900 font-semibold'> ${
      isNow ? "Now" : hour.time.split(" ")[1]
    } </h2>
    <h3 class='text-xl ${isNow ? "text-slate-800" : "text-slate-700"}'>${
      isCelcius ? hour.temp_c + "°C" : hour.temp_f + "°F"
    }</h3>
    <h4 class = 'text-lg ${isNow ? "text-slate-800" : "text-slate-700"}' >${
      hour.condition.text
    }</h4>
    </div>`;
    glideList.appendChild(glideItem);
  });

  const glideConfig = {
    type: "carousel",
    perView: 3,
    startAt: currentIndex - 1,
  };

  new Glide(".glide", glideConfig).mount();
}

function DailyForecastDiv(dayweatherData) {
  const container = document.querySelector("#extraDataDiv");
  container.classList =
    "w-full flex flex-col items-center justify-center lg:flex-row lg:justify-evenly lg:items-center";
  container.innerHTML = "";

  const tomorrowDiv = document.createElement("div");
  tomorrowDiv.classList =
    "w-full flex flex-col space-y-2 items-center p-4 bg-slate-400 rounded-lg shadow-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5";
  tomorrowDiv.innerHTML = `<h2 class='text-2xl text-slate-900 font-semibold'> ${
    "Tomorrow: " + dayweatherData[0].date
  } </h2>
    <h3 class='text-xl text-slate-900 font-semibold'> Max: ${
      isCelcius
        ? dayweatherData[0].day.maxtemp_c + "°C"
        : dayweatherData[0].day.maxtemp_f + "°F"
    } | Low: ${
    isCelcius
      ? dayweatherData[0].day.mintemp_c + "°C"
      : dayweatherData[0].day.mintemp_f + "°F"
  }</h3>
  <h4 class='text-lg text-slate-800 font-semibold'>Sun Rise: ${
    dayweatherData[0].astro.sunrise
  } | Sun Set: ${dayweatherData[0].astro.sunset}</h4>`;

  const afterTomorrowDiv = document.createElement("div");
  afterTomorrowDiv.classList =
    "w-full flex flex-col items-center space-y-2 p-4 bg-slate-400 rounded-lg shadow-md border-2 border-slate-500 text-center text-slate-500 outline-none m-5";
  afterTomorrowDiv.innerHTML = `<h2 class='text-2xl text-slate-900 font-semibold'> ${
    "After Tomorrow: " + dayweatherData[1].date
  } </h2>
    <h3 class='text-xl text-slate-900 font-semibold'> Max: ${
      isCelcius
        ? dayweatherData[1].day.maxtemp_c + "°C"
        : dayweatherData[1].day.maxtemp_f + "°F"
    } | Low: ${
    isCelcius
      ? dayweatherData[1].day.mintemp_c + "°C"
      : dayweatherData[1].day.mintemp_f + "°F"
  }</h3>
  <h4 class='text-lg text-slate-800 font-semibold'>Sun Rise: ${
    dayweatherData[1].astro.sunrise
  } | Sun Set: ${dayweatherData[1].astro.sunset}</h4>`;

  container.appendChild(tomorrowDiv);
  container.appendChild(afterTomorrowDiv);
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
    "items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white";

  // Create the first li element
  const li1 = document.createElement("li");
  li1.className =
    "w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600";

  const div1 = document.createElement("div");
  div1.className = "flex items-center justify-center px-4";
  div1.style.cursor = "pointer";

  div1.addEventListener("click", () => {
    isCelcius = true;
    div1.style.backgroundColor = "green"; // Set color to green when clicked
    div2.style.backgroundColor = "gray"; // Set color to gray when the other div is clicked
    GeneralContent(currentLocation, false);
  });

  const label1 = document.createElement("label");
  label1.textContent = "Celsius";
  label1.className =
    "w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";

  div1.appendChild(label1);
  li1.appendChild(div1);

  // Create the second li element
  const li2 = document.createElement("li");
  li2.className =
    "w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600";

  const div2 = document.createElement("div");
  div2.className = "flex items-center justify-center px-4";
  div2.style.cursor = "pointer";
  div2.style.backgroundColor = "gray"; // Set initial color to gray

  div2.addEventListener("click", () => {
    isCelcius = false;
    div1.style.backgroundColor = "gray"; // Set color to gray when the other div is clicked
    div2.style.backgroundColor = "green"; // Set color to green when clicked
    GeneralContent(currentLocation, false);
  });

  if (!isCelcius) {
    div1.style.backgroundColor = "gray";
    div2.style.backgroundColor = "green";
  } else {
    div1.style.backgroundColor = "green";
    div2.style.backgroundColor = "gray";
  }

  const label2 = document.createElement("label");
  label2.textContent = "Fahrenheit";
  label2.className =
    "w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300";

  div2.appendChild(label2);
  li2.appendChild(div2);

  // Append the li elements to the ul
  ul.appendChild(li1);
  ul.appendChild(li2);

  return ul;
}
