const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links-side');
    const navLinks = document.querySelector('.nav-links-side li');
    var panel2 = document.getElementsByClassName("accordion");

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        if (panel2.style.display === "block") {
            panel2.style.display = "none";
        }
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ` `;
            } else {
                link.style.animation = `linkAnime 0.5s ease forward ${index / 7 +1.5}s`;
            }
        });
    });
};

navSlide();