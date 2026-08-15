const introOverlay = document.querySelector(".intro-overlay");

const overlay = document.querySelector(".hero-overlay");

// const topBar = document.querySelector(".bar-top");

// const bottomBar = document.querySelector(".bar-bottom");

const lineOne = document.querySelector(".line-one");

const lineTwo = document.querySelector(".line-two");

const heroContent = document.querySelector(".hero-content");

const heading = document.querySelector(".hero-heading-text");

const tagline = document.querySelector(".hero-tagline");

const actions = document.querySelector(".hero-actions");

function splitWords(element)
{
    const words = element.textContent
        .trim()
        .split(/\s+/);

    element.innerHTML = "";

    words.forEach((word, index) =>
    {
        const span = document.createElement("span");

        span.className = "hero-word";

        span.textContent = word;

        element.appendChild(span);

        if (index < words.length - 1)
        {
            element.appendChild(
                document.createTextNode(" ")
            );
        }
    });

    return element.querySelectorAll(".hero-word");
}

const words = splitWords(heading);
if (
    words &&
    introOverlay &&
    overlay &&
    // topBar &&
    // bottomBar &&
    lineOne &&
    lineTwo &&
    heroContent &&
    heading &&
    tagline &&
    actions
)
{

    /*gsap.set(topBar, {
        y: "-12vh"
    });

    gsap.set(bottomBar, {
        y: "12vh"
    });*/

    gsap.set(overlay, {
        opacity: 0.45
    });

    gsap.set(lineOne, {
        opacity: 0,
        filter: "blur(10px)"
    });

    gsap.set(lineTwo, {
        opacity: 0,
        filter: "blur(10px)"
    });

    gsap.set(words, {

        x: () => gsap.utils.random(-8, 8),

        y: () => gsap.utils.random(-12, 12),

        rotate: () => gsap.utils.random(-3, 3),

        opacity: 0.35,

        filter: "blur(3px)"

    });

    gsap.set(tagline, {

        opacity: 0.5,

        y: 8

    });

    //gsap.set(actions, {

      //  opacity: 0.6,

        //y: 8

    //});

    const timeline = gsap.timeline({
        paused: true,
        defaults: {
            ease: "power3.out"
        }
    });

    /* Letterbox in */

    timeline

    /*.to(topBar, {
        y: "12vh",
        duration: 0.7
    }, 0)

    .to(bottomBar, {
        y: "-12vh",
        duration: 0.7
    }, 0)*/

    .to(overlay, {

        opacity: 0.62,

        duration: 1.0,

        ease: "power2.inOut"

    }, 0)

    .to(window.leafWind, {

        speed: 1.35,

        sway: 1.7,

        rotation: 1.5,

        duration: 1.2,

        ease: "power2.out"

    }, "<")

    /* Phrase 1 */

    timeline

    .to(lineOne, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6
    })

    .to(lineOne, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.5
    }, "+=0.8");

    /* Phrase 2 */

    timeline

    .to(lineTwo, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6
    })

    .to(lineTwo, {
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.5
    }, "+=0.8");

    /* Return to normal */

    timeline

   /* .to(topBar, {
        y: "-12vh",
        duration: 0.8
    })

    .to(bottomBar, {
        y: "12vh",
        duration: 0.8
    }, "<")*/

    .to(overlay, {

        opacity: 0.45,

        duration: 1.2,

        ease: "power2.inOut"

    }, "-=0.2")

    .to(words, {

        x: 0,

        y: 0,

        rotate: 0,

        opacity: 1,

        filter: "blur(0px)",

        duration: 1.2,

        ease: "expo.out",

        stagger: {

            each: 0.018

        }

    }, "<")


    .to(window.leafWind, {

        speed: 1,

        sway: 1,

        rotation: 1,

        duration: 2,

        ease: "power2.out"

    }, "-=0.4")

    .to(tagline, {

        opacity: 1,

        y: 0,

        duration: 0.5

    }, "-=0.45")

    //.to(actions, {

      //  opacity: 1,

        //y: 0,

        //duration: 0.5

    //}, "-=0.35");

    timeline.restart();

    timeline.eventCallback("onComplete", () => {

        gsap.to(overlay, {

            opacity: 0.47,
            duration: 24,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"

        });

    });

}

