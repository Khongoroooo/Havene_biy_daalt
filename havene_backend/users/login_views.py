from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import haveneHash, generate_jwt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST хүсэлт шаардлагатай"}, status=405)

    try:
        body = json.loads(request.body.decode("utf-8"))
        email = body.get("email")
        password = haveneHash(body.get("password"))

        # 1. Хэрэглэгчийг шалгах
        user_data = supabase.table("tbl_users").select(
            "*").eq("email", email).eq(
                "password", password).eq(
                "is_verified", True).execute()
        if not user_data.data:
            return JsonResponse({"error": "Имэйл эсвэл нууц үг буруу"}, status=401)

        user = user_data.data[0]
        user_id = user["id"]

        # 2. Хэрэглэгчийн эрхийг Supabase-аас татах
        role_data = supabase.table("tbl_user_roles").select(
            "role_name").eq("user_id", user_id).execute()
        role_name = role_data.data[0]["role_name"] if role_data.data else "USER"

        # 3. JWT үүсгэх
        token = generate_jwt(user_id, role_name)

        # 4. Буцаах
        return JsonResponse({
            "message": "Амжилттай нэвтэрлээ",
            "token": token,
            "user": {
                "id": user_id,
                "email": user["email"],
                "role": role_name
            }
        })
    except Exception as e:
        return JsonResponse({"error": f"Алдаа: {str(e)}"}, status=500)
