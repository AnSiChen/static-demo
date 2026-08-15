const heroBackground = document.querySelector(".hero-background");

if (heroBackground && heroImages.length) {

    let index = 0;

    function changeBackground() {

        heroBackground.style.opacity = 0;

        setTimeout(() => {

            heroBackground.style.backgroundImage =
                `url("${heroImages[index]}")`;

            heroBackground.style.opacity = 0.18;

            index = (index + 1) % heroImages.length;

        }, 500);

    }

    changeBackground();

    setInterval(changeBackground, 4000);

}