// ============================================================
// RIDEON - NAVBAR
// js/navbar.js
// ============================================================


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const user =
            await getCurrentUser();

        updateNavbar(user);

    }
);


// ============================================================
// UPDATE NAVBAR
// ============================================================

function updateNavbar(user) {

    const loginLink =
        document.getElementById("loginLink");

    const signupLink =
        document.getElementById("signupLink");

    const bookingsLink =
        document.getElementById("bookingsLink");

    const profileLink =
        document.getElementById("profileLink");

    const logoutButton =
        document.getElementById("logoutButton");

    const userName =
        document.getElementById("userName");


    // ========================================================
    // USER LOGGED IN
    // ========================================================

    if (user) {

        if (loginLink) {

            loginLink.style.display =
                "none";
        }

        if (signupLink) {

            signupLink.style.display =
                "none";
        }

        if (bookingsLink) {

            bookingsLink.style.display =
                "inline-block";
        }

        if (profileLink) {

            profileLink.style.display =
                "inline-block";
        }

        if (logoutButton) {

            logoutButton.style.display =
                "inline-block";
        }

        if (userName) {

            userName.textContent =
                user.user_metadata?.full_name ||
                user.email;
        }

    }


    // ========================================================
    // USER LOGGED OUT
    // ========================================================

    else {

        if (loginLink) {

            loginLink.style.display =
                "inline-block";
        }

        if (signupLink) {

            signupLink.style.display =
                "inline-block";
        }

        if (bookingsLink) {

            bookingsLink.style.display =
                "none";
        }

        if (profileLink) {

            profileLink.style.display =
                "none";
        }

        if (logoutButton) {

            logoutButton.style.display =
                "none";
        }

        if (userName) {

            userName.textContent =
                "";
        }

    }

}