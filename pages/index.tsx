import { GetServerSideProps } from "next";
import Head from "next/head";
import { ChangeEvent, FC, useState } from "react";
import {
  convertPastWeatherDataToChartUsable,
  getCurrentForecastWeatherDataUrl,
  getPastForecastWeatherDataUrl,
} from "utils";
import { ForecastWeatherData, PastWeatherData } from "utils/types";
import { data as cityData } from "@/data/citiesData";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useWeatherData } from "@/hooks/useWeatherData";
import clsx from "clsx";

// TODO: make the chart responsive

type HomeProps = {
  initialForecastWeatherData: ForecastWeatherData;
  initialCity: string;
  initialPastWeatherData: PastWeatherData;
};

type SavedData = {
  city: string;
  time: string;
  temperature: string;
};

const Home: FC<HomeProps> = ({
  initialForecastWeatherData,
  initialCity,
  initialPastWeatherData,
}) => {
  const cityNames = Object.keys(cityData);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [shouldAutoUpdate, setShouldAutoUpdate] = useState(true);
  const currentTimeString = useCurrentTime(shouldAutoUpdate);
  const [savedData, setSavedData] = useState<SavedData[]>([]);
  const [shouldShowData, setShouldShowData] = useState(false);
  const { pastWeatherData, currentTemperature } = useWeatherData({
    initialForecastWeatherData,
    initialPastWeatherData,
    city: selectedCity,
  });

  const onCitySelect = async (e: ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
  };

  const toggleAutoUpdate = () => {
    setShouldAutoUpdate((prev) => !prev);
  };

  const onSavedDataButtonClick = () => {
    const data = {
      city: selectedCity,
      time: currentTimeString,
      temperature: currentTemperature as string,
    };
    setSavedData((prev) => [...prev, data]);
  };

  const toggleShowData = () => setShouldShowData((prev) => !prev);

  return (
    <div>
      <Head>
        <title>Weather App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-white p-8 bg-gradient-to-b from-blue-500 to-blue-900 min-w-screen min-h-screen flex flex-col">
        <section className="flex justify-between w-full">
          <h1 className="text-4xl font-bold">{selectedCity}</h1>
          <div>
            <div>How is other city?</div>
            <select
              onChange={onCitySelect}
              className="border-white text-blue-500 rounded-sm w-full"
            >
              {cityNames.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </section>
        <div className="text-xl mt-4">
          Current Temperature: {currentTemperature} °C
        </div>

        <div className="overflow-scroll max-w-[900px] mt-8">
          <ResponsiveContainer minWidth={600}>
            <LineChart
              width={730}
              height={250}
              data={convertPastWeatherDataToChartUsable(pastWeatherData)}
              id="past-weather-chart"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis
                tick={{ stroke: "white" }}
                domain={["dataMin - 3", "dataMax + 3"]}
              />
              <XAxis dataKey="date" tick={{ stroke: "white" }} />
              <Tooltip />
              <Line type="monotone" dataKey="minTemp" stroke="#8884d8" />
              <Line type="monotone" dataKey="maxTemp" stroke="#82ca9d" />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="mt-4 text-xs opacity-8 italic">
            Last Update Time: {currentTimeString}
          </div>
        </div>
        <button className="w-fit btn-primary mt-4" onClick={toggleAutoUpdate}>
          {shouldAutoUpdate ? "Pause Auto Update" : "Auto Update"}
        </button>
        <div className="flex gap-2 mt-8">
          <button className="btn-primary" onClick={onSavedDataButtonClick}>
            Save Data
          </button>
          <button className="btn-primary" onClick={toggleShowData}>
            {shouldShowData ? "Hide Data" : "Show Data"}
          </button>
        </div>
        <div
          className={clsx("transition-transform scale-0 mt-4", {
            "scale-100": shouldShowData,
          })}
        >
          <div>Saved Data:</div>
          {savedData?.slice(-5).map((data) => (
            <div className="flex gap-2">
              <span>{data.city}</span>
              <span>{data.time}</span>
              <span>{data.temperature}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<{
  initialForecastWeatherData: ForecastWeatherData;
}> = async (context) => {
  const { query } = context;
  const city =
    (query.cityName as string) || (Object.keys(cityData)[0] as string);
  const currentDataRes = await fetch(getCurrentForecastWeatherDataUrl(city));

  const pastDataRes = await fetch(getPastForecastWeatherDataUrl(city));

  if (!currentDataRes.ok || !pastDataRes.ok) {
    throw new Error("Fetch to weather api failed");
  }
  return {
    props: {
      initialForecastWeatherData: await currentDataRes.json(),
      initialCity: city,
      initialPastWeatherData: await pastDataRes.json(),
    },
  };
};
