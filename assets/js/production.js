"use strict";

/* =========================================================
   SOMNEVORA
   Production Enhancements
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       EXTERNAL LINK SECURITY
    ----------------------------------------------------- */

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );

    externalLinks.forEach((link) => {

        const relValues =
            new Set(
                (link.getAttribute("rel") || "")
                    .split(/\s+/)
                    .filter(Boolean)
            );

        relValues.add("noopener");
        relValues.add("noreferrer");

        link.setAttribute(
            "rel",
            Array.from(relValues).join(" ")
        );

    });


    /* -----------------------------------------------------
       ACCESSIBLE MOBILE MENU ESCAPE CONTROL
    ----------------------------------------------------- */

    const menuToggle =
        document.getElementById("menuToggle");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Escape" &&
                    menuToggle.getAttribute(
                        "aria-expanded"
                    ) === "true"
                ) {

                    menuToggle.click();

                    menuToggle.focus();

                }

            }
        );

    }


    /* -----------------------------------------------------
       SAFE HASH SCROLL
    ----------------------------------------------------- */

    document.querySelectorAll(
        'a[href^="#"]:not([href="#"])'
    ).forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const id =
                    link.getAttribute("href");

                if (!id) {
                    return;
                }

                const target =
                    document.querySelector(id);

                if (!target) {
                    return;
                }

                event.preventDefault();

                const reducedMotion =
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches;

                target.scrollIntoView({
                    behavior:
                        reducedMotion
                            ? "auto"
                            : "smooth",
                    block: "start"
                });

                history.pushState(
                    null,
                    "",
                    id
                );

            }
        );

    });

    /* -----------------------------------------------------
   BACK TO TOP
----------------------------------------------------- */

const backToTopLinks =
    document.querySelectorAll(".back-to-top");

backToTopLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: reducedMotion
                ? "auto"
                : "smooth"
        });

    });

});

});