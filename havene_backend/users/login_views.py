from django.http import JsonResponse
from datetime import datetime, timedelta
from django.views.decorators.csrf import csrf_exempt
from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import UserType, sendMail,createCodes, haveneHash
import json

def login(request):
    # if request.method == "POST":
        
    return JsonResponse({"error": "POST хүсэлт зөвшөөрөгдсөн"}, status=405)
