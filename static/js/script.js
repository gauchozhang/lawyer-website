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

        if (result.success) {
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Your consultation request has been sent successfully! I will contact you soon.';
            this.reset();
        } else {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Failed: ' + (result.error || 'Unknown error');
        }

        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Server connection error. Please try again later.';
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Consultation Request';
    }
});
