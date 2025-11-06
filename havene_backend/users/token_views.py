# havene_backend/users/token_views.py
from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import sendMail, createCodes, FrontEndURL
from django.views.decorators.http import require_http_methods
import json
import os

@require_http_methods(["GET"])
def verify_email(request):
    """Имэйл баталгаажуулах"""
    token = request.GET.get("token")
    if not token:
        return JsonResponse({"error": "Token дутуу"}, status=400)

    # Supabase-аас token шалга
    token_data = (
        supabase.table("tbl_user_tokens")
        .select("*")
        .eq("token", token)
        .eq("token_type", "register")
        .eq("revoked", False)
        .execute()
    )

    if not token_data.data:
        return JsonResponse({"error": "Буруу token"}, status=400)

    expires_at = datetime.fromisoformat(
        token_data.data[0]["expires_at"].replace("Z", "+00:00")
    )
    if expires_at < datetime.now():
        return JsonResponse({"error": "Token хугацаа дууссан"}, status=400)

    # Verified болго, token revoke
    supabase.table("tbl_users").update({"is_verified": True}).eq(
        "id", token_data.data[0]["user_id"]
    ).execute()
    supabase.table("tbl_user_tokens").update({"revoked": True}).eq(
        "id", token_data.data[0]["id"]
    ).execute()

    return JsonResponse(
        {"message": "Имэйл амжилттай баталгаажлаа. Одоо нэвтэрнэ үү."}, status=200
    )


@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    """Нууц үг сэргээх линк илгээх"""
    try:
        body = json.loads(request.body.decode("utf-8"))
        email = body.get("email")

        if not email:
            return JsonResponse({"error": "Email дутуу"}, status=400)

        user_data = (
            supabase.table("tbl_users")
            .select("*")
            .eq("email", email)
            .eq("is_verified", True)
            .execute()
        )

        if not user_data.data:
            return JsonResponse({"error": "Имэйл олдсонгүй эсвэл баталгаажаагүй"}, status=404)

        user = user_data.data[0]
        reset_token = createCodes(25)  # 25 тэмдэгт

        supabase.table("tbl_user_tokens").insert(
            {
                "user_id": user["id"],
                "token": reset_token,
                "token_type": "reset_password",
                "expires_at": (datetime.now() + timedelta(minutes=10)).isoformat(),
                "revoked": False,
            }
        ).execute()

        # Имэйл илгээх
        reset_link = f"{FrontEndURL}/token/{reset_token}"
        sendMail(
            receiver=email,
            subject="Havene: Нууц үг сэргээх",
            body_text="Нууц үгээ сэргээхийн тулд доорх линк дээр дарна уу. Линк 10 минутын турш идэвхтэй байх болно.",
            button_text="Нууц үг сэргээх",
            button_link=reset_link,
        )

        return JsonResponse({"message": "Сэргээх линк имэйл рүү илгээгдлээ"}, status=200)
    except Exception as e:
        return JsonResponse({"error": f"Алдаа: {str(e)}"}, status=500)
