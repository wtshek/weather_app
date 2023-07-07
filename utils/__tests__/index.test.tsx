import {
  getTodayDateString,
  getCurrentForecastWeatherDataUrl,
  getPastForecastWeatherDataUrl,
  convertPastWeatherDataToChartUsable,
} from "../index";

describe("Utils Test Suite", () => {
  const pastWeatherData = {
    latitude: 40.710335,
    longitude: -73.99307,
    generationtime_ms: 1.3229846954345703,
    utc_offset_seconds: -14400,
    timezone: "America/New_York",
    timezone_abbreviation: "EDT",
    elevation: 32,
    daily_units: {
      time: "iso8601",
      temperature_2m_max: "°C",
      temperature_2m_min: "°C",
    },
    daily: {
      time: [
        "2023-07-02",
        "2023-07-03",
        "2023-07-04",
        "2023-07-05",
        "2023-07-06",
        "2023-07-07",
        "2023-07-08",
        "2023-07-09",
        "2023-07-10",
        "2023-07-11",
        "2023-07-12",
        "2023-07-13",
      ],
      temperature_2m_max: [
        30.2, 32.3, 26.9, 33.5, 32.3, 31, 32.4, 26.7, 29.8, 30.1, 31.1, 30.3,
      ],
      temperature_2m_min: [
        21, 22.1, 23, 21.7, 22.9, 22.1, 22.1, 22.4, 21.9, 21.9, 24.1, 22.9,
      ],
    },
  };

  it("should return the correct url for getting the current weather data", () => {
    const urlNewYork = getCurrentForecastWeatherDataUrl("New York");
    expect(urlNewYork).toStrictEqual(
      "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&hourly=temperature_2m&start_date=2023-07-07&end_date=2023-07-07&timezone=America%2FNew_York"
    );

    const urlParis = getCurrentForecastWeatherDataUrl("Paris");
    expect(urlParis).toStrictEqual(
      "https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&hourly=temperature_2m&start_date=2023-07-07&end_date=2023-07-07&timezone=Europe%2FParis"
    );
  });
  it("should return the correct url for getting the past weather data", () => {
    const urlNewYork = getPastForecastWeatherDataUrl("New York");
    expect(urlNewYork).toStrictEqual(
      "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&daily=temperature_2m_max%2Ctemperature_2m_min&timezone=America%2FNew_York&past_days=5"
    );
  });

  it("should get the date in YYYY-MM-DD format", () => {
    const mockDate = new Date("2023-07-07T12:00:00");
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as Date);

    // Call the function
    const formattedDate = getTodayDateString();

    // Verify the result
    expect(formattedDate).toBe("2023-07-07");
  });

  it("should convert data to the desired format", () => {
    expect(convertPastWeatherDataToChartUsable(pastWeatherData)).toEqual([
      { date: "2023-07-02", minTemp: 21, maxTemp: 30.2 },
      { date: "2023-07-03", minTemp: 22.1, maxTemp: 32.3 },
      { date: "2023-07-04", minTemp: 23, maxTemp: 26.9 },
      { date: "2023-07-05", minTemp: 21.7, maxTemp: 33.5 },
      { date: "2023-07-06", minTemp: 22.9, maxTemp: 32.3 },
      { date: "2023-07-07", minTemp: 22.1, maxTemp: 31 },
      { date: "2023-07-08", minTemp: 22.1, maxTemp: 32.4 },
      { date: "2023-07-09", minTemp: 22.4, maxTemp: 26.7 },
      { date: "2023-07-10", minTemp: 21.9, maxTemp: 29.8 },
      { date: "2023-07-11", minTemp: 21.9, maxTemp: 30.1 },
      { date: "2023-07-12", minTemp: 24.1, maxTemp: 31.1 },
      { date: "2023-07-13", minTemp: 22.9, maxTemp: 30.3 },
    ]);
  });
});
