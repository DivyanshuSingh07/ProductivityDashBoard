/* ==========================
        INITIALIZE WEATHER
========================== */

function initializeWeather() {
  const searchBtn = document.getElementById("search-weather");

  const locationBtn = document.getElementById("current-location");

  if (searchBtn) {
    searchBtn.addEventListener(
      "click",

      searchCityWeather,
    );
  }

  if (locationBtn) {
    locationBtn.addEventListener(
      "click",

      getCurrentLocationWeather,
    );
  }

  const cityInput = document.getElementById("city-input");

  loadSavedWeather(); //Error


  if (cityInput) {
    cityInput.addEventListener(
      "keydown",

      (event) => {
        if (event.key === "Enter") {
          searchCityWeather();
        }
      },
    );
  }
}

function loadSavedWeather() {

    const user = getCurrentUser();

    if (!user || !user.weather) return;

    if (user.weather.temperature === null) return;

    document.getElementById("dashboard-weather-temp").textContent =
        `${user.weather.temperature}°C`; //Error

    document.getElementById("weather-city").textContent =
        user.weather.city;

    document.getElementById("weather-temp").textContent =
        user.weather.temperature;

    document.getElementById("weather-description").textContent =
        user.weather.description;

}

/* ==========================
        SEARCH WEATHER
========================== */

async function searchCityWeather() {
  const city = document.getElementById("city-input").value.trim();

  if (city === "") {
    showToast(
      "Enter a city name",

      "error",
    );

    return;
  }

  try {
    showWeatherLoader(true);

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`,
    );

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error();
    }

    const location = data.results[0];

    await fetchWeather(
      location.latitude,

      location.longitude,

      `${location.name}, ${location.country}` ||
        `${location.name}, ${location.admin1}`,
    );
  } catch {
    showToast(
      "City not found",

      "error",
    );

    showWeatherLoader(false);
  }
}

/* ==========================
        CURRENT LOCATION
========================== */

function getCurrentLocationWeather() {
  if (!navigator.geolocation) {
    showToast(
      "Geolocation is not supported.",

      "error",
    );

    return;
  }

  showWeatherLoader(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather(
        position.coords.latitude,

        position.coords.longitude,

        "Current Location",
      );
    },

    () => {
      showWeatherLoader(false);

      showToast(
        "Unable to access location.",

        "error",
      );
    },
  );
}

/* ==========================
        FETCH WEATHER
========================== */

async function fetchWeather(
  latitude,

  longitude,

  city,
) {
  try {
    const response = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,visibility,is_day&daily=sunrise,sunset&timezone=auto`
);

    const data = await response.json();

    if (city === "Current Location") {
      city = await getCityName(
        latitude,

        longitude,
      );
    }

    renderWeather(
    city,
    data.current,
    data.daily
);

    document.getElementById("city-input").value = "";
  } catch {
    showToast(
      "Unable to load weather",

      "error",
    );
  } finally {
    showWeatherLoader(false);
  }
}

/* ==========================
        RENDER WEATHER
========================== */

function renderWeather(
    city,
    weather,
    daily
){

    document.getElementById(
        "weather-city"
    ).textContent = city;

    const temperature =
        Math.round(
            weather.temperature_2m
        );

    const user =
        getCurrentUser();

    if(user){

        user.weather = {

            city,

            temperature,

            description:
                getWeatherDescription(
                    weather.weather_code
                ),

            feelsLike:
                Math.round(
                    weather.apparent_temperature
                ),

            humidity:
                weather.relative_humidity_2m,

            wind:
                weather.wind_speed_10m,

            pressure:
                Math.round(
                    weather.surface_pressure
                ),

            visibility:
                Math.round(
                    weather.visibility / 1000
                ),

            weatherCode:
                weather.weather_code,

            isDay:
                weather.is_day === 1,

            sunrise:
                daily.sunrise[0],

            sunset:
                daily.sunset[0],

            updatedAt:
                new Date().toISOString()

        };

        console.log(
            "Weather Saved:",
            user.weather
        );

        updateCurrentUser(
            user
        );

        updateHeroWeather(
            user.weather
        );

    }

    document.getElementById(
        "weather-temp"
    ).textContent =
        temperature;

    const dashboardTemp =
        document.getElementById(
            "dashboard-weather-temp"
        );

    if(dashboardTemp){

        dashboardTemp.textContent =
            `${temperature}°C`;

    }

    document.getElementById(
        "feels-like"
    ).textContent =
        `${Math.round(
            weather.apparent_temperature
        )}°C`;

    document.getElementById(
        "humidity"
    ).textContent =
        `${weather.relative_humidity_2m}%`;

    document.getElementById(
        "wind-speed"
    ).textContent =
        `${weather.wind_speed_10m} km/h`;

    document.getElementById(
        "weather-description"
    ).textContent =
        getWeatherDescription(
            weather.weather_code
        );

    getWeatherIcon(
        weather.weather_code
    );

}

/* ==========================
        WEATHER TEXT
========================== */

function getWeatherDescription(code) {
  const codes = {
    0: "Clear Sky",

    1: "Mainly Clear",

    2: "Partly Cloudy",

    3: "Overcast",

    45: "Fog",

    48: "Fog",

    51: "Light Drizzle",

    53: "Drizzle",

    55: "Heavy Drizzle",

    61: "Light Rain",

    63: "Rain",

    65: "Heavy Rain",

    71: "Snow",

    80: "Rain Showers",

    95: "Thunderstorm",
  };

  return codes[code] || "Unknown";
}

/* ==========================
        WEATHER ICON
========================== */

function getWeatherIcon(code) {
  const icon = document.getElementById("weather-icon");

  icon.className = "";

  if (code === 0) {
    icon.classList.add("ri-sun-fill");
  } else if (code <= 3) {
    icon.classList.add("ri-cloudy-fill");
  } else if (code >= 45 && code <= 48) {
    icon.classList.add("ri-mist-fill");
  } else if (code >= 51 && code <= 67) {
    icon.classList.add("ri-drizzle-fill");
  } else if (code >= 71 && code <= 77) {
    icon.classList.add("ri-snowy-fill");
  } else if (code >= 80 && code <= 82) {
    icon.classList.add("ri-rainy-fill");
  } else if (code >= 95) {
    icon.classList.add("ri-thunderstorms-fill");
  } else {
    icon.classList.add("ri-cloud-fill");
  }
}

/* ==========================
        LOADER
========================== */

function showWeatherLoader(show) {
  const loader = document.getElementById("weather-loader");

  if (!loader) return;

  loader.classList.toggle(
    "hidden",

    !show,
  );
}

/* ==========================
        REVERSE GEOCODING
========================== */

async function getCityName(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );

    const data = await response.json();

    return data.city
      ? `${data.city}, ${data.principalSubdivision}`
      : data.locality || data.principalSubdivision || "Current Location";
  } catch {
    return "Current Location";
  }
}
  
