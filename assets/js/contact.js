"use strict";


document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("somnevoraContactForm");

    if (!form) {
        return;
    }


    const submitButton =
        document.getElementById("contactSubmit");

    const submitLabel =
        document.getElementById("submitLabel");

    const responseBox =
        document.getElementById("formResponse");

    const requestType =
        document.getElementById("contactType");

    const technicalFields =
        document.getElementById("technicalFields");

    const message =
        document.getElementById("contactMessage");

    const messageCounter =
        document.getElementById("messageCounter");


    /* =====================================================
       MESSAGE COUNTER
    ===================================================== */

    const updateMessageCounter = () => {

        if (!message || !messageCounter) {
            return;
        }

        messageCounter.textContent =
            `${message.value.length} / 3000`;

    };


    message?.addEventListener(
        "input",
        updateMessageCounter
    );

    updateMessageCounter();



    /* =====================================================
       TECHNICAL ISSUE FIELDS
    ===================================================== */

    const updateTechnicalFields = () => {

        if (!requestType || !technicalFields) {
            return;
        }

        const isTechnical =
            requestType.value === "Technical Issue";

        technicalFields.hidden = !isTechnical;

    };


    requestType?.addEventListener(
        "change",
        updateTechnicalFields
    );

    updateTechnicalFields();



    /* =====================================================
       FIELD VALIDATION
    ===================================================== */

    const getErrorElement = (field) => {

        return field
            .closest(".form-field")
            ?.querySelector(".field-error");

    };


    const clearFieldError = (field) => {

        const wrapper =
            field.closest(".form-field");

        const error =
            getErrorElement(field);

        wrapper?.classList.remove("has-error");

        field.removeAttribute("aria-invalid");

        if (error) {
            error.textContent = "";
        }

    };


    const setFieldError = (
        field,
        messageText
    ) => {

        const wrapper =
            field.closest(".form-field");

        const error =
            getErrorElement(field);

        wrapper?.classList.add("has-error");

        field.setAttribute(
            "aria-invalid",
            "true"
        );

        if (error) {
            error.textContent = messageText;
        }

    };


    const validateField = (field) => {

        clearFieldError(field);


        if (
            field.required &&
            !field.value.trim()
        ) {

            setFieldError(
                field,
                "This field is required."
            );

            return false;
        }


        if (
            field.type === "email" &&
            field.value.trim() &&
            !field.validity.valid
        ) {

            setFieldError(
                field,
                "Enter a valid email address."
            );

            return false;
        }


        return true;

    };


    const requiredFields =
        form.querySelectorAll(
            "input[required], select[required], textarea[required]"
        );


    requiredFields.forEach((field) => {

        field.addEventListener(
            "blur",
            () => validateField(field)
        );


        field.addEventListener(
            "input",
            () => {

                if (
                    field
                        .closest(".form-field")
                        ?.classList
                        .contains("has-error")
                ) {
                    validateField(field);
                }

            }
        );


        field.addEventListener(
            "change",
            () => {

                if (
                    field
                        .closest(".form-field")
                        ?.classList
                        .contains("has-error")
                ) {
                    validateField(field);
                }

            }
        );

    });



    /* =====================================================
       RESPONSE MESSAGE
    ===================================================== */

    const hideResponse = () => {

        responseBox.className =
            "form-response";

        responseBox.textContent = "";

    };


    const showResponse = (
        type,
        text
    ) => {

        responseBox.className =
            `form-response is-visible is-${type}`;

        responseBox.textContent = text;

    };



    /* =====================================================
       BUTTON STATE
    ===================================================== */

    const setLoading = (loading) => {

        submitButton.disabled = loading;

        submitButton.classList.toggle(
            "is-loading",
            loading
        );

        submitLabel.textContent =
            loading
                ? "Sending..."
                : "Send message";

    };



    /* =====================================================
       SUBMISSION
    ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            hideResponse();


            let formIsValid = true;
            let firstInvalidField = null;


            requiredFields.forEach((field) => {

                const valid =
                    validateField(field);

                if (!valid) {

                    formIsValid = false;

                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }

                }

            });


            if (!formIsValid) {

                firstInvalidField?.focus();

                showResponse(
                    "error",
                    "Please check the highlighted fields before sending your message."
                );

                return;

            }


            setLoading(true);


            try {

                const formData =
                    new FormData(form);


                const response =
                    await fetch(
                        form.action,
                        {
                            method: "POST",

                            body: formData,

                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                if (!response.ok) {

                    let errorMessage =
                        "Your message couldn't be sent. Please try again.";


                    try {

                        const data =
                            await response.json();

                        if (
                            data.errors &&
                            data.errors.length
                        ) {

                            errorMessage =
                                data.errors
                                    .map(
                                        (error) =>
                                            error.message
                                    )
                                    .join(" ");

                        }

                    } catch (error) {
                        // Keep the safe fallback message.
                    }


                    throw new Error(
                        errorMessage
                    );

                }


                form.reset();

                updateMessageCounter();
                updateTechnicalFields();


                requiredFields.forEach(
                    clearFieldError
                );


                showResponse(
                    "success",
                    "Message sent. Thanks for contacting SOMNEVORA — we'll reply to the email you provided."
                );


                submitLabel.textContent =
                    "Message sent";


            } catch (error) {

                showResponse(
                    "error",
                    error.message ||
                    "Your message couldn't be sent. Please try again."
                );

            } finally {

                setLoading(false);

            }

        }
    );

});