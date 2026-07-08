/* ==========================
        INITIALIZE QUOTES
========================== */

function initializeQuotes() {

    const copyBtn =

    document.getElementById("copy-quote");

const favoriteBtn =

    document.getElementById("favorite-quote");

if(copyBtn){

    copyBtn.addEventListener(

        "click",

        copyQuote

    );

}

if(favoriteBtn){

    favoriteBtn.addEventListener(

        "click",

        saveFavoriteQuote

    );

}

renderFavoriteQuotes();

    const refreshBtn =
        document.getElementById("refresh-quote");

    if(refreshBtn){

        refreshBtn.addEventListener(
            "click",
            fetchQuote
        );

    }

    loadQuoteOfTheDay();

}


/* ==========================
        QUOTE OF THE DAY
========================== */

function loadQuoteOfTheDay() {

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const savedQuote = JSON.parse(

        localStorage.getItem("quoteOfDay")

    );

    if (

        savedQuote &&

        savedQuote.date === today

    ) {

        displayQuote(savedQuote);

        return;

    }

    fetchQuote();

}

/* ==========================
        LOADING
========================== */

function setLoading(isLoading){

    const loader =
        document.getElementById("quote-loader");

    const quote =
        document.getElementById("quote-text");

    const author =
        document.getElementById("quote-author");

    if(isLoading){

        loader.classList.remove("hidden");

        quote.style.opacity=".3";

        author.style.opacity=".3";

    }

    else{

        loader.classList.add("hidden");

        quote.style.opacity="1";

        author.style.opacity="1";

    }

}

/* ==========================
        FETCH QUOTE
========================== */
async function fetchQuote() {

    setLoading(true);

    try {

        const response = await fetch(

            "https://dummyjson.com/quotes/random"

        );

        if (!response.ok) {

            throw new Error("Failed to fetch quote");

        }

        const quote = await response.json();

        displayQuote(quote);

        const today = new Date()
            .toISOString()
            .split("T")[0];

        localStorage.setItem(

            "quoteOfDay",

            JSON.stringify({

                date: today,

                quote: quote.quote,

                author: quote.author

            })

        );

    }

    catch (error) {

        console.error(error);

        displayFallbackQuote();

        showToast(

            "Couldn't load quote",

            "error"

        );

    }

    finally {

        setLoading(false);

    }

}

/* ==========================
        DISPLAY QUOTE
========================== */

function displayQuote(quote){

    document.getElementById("quote-text").textContent =

        `"${quote.quote}"`;

    document.getElementById("quote-author").textContent =

        `— ${quote.author}`;

}

/* ==========================
        FALLBACK QUOTE
========================== */

function displayFallbackQuote() {

    document.getElementById("quote-text").textContent =

        `"Success is the sum of small efforts, repeated day in and day out."`;

    document.getElementById("quote-author").textContent =

        "— Robert Collier";

}


/* ==========================
        COPY QUOTE
========================== */

async function copyQuote(){

    const quote =

        document.getElementById("quote-text").textContent;

    const author =

        document.getElementById("quote-author").textContent;

    try{

        await navigator.clipboard.writeText(

            `${quote}\n${author}`

        );

        showToast(

            "Quote copied!"

        );

    }

    catch{

        showToast(

            "Unable to copy quote",

            "error"

        );

    }

}

/* ==========================
        SAVE FAVORITE
========================== */

function saveFavoriteQuote(){

    const user = getCurrentUser();

    if(!user) return;

    if(!user.favoriteQuotes){

        user.favoriteQuotes = [];

    }

    const quote =

        document.getElementById("quote-text").textContent;

    const author =

        document.getElementById("quote-author").textContent;

    const exists =

        user.favoriteQuotes.some(

            item => item.quote === quote

        );

    if(exists){

        showToast(

            "Already in favorites",

            "error"

        );

        return;

    }

    user.favoriteQuotes.push({

        id: generateId(),

        quote,

        author

    });

    updateCurrentUser(user);

    renderFavoriteQuotes();

    showToast(

        "Added to favorites!"

    );

}

/* ==========================
        RENDER FAVORITES
========================== */

function renderFavoriteQuotes(){

    const user = getCurrentUser();

    if(!user) return;

    const container =

        document.getElementById(

            "favorite-quotes-list"

        );

    if(!container) return;

    container.innerHTML = "";

    if(

        !user.favoriteQuotes ||

        user.favoriteQuotes.length === 0

    ){

        container.innerHTML =

            "<p>No favorite quotes yet.</p>";

        return;

    }

    user.favoriteQuotes.forEach(item=>{

        const card =

            document.createElement("div");

        card.className =

            "favorite-quote";

        card.innerHTML = `

            <p>${item.quote}</p>

            <span>${item.author}</span>

            <button
                class="delete-favorite"
                data-id="${item.id}"
            >

                <i class="ri-delete-bin-line"></i>

            </button>

        `;

        container.appendChild(card);

    });

    initializeFavoriteDelete();

}

/* ==========================
        DELETE FAVORITE
========================== */

function initializeFavoriteDelete(){

    document

        .querySelectorAll(".delete-favorite")

        .forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    removeFavoriteQuote(

                        Number(

                            button.dataset.id

                        )

                    );

                }

            );

        });

}

function removeFavoriteQuote(id){

    const user = getCurrentUser();

    if(!user) return;

    user.favoriteQuotes =

        user.favoriteQuotes.filter(

            quote=>quote.id!==id

        );

    updateCurrentUser(user);

    renderFavoriteQuotes();

    showToast(

        "Favorite removed."

    );

}