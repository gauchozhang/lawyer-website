from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message
from dotenv import load_dotenv
import os

# 加载环境变量
load_dotenv()

# 初始化Flask应用
app = Flask(__name__)

# 配置邮箱
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS') == 'True'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.secret_key = os.getenv('SECRET_KEY')

# 初始化邮件服务
mail = Mail(app)

# 接收邮箱
RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL')

# 主页路由
@app.route('/')
def index():
    return render_template('index.html')

# 处理邮件发送的API
@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        # 获取前端发送的JSON数据
        data = request.get_json()
        
        # 验证必要字段
        required_fields = ['fullName', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        # 构建邮件内容
        email_subject = f"New Consultation Request - {data['subject']}"
        email_body = f"""
New Client Consultation Request

Client Information:
Name: {data['fullName']}
Email: {data['email']}
Phone: {data.get('phone', 'Not provided')}
Subject: {data['subject']}

Consultation Details:
{data['message']}

This message was sent from your lawyer website contact form.
"""
        
        # 创建邮件消息
        msg = Message(
            subject=email_subject,
            recipients=[RECIPIENT_EMAIL],
            body=email_body,
            sender=("Lawyer Consultation", app.config['MAIL_DEFAULT_SENDER'])
        )
        
        # 发送邮件
        mail.send(msg)
        
        return jsonify({'success': True, 'message': 'Email sent successfully'})
    
    except Exception as e:
        # 捕获所有异常并返回错误信息
        print(f"Error sending email: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ========== 关键修改：适配线上环境 ==========
# 1. 移除debug=True（避免泄露代码）
# 2. 添加生产环境启动入口（Render需要）
if __name__ == '__main__':
    # 本地运行仍用debug=True，线上由Render的Gunicorn启动
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)), debug=False)

# 生产环境启动函数（Render会调用这个函数）
def create_app():
    return app
