
import { auth, googleProvider } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const googleBtn = document.getElementById("google-login");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
        await signInWithEmailAndPassword(auth, email, password);

        await Swal.fire({
            title: "Login Successful!",
            text: "Welcome back to Quiz App!",
            icon: "success",
            confirmButtonColor: "#6a1b9a"
        });

        window.location.href = "index.html";

    } catch (error) {
        let message = "Something went wrong. Please try again.";

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {
            message = "Incorrect email or password.";
        } else if (error.code === "auth/invalid-email") {
            message = "Please enter a valid email address.";
        } else if (error.code === "auth/too-many-requests") {
            message = "Too many attempts. Please try again later.";
        } else if (error.code === "auth/network-request-failed") {
            message = "Check your internet connection.";
        }

        Swal.fire({
            title: "Login Failed!",
            text: message,
            icon: "error",
            confirmButtonColor: "#6a1b9a"
        });
    }
});

googleBtn.addEventListener("click", async function () {
    try {
        const result = await signInWithPopup(auth, googleProvider);

        await Swal.fire({
            title: "Google Login Successful!",
            text: `Welcome, ${result.user.displayName || result.user.email}!`,
            icon: "success",
            confirmButtonColor: "#6a1b9a"
        });

        window.location.href = "index.html";

    } catch (error) {
        let message = "Unable to sign in with Google.";

        if (error.code === "auth/popup-closed-by-user") {
            message = "The Google login window was closed.";
        } else if (error.code === "auth/unauthorized-domain") {
            message = "This website domain is not authorized in Firebase.";
        } else if (error.code === "auth/popup-blocked") {
            message = "Allow popups in your browser and try again.";
        }

        Swal.fire({
            title: "Google Login Failed!",
            text: message,
            icon: "error",
            confirmButtonColor: "#6a1b9a"
        });
    }
});
