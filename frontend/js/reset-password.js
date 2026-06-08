const otpInput   = document.getElementById('otpCode');
const newPw      = document.getElementById('newPassword');
const confirmPw  = document.getElementById('confirmPassword');
const resetBtn   = document.getElementById('resetBtn');
const resetLabel = document.getElementById('resetLabel');
const matchHint  = document.getElementById('matchHint');
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

/* Submit */
document.getElementById('resetForm').addEventListener('submit', () => {
    resetBtn.classList.add('loading');
    resetLabel.textContent = 'RESETTING...';

    setTimeout(() => {
    document.getElementById('defaultState').style.display = 'none';
    const s = document.getElementById('successState');
    s.style.display = 'flex';
    }, 1600);
});

/* Show / hide toggles */
function makeToggle(btnId, inputId) {
    document.getElementById(btnId).addEventListener('click', () => {
    const inp = document.getElementById(inputId);
    const hidden = inp.type === 'password';
    inp.type = hidden ? 'text' : 'password';
    document.getElementById(btnId).textContent = hidden ? 'hide' : 'show';
    });
}
makeToggle('toggle1', 'newPassword');
makeToggle('toggle2', 'confirmPassword');

/* Close */
document.getElementById('resetCloseBtn').addEventListener('click', closeModal);
document.getElementById('resetOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

function closeModal() {
    const overlay = document.getElementById('resetOverlay');
    overlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => overlay.style.display = 'none', 200);
}