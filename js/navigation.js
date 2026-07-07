/* ==========================
        INITIALIZE NAVIGATION
========================== */

function initializeNavigation() {

    const navItems = document.querySelectorAll(".nav-item");

    const sections = document.querySelectorAll(".page-section");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const targetSection = item.dataset.section;

            /* Remove Active Navigation */

            navItems.forEach(nav => {

                nav.classList.remove("active");

            });

            item.classList.add("active");

            /* Hide All Sections */

            sections.forEach(section => {

                section.classList.remove("active-section");

                section.classList.add("hidden");

            });

            /* Show Selected Section */

            const activeSection = document.getElementById(
                `${targetSection}-section`
            );

            if (activeSection) {

                requestAnimationFrame(() => {

                activeSection.classList.remove("hidden");

                activeSection.classList.add("active-section");

                });

            }

        });

    });

}