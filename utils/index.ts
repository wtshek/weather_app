import moment from "moment";
import { data as citiesData } from "../data/citiesData";
import { PastWeatherChartData, PastWeatherData } from "./types";

export const getTodayDateString = (): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const WEATHER_DATA_API = "https://api.open-meteo.com/v1/forecast";

export const getCurrentForecastWeatherDataUrl = (cityName: string): string => {
  const { latitude, longitude, timezone } = citiesData[cityName];
  const date = getTodayDateString();
  const params = new URLSearchParams();
  params.append("latitude", String(latitude));
  params.append("longitude", String(longitude));
  params.append("hourly", "temperature_2m");
  params.append("start_date", date);
  params.append("end_date", date);
  params.append("timezone", timezone);

  const queryString = params.toString();
  const url = `${WEATHER_DATA_API}?${queryString}`;

  return url;
};

export const getPastForecastWeatherDataUrl = (cityName: string): string => {
  const { latitude, longitude, timezone } = citiesData[cityName];
  const params = new URLSearchParams();
  params.append("latitude", String(latitude));
  params.append("longitude", String(longitude));
  params.append("daily", "temperature_2m_max,temperature_2m_min");
  params.append("timezone", timezone);
  params.append("past_days", "5");

  const queryString = params.toString();
  const url = `${WEATHER_DATA_API}?${queryString}`;

  return url;
};

export const getCurrentTimeString = (): string =>
  moment().format("YYYY-MM-DD HH:mm:ss");

export const convertPastWeatherDataToChartUsable = (
  data?: PastWeatherData
): PastWeatherChartData | undefined => {
  if (!data) return;

  return data?.daily.time.map((time, index) => ({
    date: time,
    minTemp: data.daily.temperature_2m_min[index],
    maxTemp: data.daily.temperature_2m_max[index],
  }));
};
