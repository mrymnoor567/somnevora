"use strict";

/* =========================================================
   SOMNEVORA — Product Experience
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       FAQ accordion
    ----------------------------------------------------- */

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {

        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!button || !answer) {
            return;
        }

        button.addEventListener("click", () => {

            const wasOpen = item.classList.contains("open");

            faqItems.forEach((otherItem) => {

                const otherAnswer =
                    otherItem.querySelector(".faq-answer");

                const otherButton =
                    otherItem.querySelector(".faq-question");

                otherItem.classList.remove("open");

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }

                if (otherButton) {
                    otherButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });

            if (!wasOpen) {

                item.classList.add("open");

                answer.style.maxHeight =
                    `${answer.scrollHeight}px`;

                button.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });


    /* -----------------------------------------------------
       Product stage subtle pointer movement
    ----------------------------------------------------- */

    const stage = document.querySelector(".product-stage");
    const app = document.querySelector(".leadflow-app");

    const precisePointer =
        window.matchMedia("(pointer: fine)").matches;

    if (stage && app && precisePointer) {

        stage.addEventListener("mousemove", (event) => {

            const rect = stage.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) / rect.width;

            const y =
                (event.clientY - rect.top) / rect.height;

            const rotateY = (x - .5) * 7;
            const rotateX = (.5 - y) * 5;

            app.style.transform =
                `rotateY(${rotateY}deg)
                 rotateX(${rotateX}deg)
                 translateY(-4px)`;

        });

        stage.addEventListener("mouseleave", () => {
            app.style.transform = "";
        });

    }

});