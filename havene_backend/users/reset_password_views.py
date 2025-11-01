from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import  sendMail,createCodes, haveneHash
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    try:
        body = json.loads(request.body.decode("utf-8"))
        email = body.get("email")

        if not email:
            return JsonResponse({"error": "Email дутуу"}, status=400)
        
        user_data = supabase.table("tbl_users").select("*").eq("email", email).eq("is_verified", True).execute()

        if not user_data.data:
            return JsonResponse({"error": "Имэйл олдсонгүй"}, status=404)
        
        user = user_data.data[0]
        reset_token = createCodes(30)  # Таны функц

        supabase.table("tbl_user_tokens").insert({
            "user_id": user["id"],
            "token": reset_token,
            "token_type": "reset_password",
            "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat(),
            "revoked": False
        }).execute()

        sendMail(
            receiver=email,
            subject="Havene: Нууц үг сэргээх",
            body_text="Доорх линкээр нууц үгээ сэргээнэ үү.",
            button_text="Сэргээх",
            button_link=f"http://localhost:3000/reset-password/{reset_token}"  # Frontend route-оо өөрчил (одоо байхгүй)
        )

        return JsonResponse({"message": "Сэргээх линк илгээлээ"}, status=200)
    except Exception as e:
        return JsonResponse({"error": f"Алдаа: {str(e)}"}, status=500)