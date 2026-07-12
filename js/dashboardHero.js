/* =====================================================
                    HERO CONFIGURATION
===================================================== */

const dashboardThemes = {

    morning:{

    title:"Morning",

    subtitle:"Rise, shine and build something amazing today.",

    focus:"Fresh Start",

    gradient:"linear-gradient(135deg,#F6D365,#FDA085)",

    animation:"sunlight",

    wallpaper:null,

    textColor:"#ffffff"

},
    day:{

    title:"Blue Sky",

    subtitle:"Keep the momentum going.",

    focus:"Deep Work",

    gradient:"linear-gradient(135deg,#56CCF2,#2F80ED)",

    animation:"bubble",

    wallpaper:null,

    textColor:"#ffffff"

},
   evening:{

    title:"Sunset",

    subtitle:"Finish strong.",

    focus:"Reflection",

    gradient:"linear-gradient(135deg,#F2994A,#EB5757)",

    animation:"spark",

    wallpaper:null,

    textColor:"#ffffff"

},

    night:{

    title:"Midnight",

    subtitle:"Dream big.",

    focus:"Recharge",

    gradient:"linear-gradient(135deg,#141E30,#243B55)",

    animation:"stars",

    wallpaper:null,

    textColor:"#ffffff"

},

    aurora:{

    title:"Aurora",

    subtitle:"Inspired by the Northern Lights.",

    focus:"Creativity",

    gradient:"linear-gradient(135deg,#00C9A7,#845EC2,#2C73D2)",

    animation:"aurora",

    wallpaper:null,

    textColor:"#ffffff"

},

    ocean:{

    title:"Ocean",

    subtitle:"Calm mind. Clear thoughts.",

    focus:"Flow State",

    gradient:"linear-gradient(135deg,#2193b0,#6dd5ed)",

    animation:"bubble",

    wallpaper:null,

    textColor:"#ffffff"

},

    forest:{

    title:"Forest",

    subtitle:"Stay grounded.",

    focus:"Growth",

    gradient:"linear-gradient(135deg,#134E5E,#71B280)",

    animation:"leaves",

    wallpaper:null,

    textColor:"#ffffff"

},

    sakura:{

    title:"Sakura",

    subtitle:"Soft & Peaceful.",

    focus:"Balance",

    gradient:"linear-gradient(135deg,#FBD3E9,#BB377D)",

    animation:"petals",

    wallpaper:null,

    textColor:"#ffffff"

},

    galaxy:{

    title:"Galaxy",

    subtitle:"Explore limitless ideas.",

    focus:"Innovation",

    gradient:"linear-gradient(135deg,#41295a,#2F0743)",

    animation:"stars",

    wallpaper:null,

    textColor:"#ffffff"

},

    lavender:{

    title:"Lavender",

    subtitle:"Relax and breathe.",

    focus:"Mindfulness",

    gradient:"linear-gradient(135deg,#C471ED,#F64F59)",

    animation:"lavender",

    wallpaper:null,

    textColor:"#ffffff"

},

    coffee:{

    title:"Coffee",

    subtitle:"Fuel your focus.",

    focus:"Productivity",

    gradient:"linear-gradient(135deg,#603813,#b29f94)",

    animation:"steam",

    wallpaper:null,

    textColor:"#ffffff"

},

    cyberpunk:{

    title:"Cyberpunk",

    subtitle:"Code the future.",

    focus:"Innovation",

    gradient:"linear-gradient(135deg,#ff00cc,#333399)",

    animation:"neon",

    wallpaper:null,

    textColor:"#ffffff"

},

};

/* =====================================================
                    HERO STATE
===================================================== */

const heroState = {

    mode:"auto",

    activeTheme:null,

    activeAnimation:null,

    wallpaper:"gradient"

};

/* =====================================================
                TIME ENGINE
===================================================== */

function getCurrentTimeTheme(){

    const hour = new Date().getHours();

    if(hour >= 5 && hour < 10){

        return "morning";

    }

    if(hour >= 10 && hour < 16){

        return "day";

    }

    if(hour >= 16 && hour < 19){

        return "evening";

    }

    return "night";

}
/* =====================================================
                    HERO UI
===================================================== */

function updateHeroContent(){

}

/* =====================================================
                    HERO BACKGROUND
===================================================== */

function updateHeroBackground(){

}

