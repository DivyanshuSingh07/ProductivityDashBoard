// /* ==========================================
//         HERO WEATHER
// ========================================== */



/* ==========================================
        HERO WEATHER
========================================== */

function initializeHeroWeather(){

    renderHeroWeather();

}

function renderHeroWeather(){

    const user = getCurrentUser();

    if(!user || !user.weather){

        return;

    }

    if(user.weather.temperature === null){

        return;

    }

    updateHeroWeather(
        user.weather
    );

}

function updateHeroWeather(weather){

    document.getElementById(
        "hero-weather-temp"
    ).textContent =
        `${weather.temperature}°`;

    document.getElementById(
        "hero-weather-city"
    ).textContent =
        weather.city;

    document.getElementById(
        "hero-weather-condition"
    ).textContent =
        weather.description;

    document.getElementById(
        "hero-feels-like"
    ).textContent =
        `${weather.feelsLike}°C`;

    document.getElementById(
        "hero-humidity"
    ).textContent =
        `${weather.humidity}%`;

    document.getElementById(
        "hero-wind"
    ).textContent =
        `${weather.wind} km/h`;

    document.getElementById(
        "hero-pressure"
    ).textContent =
        `${weather.pressure} hPa`;

    document.getElementById(
        "hero-weather-time"
    ).textContent =
        formatWeatherTime(
            weather.updatedAt
        );

    document.getElementById(
        "hero-weather-message"
    ).textContent =
        getWeatherMessage(
            weather.description
        );

    updateHeroWeatherIcon(
        weather.weatherCode
    );

    setHeroWeatherTheme(
    weather.description,
    weather
);

}

function updateHeroWeatherIcon(code){

    const icon =
        document.getElementById(
            "hero-weather-icon"
        );

    if(!icon) return;

    icon.className = "";

    if(code === 0){

        icon.classList.add(
            "ri-sun-fill"
        );

    }

    else if(code <= 3){

        icon.classList.add(
            "ri-cloudy-fill"
        );

    }

    else if(code >=45 && code<=48){

        icon.classList.add(
            "ri-mist-fill"
        );

    }

    else if(code >=51 && code<=67){

        icon.classList.add(
            "ri-drizzle-fill"
        );

    }

    else if(code >=71 && code<=77){

        icon.classList.add(
            "ri-snowy-fill"
        );

    }

    else if(code >=80 && code<=82){

        icon.classList.add(
            "ri-rainy-fill"
        );

    }

    else if(code >=95){

        icon.classList.add(
            "ri-thunderstorms-fill"
        );

    }

    else{

        icon.classList.add(
            "ri-cloud-fill"
        );

    }
    

}


function formatWeatherTime(date){

    if(!date){

        return "--";

    }

    return new Date(date)
        .toLocaleTimeString([],
        {

            hour:"2-digit",

            minute:"2-digit"

        });

}

function getWeatherMessage(description){

    const text =
        description.toLowerCase();

    if(text.includes("clear")){

        return "Perfect weather to conquer today's goals.";

    }

    if(text.includes("cloud")){

        return "Cloudy skies, clear mind. Keep moving.";

    }

    if(text.includes("rain")){

        return "Rain outside. Productivity inside.";

    }

    if(text.includes("storm")){

        return "Storms pass. Consistency remains.";

    }

    if(text.includes("snow")){

        return "Stay warm and keep creating.";

    }

    if(text.includes("fog")){

        return "Small steps still move you forward.";

    }

    return "Every productive day starts with focus.";

}

function setHeroWeatherTheme(condition,weather){

    const card =
        document.querySelector(
            ".hero-weather-card"
        );

    if(!card){

        return;

    }

    const scene =
        document.getElementById(
            "hero-weather-scene"
        );

    card.className =
        "hero-weather-card";

    scene.innerHTML = "";

    const text =
        (condition || "")
        .toLowerCase();

    const night =
    weather &&
    weather.isDay === false;

    if(
    night &&
    !text.includes("storm") &&
    !text.includes("rain") &&
    !text.includes("fog")
){

    createNightScene(scene);

}

    if(text.includes("clear")){

    card.classList.add(
        night
            ? "weather-clear-night"
            : "weather-clear"
    );

    if(!night){

        createSunScene(scene);

    }

    createAtmosphere(
        scene,
        "clear"
    );

}

    else if(text.includes("cloud")){

    card.classList.add(
    night
        ? "weather-cloud-night"
        : "weather-cloud"
);
    createCloudScene(scene);

    if(!night){

        createSunScene(scene);

    }

    createAtmosphere(
        scene,
        "cloud"
    );

}

    else if(text.includes("rain")){

        card.classList.add(
            "weather-rain"
        );

        createRainScene(
            scene
        );

        createAtmosphere(
            scene,
            "rain"
        );

    }

    else if(text.includes("storm")){

        card.classList.add(
            "weather-storm"
        );

        createStormScene(
            scene
        );

        createAtmosphere(
            scene,
            "storm"
        );

    }

    else if(text.includes("snow")){

        card.classList.add(
            "weather-snow"
        );

        createSnowScene(
            scene
        );

        createAtmosphere(
            scene,
            "snow"
        );

    }

    else if(text.includes("fog")){

        card.classList.add(
            "weather-fog"
        );

        createFogScene(
            scene
        );

        createAtmosphere(
            scene,
            "fog"
        );

    }

    else{

        card.classList.add(
            "weather-default"
        );

        createCloudScene(
            scene
        );

    }

    console.log(
    "Night:",
    night,
    "Condition:",
    condition
);

}


