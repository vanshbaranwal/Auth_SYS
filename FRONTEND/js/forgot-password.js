const sendBtn = document.getElementById('sendBtn');
const spinner = sendBtn.querySelector('.spinner');
const btnLabel = document.getElementById('btnLabel');
const forgotForm = document.getElementById('forgotForm');
const forgotEmail = document.getElementById('forgotEmail');
const sentEmail = document.getElementById('sentEmail');
const forgotDefaultState = document.getElementById('forgotDefaultState');
const forgotSuccessState = document.getElementById('forgotSuccessState');
const forgotCloseBtn = document.getElementById('forgotCloseBtn');
const forgotOverlay = document.getElementById('forgotOverlay');
const backLink = document.getElementById('backLink');
const forgotMessage = document.getElementById('forgotMessage');


function stopLoading(){
    sendBtn.classList.remove('loading');
    spinner.style.display = 'none';
    btnLabel.textContent = 'SEND OTP';
}

forgotForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    sendBtn.classList.add('loading');
    spinner.style.display = 'block';
    btnLabel.textContent = 'SENDING...';
    
    const email = forgotEmail.value.trim();

    if(!email){
        forgotMessage.textContent = "Please enter your email";
        stopLoading();
        forgotForm.reset();
        return;
    }

    try {

        const res = await fetch("http://localhost:3000/api/v1/users/forgot-password", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({email})
        });
        
        const data = await res.json();

        if(res.ok && data.success){
            forgotMessage.textContent = data.message;

            sessionStorage.setItem("userEmail", email);
            sentEmail.textContent = email; 

            forgotDefaultState.style.display = "none";
            forgotSuccessState.style.display = "flex";

            setTimeout(() => {
                forgotOverlay.style.display = "none";
                resetOverlay.style.display = "flex";

            }, 1600);

        } else{
            forgotMessage.textContent = data.message || "Forgotpassword request failed";
            forgotForm.reset();
        }

    } catch (error) {
        forgotMessage.textContent = "An error occurred";
        forgotForm.reset();
    } finally{
        stopLoading();
    }

});

forgotCloseBtn.addEventListener('click', closeModal);
forgotOverlay.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

backLink.addEventListener('click', () => {
    forgotOverlay.style.display = "none";
    loginOverlay.style.display = "flex";
});

function closeModal() {
    const overlay = forgotOverlay;
    overlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => overlay.style.display = 'none', 200);
}