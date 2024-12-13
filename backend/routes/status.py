from flask import Blueprint, jsonify, request
import smtplib
from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart

sts_bp = Blueprint("status", __name__)


@sts_bp.route("/status", methods=["GET"])
def status():
    return jsonify(isSuccess=True), 200


@sts_bp.route("/send-email", methods=["POST"])
def send_email():
    from_email = request.json.get('email')

    if not from_email:
        return jsonify({"error": "O campo email não pode ser vazio!"}), 400

    smtp_server = 'localhost'
    smtp_port = 1025
    to_email = 'server@dominio.pt'
    subject = 'Pedido de Redefinição da Password'
    body = 'Este é um teste de envio de e-mail usando o MailHog.'

    msg = MIMEText(body, 'plain')
    # Os comentarios seguintes servem para construir um email mais elaborado, com diversos anexos como imagens ficheiros de texto, etc...
    # msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    # msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.sendmail(from_email, to_email, msg.as_string())
        # print(f'E-mail enviado para {to_email}')
        server.quit()
        return jsonify({"msg": "Email enviado com sucesso!"}), 200
    except Exception as e:
        return jsonify({"error": "Erro ao processar email!"}), 500
        # print(f'Erro ao enviar e-mail: {e}')
