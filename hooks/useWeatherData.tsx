import {
  getCurrentForecastWeatherDataUrl,
  getPastForecastWeatherDataUrl,
} from "@/utils";
import { ForecastWeatherData, PastWeatherData } from "@/utils/types";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";

type useWeatherDataReturnType = {
  currentWeatherData: undefined | ForecastWeatherData;
  pastWeatherData: undefined | PastWeatherData;
  currentTemperature: undefined | string;
};

type useWeatherDataArgs = {
  initialForecastWeatherData: ForecastWeatherData;
  initialPastWeatherData: PastWeatherData;
  city: string;
};

type HourlyType = { time: string[]; temperature_2m: string[] };

const getCurrentTemperature = (data: HourlyType): string => {
  const currentHour = moment().startOf("hour").format("YYYY-MM-DDTHH:mm");
  const currentTimeIndex = data.time.findIndex((time) => time === currentHour);
  return data.temperature_2m[currentTimeIndex];
};

export const useWeatherData = ({
  initialPastWeatherData,
  initialForecastWeatherData,
  city,
}: useWeatherDataArgs): useWeatherDataReturnType => {
  const [pastWeatherData, setPastWeatherData] = useState<PastWeatherData>();
  const [currentWeatherData, setCurrentWeatherData] = useState(
    initialForecastWeatherData
  );
  const { hourly } = currentWeatherData || {};
  const currentTemperature = useMemo(
    () => getCurrentTemperature(hourly as unknown as HourlyType),
    [city, hourly]
  );

  // need to set on client side to avoid hydration problem
  useEffect(() => {
    setPastWeatherData(initialPastWeatherData);
  }, []);

  const updateForecastWeatherData = async (city: string) => {
    const res = await fetch(getCurrentForecastWeatherDataUrl(city));
    setCurrentWeatherData?.(await res.json());
  };

  const updatePastWeatherData = async (city: string) => {
    const res = await fetch(getPastForecastWeatherDataUrl(city));
    setPastWeatherData?.(await res.json());
  };
  useEffect(() => {
    const updateData = async () => {
      Promise.all([
        updateForecastWeatherData(city),
        updatePastWeatherData(city),
      ]);
    };
    updateData();
  }, [city]);

  return {
    currentWeatherData,
    pastWeatherData,
    currentTemperature,
  };
};
