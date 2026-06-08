const registerBtn = document.getElementById("registerBtn");
const registerOverlay = document.getElementById("registerOverlay");
const registerCloseBtn = document.getElementById("registerCloseBtn");
const loginBtn = document.getElementById("loginBtn");
const loginOverlay = document.getElementById("loginOverlay");
const btnNav = document.querySelector(".btn-nav");

registerBtn.addEventListener("click", function() {
    registerOverlay.style.display = "flex";
});

loginBtn.addEventListener("click", function() {
    loginOverlay.style.display = "flex";
});

btnNav.addEventListener("click", function() {
    registerOverlay.style.display = "flex";
});


// Close handler register modal
document.getElementById('registerOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
document.getElementById('registerCloseBtn').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('registerOverlay').style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => document.getElementById('registerOverlay').style.display = 'none', 200);
}


// Close handlers login modal
document.getElementById('loginCloseBtn').addEventListener('click', closeModal);
document.getElementById('loginOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

function closeModal() {
    const overlay = document.getElementById('loginOverlay');
    overlay.style.animation = 'overlayIn 0.2s ease reverse forwards';
    setTimeout(() => overlay.style.display = 'none', 200);
}