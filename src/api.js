import { WeatherApiKey } from "../API-Keys.js";


function getUrlLatLng(lat, lng) {
    return `http://api.weatherapi.com/v1/forecast.json?key=${WeatherApiKey}&q=${lat},${lng}&days=3&aqi=no&alerts=no`;
}

function getUrlCity(city) {
    return `http://api.weatherapi.com/v1/forecast.json?key=${WeatherApiKey}&q=${city}&days=3&aqi=no&alerts=no`;
}

async function getWeatherDataByUrl(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export async function getWeatherData({ city, lat, lng }) {
    let url;
    if (lat && lng) { // latlng
        url = getUrlLatLng(lat, lng);
    } else { // city
        url = getUrlCity(city);
    }

    const data = await getWeatherDataByUrl(url);
    return data;
}