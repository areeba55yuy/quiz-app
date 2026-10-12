
import { auth } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (name) {
            await updateProfile(result.user, {
                displayName: name
            });
        }

        await Swal.fire({
            title: "Account Created!",
            text: "Welcome to Quiz App!",
            icon: "success",
            confirmButtonColor: "#6a1b9a"
        });

        window.location.href = "index.html";

    } catch (error) {
        console.error("Signup error:", error.code, error.message);

        let message = "Unable to create your account.";

        if (error.code === "auth/email-already-in-use") {
            message = "This email is already registered.";
        } else if (error.code === "auth/invalid-email") {
            message = "Please enter a valid email.";
        } else if (error.code === "auth/weak-password") {
            message = "Your password must be at least 6 characters.";
        } else if (error.code === "auth/operation-not-allowed") {
            message = "Enable Email/Password in Firebase Authentication.";
        } else if (error.code === "auth/network-request-failed") {
            message = "Check your internet connection.";
        } else if (error.code === "auth/unauthorized-domain") {
            message = "Authorize your website domain in Firebase.";
        }

        Swal.fire({
            title: "Signup Failed!",
            text: message,
            icon: "error",
            confirmButtonColor: "#6a1b9a"
        });
    }
});
