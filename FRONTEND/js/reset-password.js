const otpInput   = document.getElementById('otpCode');
const newPw      = document.getElementById('newPassword');
const confirmPw  = document.getElementById('confirmPassword');
const resetBtn   = document.getElementById('resetBtn');
const resetLabel = document.getElementById('resetLabel');
const matchHint  = document.getElementById('matchHint');
const resetForm  = document.getElementById("resetForm");
const resetMessage = document.getElementById("resetMessage");
const resetDefaultState = document.getElementById("resetDefaultState");
const resetSuccessState = document.getElementById("resetSuccessState");
const resetOverlay = document.getElementById("resetOverlay");
const resetCloseBtn = document.getElementById("resetCloseBtn");


const resetSegs       = [document.getElementById('s1'), document.getElementById('s2'), document.getElementById('s3'), document.getElementById('s4')];
const resetColors     = ['#ADB5BD', '#ADB5BD', '#6C757D', '#343A40'];

/* OTP — digits only */
otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/[^0-9]/g, '').slice(0, 6);
    validate();
});

/* Password strength */
newPw.addEventListener('input', () => {
    const v = newPw.value;
    let score = 0;
    if (v.length >= 8)          score++;
    if (/[A-Z]/.test(v))        score++;
    if (/[0-9]/.test(v))        score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    resetSegs.forEach((s, i) => {
    s.style.background = i < score ? resetColors[Math.min(score - 1, 3)] : '#DEE2E6';
    });
    checkMatch();
    validate();
});

/* Confirm match */
confirmPw.addEventListener('input', () => { checkMatch(); validate(); });

function checkMatch() {
    const np = newPw.value;
    const cp = confirmPw.value;
    if (!cp) { matchHint.textContent = ''; matchHint.className = 'match-hint'; confirmPw.classList.remove('valid','invalid'); return; }
    if (np === cp) {
    matchHint.textContent = '✓ passwords match';
    matchHint.className = 'match-hint ok';
    confirmPw.classList.add('valid'); confirmPw.classList.remove('invalid');
    } else {
    matchHint.textContent = '✕ passwords do not match';
    matchHint.className = 'match-hint err';
    confirmPw.classList.add('invalid'); confirmPw.classList.remove('valid');
    }
}

function validate() {
    const ready =
    otpInput.value.length === 6 &&
    newPw.value.length >= 8 &&
    newPw.value === confirmPw.value;
    resetBtn.disabled = !ready;
}


function stopLoading(){
    resetBtn.classList.remove('loading');
    resetLabel.textContent = 'RESET PASSWORD';
}

/* Submit */
resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetMessage.textContent = "";

    resetBtn.classList.add('loading');
    resetLabel.textContent = 'RESETTING...';

    const otp = otpInput.value.trim();
    const newPassword = newPw.value;
    const confirmPassword = confirmPw.value;

    if(!otp || !newPassword || !confirmPassword){
        resetMessage.textContent = "All fields are required";
        return;
    }

    if(newPassword !== confirmPassword){
        resetMessage.textContent = "Password do not match";
        return;
    }

    try {
        const userData = {
            otp,
            newPassword
        };

        const res = await fetch("http://localhost:3000/api/v1/users/reset-password", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if(res.ok && data.success){
            resetMessage.textContent = data.message;

            resetForm.reset();

            resetDefaultState.style.display = "none";
            resetSuccessState.style.display = "flex";

            setTimeout(() => {
               
                // moving to the login modal
                resetOverlay.style.display = "none";
                loginOverlay.style.display = "flex";
            }, 2000);

        }else {
            resetMessage.textContent = data.message || "Password reset failed";
        }


    } catch (error) {
        resetMessage.textContent = "An error occurred";

    } finally{

        stopLoading();
    }

});

/* Show / hide toggles */
function makeToggle(btnId, inputId) {
    const btn = document.getElementById(btnId);
    const inp = document.getElementById(inputId);
    btn.addEventListener('click', () => {
    const hidden = inp.type === 'password';
    inp.type = hidden ? 'text' : 'password';
    btn.textContent = hidden ? 'hide' : 'show';
    });
}
makeToggle('toggle1', 'newPassword');
makeToggle('toggle2', 'confirmPassword');

/* Close */
resetCloseBtn.addEventListener('click', closeModal);
resetOverlay.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

function closeModal() {
    const overlay = resetOverlay;
    overlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => overlay.style.display = 'none', 200);
}