function createSunScene(scene){

    const sun =
        document.createElement("div");

    sun.className =
        "hero-sun";

    scene.appendChild(sun);

}


function createNightScene(scene){

    createStars(scene);

    createMoon(scene);

}

function createMoon(scene){

    const moon =
        document.createElement("div");

    moon.className =
        "hero-moon";

    scene.appendChild(moon);

}

function createStars(scene){

    for(let i=0;i<80;i++){

        const star =
            document.createElement("span");

        star.className =
            "hero-star";

        star.style.left =
            Math.random()*100+"%";

        star.style.top =
            Math.random()*70+"%";

        star.style.animationDelay =
            Math.random()*5+"s";

        scene.appendChild(star);

    }

}




function createCloudScene(scene){

    createCloudLayer(scene,3,"near");

    createCloudLayer(scene,5,"middle");

    createCloudLayer(scene,8,"far");

}

function createCloudLayer(

    scene,

    count,

    layer

){

    for(let i=0;i<count;i++){

        const cloud =
            document.createElement("div");

        cloud.className =
            `hero-cloud ${layer}`;

        cloud.style.top =
            Math.random()*55+"%";

        cloud.style.left =
            (-300-Math.random()*500)+"px";

        cloud.style.animationDelay =
            Math.random()*12+"s";

        cloud.style.animationDuration =
            (18+Math.random()*10)+"s";

        scene.appendChild(cloud);

    }

}

function createRainScene(scene){

    createCloudScene(scene);

    for(let i=0;i<120;i++){

        const drop =
            document.createElement("span");

        drop.className =
            "hero-rain";

        drop.style.left =
            Math.random()*100 + "%";

        drop.style.animationDelay =
            Math.random()*3 + "s";

        drop.style.animationDuration =
            (.8+Math.random())+"s";

        scene.appendChild(drop);

    }

}

function createStormScene(scene){

    createRainScene(scene);

    const flash =
        document.createElement("div");

    flash.className =
        "hero-lightning";

    scene.appendChild(flash);

}

function createSnowScene(scene){

    for(let i=0;i<70;i++){

        const snow =
            document.createElement("span");

        snow.className =
            "hero-snow";

        snow.style.left =
            Math.random()*100 + "%";

        snow.style.animationDelay =
            Math.random()*5 + "s";

        snow.style.animationDuration =
            (4+Math.random()*5)+"s";

        scene.appendChild(snow);

    }

}

function createFogScene(scene){

    for(let i=0;i<8;i++){

        const fog =
            document.createElement("div");

        fog.className =
            "hero-fog";

        fog.style.top =
            i*12 + "%";

        fog.style.animationDelay =
            i+"s";

        scene.appendChild(fog);

    }

}


function createAtmosphere(scene,type){

    switch(type){

        case "clear":

            createParticles(
                scene,
                45,
                "hero-particle"
            );

        break;

        case "cloud":

            createParticles(
                scene,
                70,
                "hero-moisture"
            );

        break;

        case "rain":

            createParticles(
                scene,
                90,
                "hero-mist"
            );

        break;

        case "storm":

            createParticles(
                scene,
                120,
                "hero-dark-particle"
            );

        break;

        case "snow":

            createParticles(
                scene,
                60,
                "hero-ice-particle"
            );

        break;

        case "fog":

            createParticles(
                scene,
                80,
                "hero-fog-particle"
            );

        break;

    }

}


function createParticles(

    scene,

    count,

    className

){

    for(

        let i=0;

        i<count;

        i++

    ){

        const particle =

            document.createElement("span");

        particle.className =
            className;

        particle.style.left =
            Math.random()*100+"%";

        particle.style.top =
            Math.random()*100+"%";

        particle.style.animationDelay =
            Math.random()*8+"s";

        particle.style.animationDuration =
            (12+Math.random()*12)+"s";

        particle.style.opacity =
            (.2+Math.random()*.6);

        // particle.style.transform =
        //     `scale(${0.4+Math.random()*1.8})`;

        scene.appendChild(particle);

    }

}