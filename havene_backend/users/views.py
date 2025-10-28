from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import UserType, sendMail,createCodes, haveneHash
import json

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        
        try:
            body = json.loads(request.body.decode("utf-8"))
            try:
                email = body.get("email")
                password = haveneHash(body.get("password"))
            except Exception as e:
                return JsonResponse({"error": "key дутуу", "status": 401})
            
            otp = createCodes(30)
            user_data = supabase.table("tbl_users").insert({
                    "email": email,
                    "password": password,
                    "is_verified": False,
                }).execute()
            
            if len(user_data.data) > 0:
                supabase.table("tbl_user_tokens").insert({
                        "user_id": user_data.data[0]["id"],
                        "token": otp,
                        "token_type": "register",
                        "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat() ,
                        "revoked": False ,
                    }).execute()
                supabase.table("tbl_user_roles").insert({
                        "user_id": user_data.data[0]["id"],
                        "role_name": UserType.USER.value,
                    }).execute()
                sendMail(
                    receiver=user_data.data[0]["email"],
                    subject="Havene: Имэйл баталгаажуулах",
                    body_text="Та манай системд бүртгүүлсэн байна. Доорх товч дээр дарж бүртгэлээ баталгаажуулна уу.",
                    button_text="Баталгаажуулах",
                    button_link=f"http://localhost:3000/verifyEmail/{otp}",
                )
                return JsonResponse({"message": "Хэрэглэгчийн мэдээлэл үүслээ.", "status": 200})
            return JsonResponse({"error": "Алдаа", "status": 400})
        except Exception as e:
            return JsonResponse({"error": f"Алдаа {e}", "status": 400})

    return JsonResponse({"error": "POST хүсэлт зөвшөөрөгдсөн"}, status=405)


def list_users(request):
    if request.method == "GET":
        try:
            users_data = supabase.table("tbl_users").select("*").execute()
            print(users_data)
            return JsonResponse({"data": users_data.data, "status": 200}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"Алдаа {e}", "status": 400})

    return JsonResponse({"error": "GET хүсэлт зөвшөөрөгдсөн", "status": 405})

def verify_email(request):

    return JsonResponse({"error": "GET хүсэлт зөвшөөрөгдсөн", "status": 405})