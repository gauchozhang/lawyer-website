document.getElementById('consultForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formMessage = document.getElementById('formMessage');
    const submitBtn = this.querySelector('button[type="submit"]');

    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        // -------------------------
        // 【关键修复】确保提示一定会显示
        // -------------------------
        formMessage.classList.remove('d-none');

        if (result.success) {
            formMessage.className = 'mb-3 alert alert-success';
            formMessage.textContent = 'Your consultation request has been sent successfully! I will contact you soon.';
            this.reset();
        } else {
            formMessage.className = 'mb-3 alert alert-danger';
            formMessage.textContent = 'Failed: ' + (result.error || 'Unknown error');
        }

    } catch (error) {
        const formMessage = document.getElementById('formMessage');
        formMessage.classList.remove('d-none');
        formMessage.className = 'mb-3 alert alert-danger';
        formMessage.textContent = 'Server connection error. Please try again later.';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Consultation Request';
    }
});