/* =====================================================
                    THEME APPLICATION
===================================================== */

function applyHeroTheme(themeName){


    const theme = dashboardThemes[themeName];

    if(!theme){

        return;

    }

    heroState.activeTheme = themeName;

    heroState.activeAnimation = theme.animation;

    document.documentElement.style.setProperty(

    "--hero-bg",

    theme.gradient

);

document.documentElement.style.setProperty(

    "--hero-text",

    theme.textColor

);

    document.getElementById("hero-title").textContent =
        theme.title;

    document.getElementById("hero-description").textContent =
        theme.subtitle;

    document.getElementById("hero-focus").textContent =
        theme.focus;

        runHeroAnimation(

    heroState.activeAnimation

);

}

/* =====================================================
                WALLPAPER ENGINE
===================================================== */

function initializeWallpaperPicker(){

    const openBtn = document.getElementById(

        "change-wallpaper-btn"

    );

    const closeBtn = document.getElementById(

        "close-wallpaper-modal"

    );

    openBtn.addEventListener(

        "click",

        openWallpaperModal

    );

    closeBtn.addEventListener(

        "click",

        closeWallpaperModal

    );

    renderWallpaperGallery();

}

function openWallpaperModal(){

    document

        .getElementById(

            "wallpaper-modal"

        )

        .classList.remove("hidden");

}
function closeWallpaperModal(){

    document

        .getElementById(

            "wallpaper-modal"

        )

        .classList.add("hidden");

}
function renderWallpaperGallery(){

    const grid = document.getElementById(

        "wallpaper-grid"

    );

    grid.innerHTML = "";

    heroWallpapers.forEach((wallpaper)=>{

        const card = document.createElement("div");

        card.className =

        `theme-card ${
            heroState.wallpaper === wallpaper.id
            ? "active"
            : ""
        }`;

        card.innerHTML = `

            <div
                class="theme-preview"
                style="
                    background:${
                        wallpaper.image
                        ? `url(${wallpaper.image}) center/cover`
                        : "var(--hero-bg)"
                    };
                "
            >

            </div>

            <div class="theme-name">

                ${wallpaper.title}

            </div>

        `;

        card.onclick = ()=>{

            applyWallpaper(

                wallpaper.id

            );

            saveWallpaper();

            renderWallpaperGallery();

            closeWallpaperModal();

        };

        grid.appendChild(card);

    });

}
function applyWallpaper(wallpaperId){

    const wallpaper = heroWallpapers.find(

        item => item.id === wallpaperId

    );

    if(!wallpaper){

        return;

    }

    heroState.wallpaper = wallpaperId;

    const hero = document.querySelector(

        ".dashboard-hero"

    );

    if(wallpaper.image){

        hero.style.backgroundImage = `url(${wallpaper.image})`;

        hero.style.backgroundSize = "cover";

        hero.style.backgroundPosition = "center";

        hero.style.backgroundRepeat = "no-repeat";

    }

    else{

        hero.style.backgroundImage = "";

        hero.style.background = "var(--hero-bg)";

    }

}

function saveWallpaper(){

    saveHeroSettings();

}

function loadWallpaper(){

    const user = getCurrentUser();

    if(!user){

        return;

    }

    if(!user.heroSettings){

        return;

    }

    heroState.wallpaper =

        user.heroSettings.selectedWallpaper

        ||

        "gradient";

}

/* =====================================================
                SAVE HERO SETTINGS
===================================================== */

function saveHeroSettings(){

    const user = getCurrentUser();

if(!user){

    return;

}

if(!user.heroSettings){

    user.heroSettings = {};

}

    user.heroSettings.mode = heroState.mode;

    user.heroSettings.selectedTheme = heroState.activeTheme;

    user.heroSettings.animation = heroState.activeAnimation;

    user.heroSettings.selectedWallpaper = heroState.wallpaper;

    updateCurrentUser(user);

}

/* =====================================================
                LOAD HERO SETTINGS
===================================================== */

function loadHeroSettings(){

    const user = getCurrentUser();

    if(!user){

        return;

    }

    if(!user.heroSettings){

        return;

    }

    heroState.mode =
        user.heroSettings.mode || "auto";

    heroState.activeTheme =
        user.heroSettings.selectedTheme;

    heroState.wallpaper =
        user.heroSettings.selectedWallpaper;

    heroState.activeAnimation =
        user.heroSettings.animation;

}

