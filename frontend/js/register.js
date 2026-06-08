const registerPwInput  = document.getElementById('registerPassword');
const registerPwToggle = document.getElementById('registerPwToggle');

const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerForm = document.getElementById('registerForm');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const registerMessage = document.getElementById('registerMessage');

const otpOverlay = document.getElementById("otpOverlay");

// Password show/hide
registerPwToggle.addEventListener('click', () => {
    const isHidden = registerPwInput.type === 'password';
    registerPwInput.type   = isHidden ? 'text' : 'password';
    registerPwToggle.textContent = isHidden ? 'hide' : 'show';
});

// Strength bar
const registerSegs = ['seg1','seg2','seg3','seg4'].map(id => document.getElementById(id));
const registerColors = ['#ADB5BD','#ADB5BD','#6C757D','#343A40'];

function updateStrength(val) {
    let score = 0;
    if (val.length >= 8)             score++;
    if (/[A-Z]/.test(val))           score++;
    if (/[0-9]/.test(val))           score++;
    if (/[^A-Za-z0-9]/.test(val))    score++;
    registerSegs.forEach((seg, i) => {
    seg.style.background = i < score ? registerColors[Math.min(score - 1, 3)] : '#DEE2E6';
    });
}

// Close on overlay click
document.getElementById('registerOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
document.getElementById('registerCloseBtn').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('registerOverlay').style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => document.getElementById('registerOverlay').style.display = 'none', 200);
}

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    registerMessage.textContent = "";
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    
    try {
        // getting the user input from the registermodal
        const userData = {
            name: registerName.value.trim(),
            email: registerEmail.value.trim(),
            password: registerPassword.value
        };
    
        const res = await fetch("http://localhost:3000/api/v1/users/register", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(userData)
        });
        const data = await res.json();
        
        if(res.ok){
            registerMessage.textContent = "Registration successful!!";

            sessionStorage.setItem("userEmail", userData.email);

            setTimeout(() => {
                registerOverlay.style.display = "none";
                otpOverlay.style.display = "flex";
            }, 3000);

        } else{
            registerMessage.textContent = data.message || "Registration Failed";
        }
        
        
    } catch (error) {
        registerMessage.textContent = "An error occured";
    }
    
    registerForm.reset();
});
