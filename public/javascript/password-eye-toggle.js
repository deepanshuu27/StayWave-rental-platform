

   
   document.getElementById('eyeIcon').addEventListener('click', function() {

    const passwordField = document.getElementById('password');

    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        this.classList.add('fa-eye-slash');
        this.classList.remove('fa-eye');
    } else {
        passwordField.type = 'password';
        this.classList.remove('fa-eye-slash');
        this.classList.add('fa-eye');
    }
});


