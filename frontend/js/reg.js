const form = document.getElementById('register-form');
    const email = document.getElementById('reg-email');
    const emailHelp = document.getElementById('email-help');
    const verifyBtn = document.querySelector('.btn.verify');

    const pw = document.getElementById('reg-password');
    const pw2 = document.getElementById('reg-confirm');
    const pwHelp = document.getElementById('pw-help');
    const submitBtn = document.getElementById('register-btn');

    // Email "Verify" demo (no backend)
    verifyBtn?.addEventListener('click', () => {
      emailHelp.textContent = '';
      if (!email.value) {
        emailHelp.textContent = 'Please enter your email first.';
        return;
      }
      if (!email.checkValidity()) {
        emailHelp.textContent = 'Please enter a valid email address.';
        return;
      }
      const originalText = verifyBtn.textContent;
      verifyBtn.disabled = true;
      verifyBtn.textContent = 'Sending…';
      setTimeout(() => {
        verifyBtn.textContent = 'Sent ✓';
        emailHelp.textContent = 'Verification link sent.';
        setTimeout(() => {
          verifyBtn.disabled = false;
          verifyBtn.textContent = originalText;
        }, 2500);
      }, 1200);
    });

    // Passwords match validation
    function checkPasswords() {
      if (!pw.value || !pw2.value) {
        pwHelp.textContent = '';
        submitBtn.disabled = false;
        pw2.setCustomValidity('');
        return;
      }
      if (pw.value !== pw2.value) {
        pwHelp.textContent = 'Passwords do not match.';
        submitBtn.disabled = true;
        pw2.setCustomValidity('Passwords do not match');
      } else {
        pwHelp.textContent = '';
        submitBtn.disabled = false;
        pw2.setCustomValidity('');
      }
    }
    pw.addEventListener('input', checkPasswords);
    pw2.addEventListener('input', checkPasswords);

    // Prevent submit if invalid (for demo)
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
      }
    });