/* =====================================================
                    THEME PICKER
===================================================== */


function initializeHeroThemePicker(){

    const openBtn =
        document.getElementById(
            "change-theme-btn"
        );

    const closeBtn =
        document.getElementById(
            "close-theme-modal"
        );

    openBtn.addEventListener(

        "click",

        openThemeModal

    );

    closeBtn.addEventListener(

        "click",

        closeThemeModal

    );

    renderThemeGallery();

}

function renderThemeGallery(){

    const grid =
        document.getElementById(
            "theme-grid"
        );

    grid.innerHTML="";

    Object.entries(dashboardThemes)

    .forEach(

        ([key,theme])=>{

            const card =
                document.createElement("div");

            card.className=

                `theme-card ${
                    heroState.activeTheme===key
                    ? "active"
                    : ""
                }`;

            card.innerHTML=`

                <div

                    class="theme-preview"

                    style="
                        background:
                        ${theme.gradient}
                        "

                >

                </div>

                <div class="theme-name">

    ${theme.title}

</div>

<div
    style="
    text-align:center;
    padding-bottom:15px;
    opacity:.7;
    font-size:.85rem;
    "
>

    ${theme.focus}

</div>

            `;

            card.onclick = () => {

    heroState.mode = "manual";

applyHeroTheme(key);

saveHeroSettings();

renderThemeGallery();

closeThemeModal();

};

            grid.appendChild(card);

        }

    );

}

function openThemeModal(){

    document

        .getElementById("theme-modal")

        .classList.remove("hidden");

}

function closeThemeModal(){

    document

        .getElementById("theme-modal")

        .classList.add("hidden");

}



/* =====================================================
                HERO ANIMATION ENGINE
===================================================== */

function clearHeroAnimation(){

    const container = document.getElementById(

        "hero-animation"

    );

    container.innerHTML = "";

}

function runHeroAnimation(type){

    clearHeroAnimation();

    const container =

        document.getElementById(

            "hero-animation"

        );

    switch(type){

        case "sunlight":

            createSunlightAnimation(container);

            break;

        case "bubble":

    createCloudAnimation(container);

    createBubbleAnimation(container);

    break;

        case "spark":

            createSparkAnimation(container);

            break;

        case "stars":

            createStarsAnimation(container);

            break;

        case "leaves":

            createLeavesAnimation(container);

            break;

        case "petals":

            createPetalAnimation(container);

            break;

        case "aurora":

            createAuroraAnimation(container);

            break;

        case "steam":

            createSteamAnimation(container);

            break;

        case "neon":

            createNeonAnimation(container);

            break;
        case "lavender":

    createLavenderAnimation(container);

    break;

    }

}

function createSunlightAnimation(container){

    for(let i=0;i<18;i++){

        const ray = document.createElement("span");

        ray.className = "sun-ray";

        ray.style.left =
            Math.random()*100+"%";

        ray.style.top =
            Math.random()*100+"%";

        ray.style.animationDelay =
            Math.random()*6+"s";

        ray.style.animationDuration =
            5+Math.random()*5+"s";

        container.appendChild(ray);

    }

}



/* =====================================================
                    INITIALIZATION
===================================================== */

function initializeDashboardHero(){

    loadHeroSettings();

    initializeHeroThemePicker();

    initializeWallpaperPicker();

    if(

        heroState.mode==="manual"

        &&

        heroState.activeTheme

    ){

        applyHeroTheme(heroState.activeTheme);

    }

    else{

        heroState.mode="auto";

        applyHeroTheme(getCurrentTimeTheme());

    }

    applyWallpaper(heroState.wallpaper);

}

const  heroWallpapers = [
    {

    id:"gradient",

    title:"Theme Gradient",

    image:null

},

{

    id:"mountains",

    title:"Mountains",

    image:"./assets/wallpapers/mountains.jpg"

},

{

    id:"ocean",

    title:"Ocean",

    image:"./assets/wallpapers/ocean.jpg"

},

{

    id:"forest",

    title:"Forest",

    image:"./assets/wallpapers/forest.jpg"

},

{

    id:"night",

    title:"Night Sky",

    image:"./assets/wallpapers/night.jpg"

},

{

    id:"city",

    title:"City Lights",

    image:"./assets/wallpapers/city.jpg"

}

];