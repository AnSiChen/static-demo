document.addEventListener("DOMContentLoaded", () => {

    //
    // em
    //

    const user = "contact";
    const domain = "anthonyem.com";
    const email = `${user}@${domain}`;
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".base-nav");


    document.querySelectorAll(".email-link").forEach(link => {
        link.href = `mailto:${email}`;
        link.innerHTML = '<i class=""></i> Contact';
    });


    //
    // Back to top
    //

    const backToTop = document.querySelector(".back-to-top");

    if (!backToTop) return;

    backToTop.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    let hideTimeout;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 150) {

            backToTop.classList.add("show");

            clearTimeout(hideTimeout);

            hideTimeout = setTimeout(() => {
                backToTop.classList.remove("show");
            }, 2000);

        } else {

            clearTimeout(hideTimeout);
            backToTop.classList.remove("show");

        }

    });

    // Mobile nav toggle
    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");
            document.body.classList.toggle("menu-open");
            
            navToggle.textContent = isOpen ? "✕" : "☰";
            navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Toggle navigation");
        });

        nav.querySelectorAll("a, .nav-icon-btn").forEach(item => {
            item.addEventListener("click", () => {
                nav.classList.remove("open");
                document.body.classList.remove("menu-open");
                navToggle.textContent = "☰";
                navToggle.setAttribute("aria-label", "Toggle navigation");
            });
        });
    }

});

// Header 

const hero = document.querySelector(".hero");
const header = document.querySelector(".base-header");

if (hero && header) {
    const headerObserver = new IntersectionObserver(
        ([entry]) => {
            header.classList.toggle("hidden", !entry.isIntersecting);
        },
        { threshold: 0.05 }
    );

    headerObserver.observe(hero);
}


