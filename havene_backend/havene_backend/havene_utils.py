import smtplib
from   email.mime.multipart   import MIMEMultipart
from   email.mime.text        import MIMEText
from   enum                   import Enum
from   email.mime.multipart   import MIMEMultipart
from   email.mime.text        import MIMEText
from   datetime               import datetime, timedelta
from   supabase import create_client, Client
from   dotenv import load_dotenv
import smtplib, hashlib, base64, random, jwt, os

load_dotenv()

### Properties & structer

FrontEndURL = "http://localhost:3000"

class UserType(str, Enum):
    USER = "USER"                # Энгийн хэрэглэгч
    OWNER = "OWNER"              # Үл хөдлөх эзэмшигч
    AGENT = "AGENT"              # Зуучлагч
    COMPANY = "COMPANY"          # Агентлаг, компани
    ADMIN = "ADMIN"              # Админ
    PREMIUM_USER = "PREMIUM_USER"  # Төлбөртэй хэрэглэгч

### properties & structer

### JWT

def generate_jwt(user_id, role_name):
    payload = {
        "user_id": user_id,
        "role_name": role_name, 
        "exp": datetime.utcnow() + timedelta(days=1),  
        "iat": datetime.utcnow()  
    }
    return jwt.encode(payload, os.environ.get("JWT_SECRET"), algorithm="HS256")

def decode_jwt(token):
    try:
        return jwt.decode(token, os.environ.get("JWT_SECRET"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return {"Алдаа": "Токен хугацаа дууссан байна."}
    except jwt.InvalidTokenError:
        return {"Алдаа": "Токен буруу байна."}

### jwt

### Methods
    
def base64encode(length):
    return base64.b64encode((createCodes(length-26) + str(datetime.now().time())).encode('ascii')).decode('ascii').rstrip('=')

def createCodes(length):
    result_str = ''.join((random.choice('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') for i in range(length)))
    return result_str

def haveneHash(password):
    return hashlib.md5(password.encode('utf-8')).hexdigest()

### methods

def sendMail(
    receiver: str,
    subject: str,
    body_text: str = "",
    button_text: str = None,
    button_link: str = None,
    # image_url: str = baseUrl + "/public/assets/havene-logo.png",
    image_url: str = None,
    footer_text: str = "© 2025 Havene. Бүх эрх хуулиар хамгаалагдсан.",
):
    """
    Ерөнхий зориулалттай HTML имэйл илгээгч функц.
    - receiver: хүлээн авагчийн имэйл хаяг
    - subject: имэйлийн гарчиг
    - body_text: имэйлийн үндсэн тайлбар
    - button_text: товч дээрх бичиг
    - button_link: товчны холбоос
    - image_url: толгой хэсгийн зураг /лого/
    - footer_text: доод хэсгийн текст
    """

    sender = "starodic@gmail.com"
    password = "mevw hlex yhvd bsbd"

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Havene <{sender}>"
    msg["To"] = receiver
    msg["Subject"] = subject

    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 25px;">
        <div style="max-width:520px; margin:auto; background:white; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); overflow:hidden;">
            <div style="background-color:#2563eb; text-align:center; padding:20px;">
                <img src="{image_url or 'https://i.ibb.co/BKSMnJDt/havene.png'}"
                    alt="Havene Logo"
                    style="width:100px; height:100px; border-radius:50%;
                            object-fit:cover; border:3px solid #2563eb; padding:2px;">
            </div>
            <div style="padding:25px;">
                <h2 style="color:#2563eb; text-align:center;">{subject}</h2>
                <p style="font-size:15px; color:#333; line-height:1.6;">{body_text}</p>
                {f'''
                <div style="text-align:center; margin:25px 0;">
                    <a href="{button_link}" style="background-color:#2563eb; color:white; padding:12px 25px;
                        border-radius:6px; text-decoration:none; font-weight:bold;">
                        {button_text}
                    </a>
                </div>
                ''' if button_link and button_text else ''}
                <p style="font-size:13px; color:#777; text-align:center;">
                    {footer_text}
                </p>
            </div>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender, password)
            server.sendmail(sender, receiver, msg.as_string())
            # print(f"Имэйл амжилттай илгээгдлээ: {receiver}")
    except Exception as e:
        pass
        print(f"Имэйл илгээхэд алдаа гарлаа: {e}")
