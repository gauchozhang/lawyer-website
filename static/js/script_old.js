// 监听表单提交
document.getElementById('consultForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // 阻止默认提交行为
    
    const formMessage = document.getElementById('formMessage');
    const submitBtn = this.querySelector('button[type="submit"]');
    
    // 获取表单数据
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    try {
        // 禁用提交按钮防止重复提交
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Submitting...';
        
        // 发送数据到后端
        const response = await fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        const result = await response.json();
        
        // 显示反馈信息
        formMessage.classList.remove('d-none', 'alert-danger');
        formMessage.classList.add('alert-success');
        formMessage.textContent = 'Your consultation request has been sent successfully! I will contact you soon.';
        
        // 重置表单
        this.reset();
        
    } catch (error) {
        // 错误处理
        formMessage.classList.remove('d-none', 'alert-success');
        formMessage.classList.add('alert-danger');
        formMessage.textContent = 'Failed to send your request. Please try again later.';
        console.error('Error:', error);
    } finally {
        // 恢复提交按钮
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Submit Consultation Request';
    }
});