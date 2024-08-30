document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.formulario form');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const loginButton = loginForm.querySelector('button');

    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        let isValid = true;

        try {
            const emailValue = emailInput.value.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
                isValid = false;
                throw new Error('El formato del correo electrónico es incorrecto.');
            }
        } catch (error) {
            alert(error.message);
            emailInput.focus();
        }

        try {
            const passwordValue = passwordInput.value.trim();
            if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(passwordValue)) {
                isValid = false;
                throw new Error('La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número.');
            }
        } catch (error) {
            alert(error.message);
            passwordInput.focus();
        }

        if (isValid) {
            window.location.href = '/index.html';
        }
    });
});
