from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import UserType, sendMail,createCodes, haveneHash
from havene_backend.havene_utils import haveneHash, generate_jwt, decode_jwt
from django.views.decorators.http import require_http_methods
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

@csrf_exempt
@require_http_methods(["GET"])
def verify_email(request):
    token = request.GET.get("token")
    if not token:
        return JsonResponse({"error": "Token дутуу"}, status=400)

    # Supabase-аас token шалга
    token_data = supabase.table("tbl_user_tokens").select(
        "*").eq("token", token).eq(
            "token_type", "register").eq(
                "revoked", False).execute()

    if not token_data.data:
        return JsonResponse({"error": "Буруу token"}, status=400)

    expires_at = datetime.fromisoformat(token_data.data[0]["expires_at"].replace("Z", "+00:00"))  # ISO format
    if expires_at < datetime.now():
        return JsonResponse({"error": "Token expired"}, status=400)

    # Verified болго, token revoke
    supabase.table("tbl_users").update({"is_verified": True}).eq(
        "id", token_data.data[0]["user_id"]).execute()
    supabase.table("tbl_user_tokens").update({"revoked": True}).eq(
        "id", token_data.data[0]["id"]).execute()

    return JsonResponse({"message": "Имэйл баталгаажлаа. Одоо нэвтэрнэ үү."}, status=200)

@csrf_exempt 
@require_http_methods(["GET"])
def get_profile(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Token дутуу"}, status=401)

    token = auth_header.split(" ")[1]
    decoded = decode_jwt(token)
    if "error" in decoded:
        return JsonResponse({"error": decoded["error"]}, status=401)

    user_id = decoded["user_id"]
    user_data = supabase.table("tbl_users").select("*").eq("id", user_id).execute()
    if not user_data.data:
        return JsonResponse({"error": "User олдсонгүй"}, status=404)

    return JsonResponse({"user": user_data.data[0]}, status=200)