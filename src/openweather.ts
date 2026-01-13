import axios from "axios";
import { env } from "./config";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function fetchWeather(city: string) {
  const response = await axios.get(BASE_URL, {
    params: {
      q: city,
      appid: env.OPENWEATHER_API_KEY,
      units: "metric",
      lang: "pt_br",
    },
    timeout: 10000,
  });

  const data = response.data;

  return {
    city: data.name,
    country: data.sys?.country,
    temp: data.main?.temp,
    humidity: data.main?.humidity,
    description: data.weather?.[0]?.description,
    sourceTime: new Date(data.dt * 1000),
  };
}
