
function createCloudAnimation(container){

    for(let i=0;i<4;i++){

        const cloud = document.createElement("span");

        cloud.className = "cloud";

        cloud.style.top =
            Math.random()*70 + "%";

        cloud.style.animationDuration =
            25 + Math.random()*20 + "s";

        cloud.style.animationDelay =
            Math.random()*8 + "s";

        container.appendChild(cloud);

    }

}

// function createBubbleAnimation(container){

//     for(let i=0;i<25;i++){

//         const bubble = document.createElement("span");

//         bubble.className = "bubble";

//         const size = 4 + Math.random()*8;

//         bubble.style.width = size + "px";
//         bubble.style.height = size + "px";

//         bubble.style.left =
//             Math.random()*100 + "%";

//         bubble.style.bottom = "-20px";

//         bubble.style.animationDuration =
//             6 + Math.random()*5 + "s";

//         bubble.style.animationDelay =
//             Math.random()*8 + "s";

//         container.appendChild(bubble);

//     }

// }

function createBubbleAnimation(container){

    for(let i = 0; i < 25; i++){

        const bubble = document.createElement("span");

        bubble.className = "bubble";

        const size = 15 + Math.random() * 60;

        bubble.style.width = size + "px";
        bubble.style.height = size + "px";

        bubble.style.left = Math.random() * 100 + "%";

        bubble.style.bottom = (-100 - Math.random()*300) + "px";

        bubble.style.animationDuration =
            10 + Math.random() * 10 + "s";

        bubble.style.animationDelay =
            Math.random() * 8 + "s";

        container.appendChild(bubble);

    }

}


function createSparkAnimation(container){

    for(let i=0;i<30;i++){

        const spark = document.createElement("span");

        spark.className = "spark";

        const size = 3 + Math.random() * 5;

        spark.style.width = size + "px";
        spark.style.height = size + "px";

        spark.style.left = Math.random() * 100 + "%";
        spark.style.bottom = "-20px";

        spark.style.animationDuration =
            5 + Math.random() * 4 + "s";

        spark.style.animationDelay =
            Math.random() * 8 + "s";

        container.appendChild(spark);

    }

}

// function createStarsAnimation(container){

//     for(let i=0;i<80;i++){

//         const star = document.createElement("span");

//         star.className = "star";

//         const size = 1 + Math.random()*4;

//         star.style.width = size + "px";

//         star.style.height = size + "px";

//         star.style.left =
//             Math.random()*100 + "%";

//         star.style.top =
//             Math.random()*100 + "%";

//         star.style.animationDuration =
//             2 + Math.random()*5 + "s";

//         star.style.animationDelay =
//             Math.random()*5 + "s";

//             star.style.opacity =
//     .2 + Math.random()*.8;

// star.style.filter =
//     `blur(${Math.random()}px)`;

//     if(Math.random()>.7){

//     star.classList.add("moving");

// }

//         container.appendChild(star);

//     }

// }

function createStarsAnimation(container){

    for(let i = 0; i < 80; i++){

        const star = document.createElement("span");

        star.className = "star";

        star.style.left = Math.random()*100+"%";

        star.style.top = Math.random()*100+"%";

        const size = 1 + Math.random()*3;

        star.style.width = size+"px";
        star.style.height = size+"px";

        star.style.animationDelay =
            Math.random()*4+"s";

        star.style.animationDuration =
            2+Math.random()*3+"s";

        container.appendChild(star);

    }

}

function createAuroraAnimation(container){

    for(let i = 0; i < 3; i++){

        const wave = document.createElement("div");

        wave.className = "aurora-wave";

        wave.style.top =
            (15 + i * 25) + "%";

        wave.style.left = "-30%";

        wave.style.animationDuration =
            (18 + i * 5) + "s";

        wave.style.animationDelay =
            (-i * 4) + "s";

        container.appendChild(wave);

    }

}


function createLeavesAnimation(container){

    for(let i = 0; i < 22; i++){

        const leaf = document.createElement("span");

        leaf.className = "leaf";

        leaf.style.left = Math.random()*100+"%";

        leaf.style.top = (-100-Math.random()*300)+"px";

        leaf.style.animationDelay =
            Math.random()*6+"s";

        leaf.style.animationDuration =
            8+Math.random()*8+"s";

        leaf.style.transform =
            `rotate(${Math.random()*360}deg)`;

        container.appendChild(leaf);

    }

}


function createPetalAnimation(container){

    for(let i=0;i<30;i++){

        const petal=document.createElement("span");

        petal.className="petal";

        petal.style.left=Math.random()*100+"%";

        petal.style.top=(-100-Math.random()*400)+"px";

        petal.style.animationDuration=
            8+Math.random()*6+"s";

        petal.style.animationDelay=
            Math.random()*6+"s";

        container.appendChild(petal);

    }

}

function createSteamAnimation(container){

    for(let i = 0; i < 20; i++){

        const steam = document.createElement("span");

        steam.className = "steam";

        steam.style.left =
            15 + Math.random() * 70 + "%";

        steam.style.bottom =
            "-60px";

        steam.style.animationDelay =
            Math.random() * 5 + "s";

        steam.style.animationDuration =
            5 + Math.random() * 3 + "s";

        steam.style.opacity =
            0.2 + Math.random() * 0.4;

        container.appendChild(steam);

    }

}

function createLavenderAnimation(container){

    for(let i = 0; i < 55; i++){

        const particle = document.createElement("span");

        particle.className = "lavender-particle";

        particle.style.left =
            Math.random()*100+"%";

        particle.style.top =
            Math.random()*100+"%";

        particle.style.animationDelay =
            Math.random()*6+"s";

        particle.style.animationDuration =
            5+Math.random()*6+"s";

        container.appendChild(particle);

    }

}


function createNeonAnimation(container){

    for(let i = 0; i < 12; i++){

        const line = document.createElement("span");

        line.className = "neon-line";

        line.style.top =
            i * 10 + "%";

        line.style.animationDelay =
            Math.random()*5+"s";

        container.appendChild(line);

    }

    for(let i = 0; i < 10; i++){

        const line = document.createElement("span");

        line.className = "neon-line-vertical";

        line.style.left =
            i * 10 + "%";

        line.style.animationDelay =
            Math.random()*5+"s";

        container.appendChild(line);

    }

}