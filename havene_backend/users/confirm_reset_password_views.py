# havene_backend/users/confirm_reset_password_views.py
from django.http import JsonResponse
from datetime import datetime
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from havene_backend.supabase_client import supabase
from django.utils import timezone
from dateutil import parser as dateutil_parser 
from havene_backend.havene_utils import haveneHash
import json

@csrf_exempt
@require_http_methods(["POST"])
def confirm_reset_password(request):
    """Нууц үгийг шинэ нууц үгээр сольх"""
    try:
        body = json.loads(request.body.decode("utf-8"))
        token = body.get("token")
        new_password = haveneHash(body.get("new_password"))
        if not token or not new_password:
            return JsonResponse({"error": "token болон new_password шаардлагатай"}, status=400)

        # token-ыг шалгах
        token_data = supabase.table("tbl_user_tokens").select("*") \
            .eq("token", token).eq("token_type", "reset_password").eq("revoked", False).execute()
        if not getattr(token_data, "data", None) or len(token_data.data) == 0:
            return JsonResponse({"error": "Буруу token"}, status=400)

        row = token_data.data[0]
        expires_at_raw = row.get("expires_at")
        if not expires_at_raw:
            return JsonResponse({"error": "Token format буруу"}, status=400)

        # хугацаа шалгах (robust parse)
        try:
            expires_dt = dateutil_parser.parse(expires_at_raw)
        except Exception as e:
            return JsonResponse({"error": "Token хугацаа уншихад алдаа", "detail": str(e)}, status=400)

        if expires_dt.tzinfo is None:
            from datetime import timezone as dt_timezone_local
            expires_dt = expires_dt.replace(tzinfo=dt_timezone_local.utc)

        if expires_dt.astimezone(timezone.get_current_timezone()) < timezone.now():
            return JsonResponse({"error": "Token expired"}, status=400)

        # password-ыг шинэчлэх
        supabase.table("tbl_users").update({"password": new_password}).eq("id", row.get("user_id")).execute()
        supabase.table("tbl_user_tokens").update({"revoked": True}).eq("id", row.get("id")).execute()

        return JsonResponse({"message": "Нууц үг амжилттай солигдлоо"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
