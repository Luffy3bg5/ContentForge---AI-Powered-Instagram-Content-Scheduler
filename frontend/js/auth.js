const API_BASE_URL = "http://localhost:5000/api/auth";

// ===============================
// ContentForge Authentication JS
// Shared by:
// - login.html
// - register.html
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    const isLoginPage = body.classList.contains("login-page");
    const isRegisterPage = body.classList.contains("register-page");

    const form = document.getElementById("authForm");

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    const submitBtn = document.getElementById("submitBtn");

    const togglePassword = document.getElementById("togglePassword");

    const rememberMe = document.getElementById("rememberMe");
    const agreeTerms = document.getElementById("agreeTerms");

    // ==========================
    // Password Toggle
    // ==========================

    if (togglePassword) {

        togglePassword.addEventListener("click", () => {

            if (password.type === "password") {

                password.type = "text";
                togglePassword.innerHTML = "🫣";

            } else {

                password.type = "password";
                togglePassword.innerHTML = "👁";

            }

        });

    }

    // ==========================
    // Email Validation
    // ==========================

    function validateEmail(emailAddress) {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return regex.test(emailAddress);

    }

    // ==========================
    // Show Error
    // ==========================

    function showError(input, message) {

        input.classList.add("invalid");

        const error = document.getElementById(
            input.id + "Error"
        );

        if (error) {

            error.textContent = message;

        }

    }

    // ==========================
    // Clear Error
    // ==========================

    function clearError(input) {

        input.classList.remove("invalid");

        const error = document.getElementById(
            input.id + "Error"
        );

        if (error) {

            error.textContent = "";

        }

    }

    // ==========================
    // Remove Errors while Typing
    // ==========================

    [email, password].forEach(input => {

        if (!input) return;

        input.addEventListener("input", () => {

            clearError(input);

        });

    });

    // ==========================
    // Submit
    // ==========================

    form.addEventListener("submit", async function (e) {

    e.preventDefault();

    let valid = true;

    if (!email.value.trim()) {
        showError(email, "Email is required.");
        valid = false;
    }
    else if (!validateEmail(email.value)) {
        showError(email, "Enter a valid email.");
        valid = false;
    }

    if (!password.value.trim()) {
        showError(password, "Password is required.");
        valid = false;
    }

    if (isRegisterPage) {

        if (agreeTerms && !agreeTerms.checked) {

            alert("Please accept the Terms & Privacy Policy.");

            valid = false;

        }

    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {

        const endpoint = isLoginPage
            ? `${API_BASE_URL}/login`
            : `${API_BASE_URL}/register`;

        const response = await fetch(endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: email.value.trim(),

                password: password.value

            })

        });

        const data = await response.json();

        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");

        if (!response.ok) {

            alert(data.message);

            return;

        }

        // Save JWT

        localStorage.setItem("token", data.token);

        localStorage.setItem("userEmail", data.user.email);

        localStorage.setItem("userId", data.user.id);

        if (isRegisterPage) {

            alert("Account Created Successfully!");

        } else {

            alert("Login Successful!");

        }

        window.location.href = "dashboard.html";

    }

    catch (error) {

        submitBtn.disabled = false;

        submitBtn.classList.remove("loading");

        console.error(error);

        alert("Unable to connect to the server.");

    }

});

});