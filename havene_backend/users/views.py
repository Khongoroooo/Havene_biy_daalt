from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.settings import sendMail, createCodes
import json

@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body.decode("utf-8"))
            try:
                email = body.get("email")
                password = body.get("password")
            except Exception as e:
                return JsonResponse({"error": "key дутуу", "status": 401})
            
            otp = createCodes(6)
            resp = supabase.table("tbl_users").insert({
                    "email": email,
                    "password": password,
                    "is_verified": False,
                }).execute()
            
            print(resp)
            if len(resp.data) > 0:
                sendMail(email, "Havene: Имэйл баталгаажуулах", 
                    f"""Та манай системд бүртгүүлсэн байна. \n\n 
                        Доорх холбоос дээр дарж бүртгэлээ баталгаажуулна уу!\n\n 
                        http://127.0.0.1:8000/verifyEmail/""")
                return JsonResponse({"message": "Хэрэглэгчийн мэдээлэл үүслээ.", "status": 200})
            return JsonResponse({"error": "Алдаа", "status": 400})

            # result = supabase.auth.sign_up({"email": email, "password": password})
            # supabase_id = result.user.id if result.user else None
        
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
