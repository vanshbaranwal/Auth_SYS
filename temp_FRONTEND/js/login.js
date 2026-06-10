// Show / hide password
const loginPwInput  = document.getElementById("loginPassword");
const loginPwToggle = document.getElementById("loginPwToggle");

const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");
const loginCloseBtn = document.getElementById("loginCloseBtn");
const forgotPasswordRedirect = document.getElementById("forgotPasswordRedirect");
const registerRedirect = document.getElementById("registerRedirect");


loginPwToggle.addEventListener('click', () => {
    const hidden = loginPwInput.type === 'password';
    loginPwInput.type = hidden ? 'text' : 'password';
    loginPwToggle.textContent = hidden ? 'hide' : 'show';
});


// Close on overlay click
loginOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
loginCloseBtn.addEventListener('click', closeModal);

function closeModal() {
    loginOverlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => loginOverlay.style.display = 'none', 200);
}

// redirect on click to register modal and forgot password modal
registerRedirect.addEventListener('click', () => {
    loginOverlay.style.display = "none";
    registerOverlay.style.display = "flex";
});

forgotPasswordRedirect.addEventListener('click', () => {
    loginOverlay.style.display = "none";
    forgotOverlay.style.display = "flex";
});



loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    loginMessage.textContent = "";

    try {

        const userData = {
            email: loginEmail.value.trim(),
            password: loginPassword.value
        };

        const res = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(userData)
        });
        const data = await res.json();

        if(res.ok){
            loginMessage.textContent = "Login Successful!!";

            setTimeout(() => {
                loginOverlay.style.display = "none";

                // moving to the dashboard
                window.location.href = "/frontend/pages/dashboard.html";
            }, 1500);
        } else{
            loginMessage.textContent = data.message || "Login failed";
            loginForm.reset();
        }


    } catch (error) {
        loginMessage.textContent = "An error occurred";
        loginForm.reset();
    }

});


