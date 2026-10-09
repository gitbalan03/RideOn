// ==========================================
// RAIDON AUTHENTICATION
// ==========================================


// ==========================================
// SIGNUP
// ==========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get form values
        const name =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!/^[0-9]{10}$/.test(phone)) {

            alert("Please enter a valid 10-digit phone number.");
            return;

        }


        if (password.length < 6) {

            alert("Password must contain at least 6 characters.");
            return;

        }


        if (password !== confirmPassword) {

            alert("Passwords do not match.");
            return;

        }


        // ==========================================
        // BUTTON
        // ==========================================

        const button =
            signupForm.querySelector("button[type='submit']");

        const originalText = button.innerHTML;

        button.disabled = true;

        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';


        try {

            // ==========================================
            // SUPABASE SIGNUP
            // ==========================================

            const { data, error } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            full_name: name,

                            phone: phone

                        }

                    }

                });


            // ==========================================
            // ERROR
            // ==========================================

            if (error) {

                throw error;

            }


            console.log("Signup successful:", data);


            // ==========================================
            // SUCCESS
            // ==========================================

            alert(
                "RideOn account created successfully!\n\n" +
                "Welcome, " + name + "!"
            );


            window.location.href = "login.html";


        } catch (error) {

            console.error("Signup error:", error);

            alert(
                "Signup failed!\n\n" +
                error.message
            );


        } finally {

            button.disabled = false;

            button.innerHTML = originalText;

        }

    });

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        const button =
            loginForm.querySelector("button[type='submit']");

        const originalText = button.innerHTML;

        button.disabled = true;

        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';


        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                throw error;

            }


            console.log("Login successful:", data);

            window.location.href = "index.html";


        } catch (error) {

            console.error("Login error:", error);

            alert(
                "Login failed!\n\n" +
                error.message
            );


        } finally {

            button.disabled = false;

            button.innerHTML = originalText;

        }

    });

}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error("Logout error:", error);

        return;
        
    }

    window.location.href = "login.html";

}