// Show / hide password
const loginPwInput  = document.getElementById('loginPassword');
const loginPwToggle = document.getElementById('loginPwToggle');

loginPwToggle.addEventListener('click', () => {
    const hidden = loginPwInput.type === 'password';
    loginPwInput.type = hidden ? 'text' : 'password';
    loginPwToggle.textContent = hidden ? 'hide' : 'show';
});

