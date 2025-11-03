from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import UserType, sendMail,createCodes, haveneHash
from havene_backend.havene_utils import haveneHash, generate_jwt, decode_jwt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
def get_profile(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Token дутуу"}, status=401)

    token = auth_header.split(" ")[1]
    decoded = decode_jwt(token)
    if "Алдаа" in decoded:
        return JsonResponse(decoded, status=401)

    user_id = decoded["user_id"]
    role_name = decoded["role_name"]

    user_data = supabase.table("tbl_users").select("*").eq("id", user_id).execute()
    if not user_data.data:
        return JsonResponse({"error": "Хэрэглэгч олдсонгүй"}, status=404)

    return JsonResponse({"user": user_data.data[0], "role": role_name}, status=200)
