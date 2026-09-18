"use strict";


/* =========================================================
   SOMNEVORA
   Global Website Interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const progressBar = document.getElementById("pageProgress");
    const cursorGlow = document.querySelector(".cursor-glow");
    const currentYear = document.getElementById("currentYear");


    /* =====================================================
       CURRENT YEAR
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       PREMIUM HEADER SCROLL STATE
    ===================================================== */

    const updateHeader = () => {

        if (!header) {
            return;
        }

        if (window.scrollY > 35) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* =====================================================
       PAGE SCROLL PROGRESS
    ===================================================== */

    const updateProgress = () => {

        if (!progressBar) {
            return;
        }

        const scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        if (scrollHeight <= 0) {
            progressBar.style.width = "0%";
            return;
        }

        const progress =
            (scrollTop / scrollHeight) * 100;

        progressBar.style.width = `${progress}%`;

    };

    updateProgress();

    window.addEventListener(
        "scroll",
        updateProgress,
        { passive: true }
    );


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const closeMobileMenu = () => {

        if (!menuToggle || !mobileMenu) {
            return;
        }

        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove("menu-open");

    };


    if (menuToggle && mobileMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                mobileMenu.classList.toggle("active");

            menuToggle.classList.toggle(
                "active",
                isOpen
            );

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );

        });


        mobileMenu
            .querySelectorAll("a")
            .forEach((link) => {

                link.addEventListener(
                    "click",
                    closeMobileMenu
                );

            });


        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    closeMobileMenu();
                }

            }
        );

    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(
            (element, index) => {

                /*
                 * Very small stagger.
                 * Kept subtle so the site does not
                 * feel like an animation demo.
                 */
                element.style.transitionDelay =
                    `${Math.min(index % 4, 3) * 70}ms`;

                revealObserver.observe(element);

            }
        );

    } else {

        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       CURSOR GLOW
       Desktop / precise pointer only
    ===================================================== */

    const supportsPrecisePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;


    if (cursorGlow && supportsPrecisePointer) {

        let mouseX = 0;
        let mouseY = 0;

        let currentX = 0;
        let currentY = 0;


        window.addEventListener(
            "mousemove",
            (event) => {

                mouseX = event.clientX;
                mouseY = event.clientY;

                cursorGlow.style.opacity = "1";

            },
            { passive: true }
        );


        document.documentElement.addEventListener(
            "mouseleave",
            () => {
                cursorGlow.style.opacity = "0";
            }
        );


        const animateGlow = () => {

            currentX +=
                (mouseX - currentX) * 0.09;

            currentY +=
                (mouseY - currentY) * 0.09;


            cursorGlow.style.left =
                `${currentX}px`;

            cursorGlow.style.top =
                `${currentY}px`;


            requestAnimationFrame(animateGlow);

        };


        animateGlow();

    }


    /* =====================================================
       HERO PRODUCT WINDOW PARALLAX
    ===================================================== */

    const heroVisual =
        document.querySelector(".hero-visual");

    const heroWindow =
        document.querySelector(".main-window");


    if (
        heroVisual &&
        heroWindow &&
        supportsPrecisePointer
    ) {

        heroVisual.addEventListener(
            "mousemove",
            (event) => {

                const rect =
                    heroVisual.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left;

                const y =
                    event.clientY -
                    rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateY =
                    ((x - centerX) / centerX) * 4;

                const rotateX =
                    ((centerY - y) / centerY) * 3;


                heroWindow.style.transform =
                    `
                    rotateY(${rotateY}deg)
                    rotateX(${rotateX}deg)
                    translateY(-4px)
                    `;

            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                heroWindow.style.transform = "";

            }
        );

    }


    /* =====================================================
       SMOOTH INTERNAL ANCHORS
    ===================================================== */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((anchor) => {

            anchor.addEventListener(
                "click",
                (event) => {

                    const href =
                        anchor.getAttribute("href");

                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(href);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });

});