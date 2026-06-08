const sendBtn = document.getElementById('sendBtn');
const spinner = sendBtn.querySelector('.spinner');
const btnLabel = document.getElementById('btnLabel');

document.getElementById('forgotForm').addEventListener('submit', () => {
    const email = document.getElementById('email').value.trim();
    if (!email) return;

    sendBtn.classList.add('loading');
    spinner.style.display = 'block';
    btnLabel.textContent = 'SENDING...';

    setTimeout(() => {
    document.getElementById('sentEmail').textContent = email;
    document.getElementById('defaultState').style.display = 'none';
    const s = document.getElementById('successState');
    s.style.display = 'flex';
    }, 1600);
});

document.getElementById('forgotCloseBtn').addEventListener('click', closeModal);
document.getElementById('forgotOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});
document.getElementById('backLink').addEventListener('click', function (e) {
    e.preventDefault();
    closeModal();
});

function closeModal() {
    const overlay = document.getElementById('forgotOverlay');
    overlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => overlay.style.display = 'none', 200);
}