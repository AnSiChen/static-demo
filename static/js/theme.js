document.addEventListener("DOMContentLoaded", () => {

    const themeSwitch = document.getElementById("theme-switch");

    if (!themeSwitch) return;


    const THEMES = {
        lightmode: {
            className: "theme-lightmode",
            icon: "☼"
        },
        darkmode: {
            className: "theme-darkmode",
            icon: "☾"
        }
    };


    function applyTheme(theme) {

        document.documentElement.className = THEMES[theme].className;

        themeSwitch.textContent = THEMES[theme].icon;

        localStorage.setItem("selectedTheme", theme);

    }


    let currentTheme =
        localStorage.getItem("selectedTheme") || "lightmode";

    applyTheme(currentTheme);


    themeSwitch.addEventListener("click", () => {

        currentTheme =
            currentTheme === "lightmode"
                ? "darkmode"
                : "lightmode";

        applyTheme(currentTheme);

    });

});