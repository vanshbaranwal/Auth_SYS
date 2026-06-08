const otpOverlay = document.getElementById("otpOverlay");
const boxes = Array.from(document.querySelectorAll('.otp-box'));
const verifyBtn = document.getElementById('verifyBtn');
const verifyLabel = document.getElementById('verifyLabel');
const resendBtn = document.getElementById('resendBtn');
const timerBadge = document.getElementById('timerBadge');
const otpEmail = document.getElementById("otpEmail");
const verifyMessage = document.getElementById("verifyMessage");


/* ── OTP INPUT LOGIC ── */
boxes.forEach((box, i) => {
    box.addEventListener('input', () => {
    // keep only last digit
    const val = box.value.replace(/[^0-9]/g, '').slice(-1);
    box.value = val;
    box.classList.toggle('filled', val !== '');

    if (val && i < boxes.length - 1) boxes[i + 1].focus();
    checkComplete();
    });

    box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace') {
        if (!box.value && i > 0) {
        boxes[i - 1].value = '';
        boxes[i - 1].classList.remove('filled');
        boxes[i - 1].focus();
        }
        box.classList.remove('filled');
        checkComplete();
    }
    if (e.key === 'ArrowLeft'  && i > 0)              boxes[i - 1].focus();
    if (e.key === 'ArrowRight' && i < boxes.length-1) boxes[i + 1].focus();
    });

    // handle paste
    box.addEventListener('paste', (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData)
        .getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    paste.split('').forEach((ch, j) => {
        if (boxes[j]) {
        boxes[j].value = ch;
        boxes[j].classList.add('filled');
        }
    });
    const next = Math.min(paste.length, boxes.length - 1);
    boxes[next].focus();
    checkComplete();
    });
});

function checkComplete() {
    const allFilled = boxes.every(b => b.value !== '');
    verifyBtn.disabled = !allFilled;
}

function stopLoading() {
    verifyBtn.classList.remove("loading");
    verifyLabel.textContent = "VERIFY";
}

/* ── VERIFY ── */
verifyBtn.addEventListener('click', async (e) => {
    verifyBtn.classList.add('loading');
    verifyLabel.textContent = 'VERIFYING...';


    e.preventDefault();
    
    const otp = boxes
        .map(box => box.value)
        .join("");

    try {
        const res = await fetch("http://localhost:3000/api/v1/users/verify", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                otp: otp,
            })
        });

        const data = await res.json();

        if(res.ok && data.success){
            verifyMessage.textContent = data.message;

            // simulate success
            document.getElementById('otpDefaultState').style.display = 'none';
            const s = document.getElementById('otpSuccessState');
            s.style.display = 'flex';
            
            setTimeout(() => {

                // moving to the dashboard
                window.location.href = "/frontend/pages/dashboard.html";
            }, 2000);

        } else{

            verifyMessage.textContent = data.message || "verification failed";

        }
    } catch (error) {
        verifyMessage.textContent = "An error occurred";

    } finally {
        stopLoading();
    }

});

/* ── RESEND / TIMER ── */
let seconds = 30;

const countdown = setInterval(() => {
    seconds--;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerBadge.textContent = `${m}:${String(s).padStart(2, '0')}`;

    if (seconds <= 0) {
    clearInterval(countdown);
    timerBadge.style.display = 'none';
    resendBtn.disabled = false;
    resendBtn.classList.add('active');
    }
}, 1000);

resendBtn.addEventListener('click', () => {
    if (!resendBtn.classList.contains('active')) return;
    // reset boxes
    boxes.forEach(b => { b.value = ''; b.classList.remove('filled', 'error'); });
    if(boxes.length > 0){
        boxes[0].focus();
    }
    checkComplete();
    // reset button
    resendBtn.classList.remove('active');
    resendBtn.disabled = true;
    timerBadge.style.display = 'inline-block';
    // flash a sent confirmation inline
    resendBtn.textContent = 'Sent!';
    setTimeout(() => resendBtn.textContent = 'Resend OTP', 2000);
});

/* ── CLOSE ── */
document.getElementById('otpCloseBtn').addEventListener('click', closeModal);
otpOverlay.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

function closeModal() {
    otpOverlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => otpOverlay.style.display = 'none', 200);
}

// focus first box on load
boxes[0].focus();

// for the strong tag in the index.html file to show the user's email in the verify modal
if(otpEmail){
    otpEmail.textContent = sessionStorage.getItem("userEmail");
}
checkComplete();