# havene_backend/ul_hudluh/views.py
import json
from decimal import Decimal, InvalidOperation

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import decode_jwt

import json
from decimal import Decimal, InvalidOperation
from datetime import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from havene_backend.supabase_client import supabase
from havene_backend.havene_utils import decode_jwt

# ---------------- helpers ----------------

def to_bool(v):
    if isinstance(v, bool):
        return v
    if v is None:
        return False
    s = str(v).strip().lower()
    return s in ("1", "true", "t", "yes", "y", "on")

def to_decimal(v):
    if v is None or v == "":
        return None
    try:
        return Decimal(str(v))
    except (InvalidOperation, ValueError):
        return None

def to_float(v):
    if v is None or v == "":
        return None
    try:
        return float(v)
    except (ValueError, TypeError):
        return None

def get_auth_user(request):
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, JsonResponse({"error": "Token дутуу"}, status=401)
    token = auth_header.split(" ")[1]
    decoded = decode_jwt(token)
    if not isinstance(decoded, dict) or "user_id" not in decoded:
        return None, JsonResponse({"error": "Token буруу"}, status=401)
    return decoded, None

# ---------------- create / update ----------------
@csrf_exempt
@require_http_methods(["POST"])
def ul_hudluh_list(request):
    """
    Public listing API
    Body:
    {
      "page": 1,
      "per_page": 30,
      "query": "баянгол"   # optional
    }
    """
    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        body = {}

    page = int(body.get("page", 1))
    per_page = int(body.get("per_page", 30))
    query = (body.get("query") or "").strip().lower()

    if page < 1:
        page = 1
    if per_page < 1 or per_page > 50:
        per_page = 30

    start = (page - 1) * per_page
    end = start + per_page - 1

    try:
        # ---- base query ----
        q = supabase.table("tbl_ul_hudluh").select(
            "id,title,price,location_text,main_image,view_count,image_count,area_size,created_at",
            count="exact"
        ).eq("is_active", True)

        # ---- search ----
        if query:
            q = q.or_(
                f"title.ilike.%{query}%,location_text.ilike.%{query}%"
            )

        # ---- order & pagination ----
        resp = q.order("created_at", desc=True).range(start, end).execute()

        data = resp.data or []
        total = resp.count or 0

        return JsonResponse({
            "data": data,
            "page": page,
            "per_page": per_page,
            "total": total,
        }, status=200)

    except Exception as e:
        # 🔴 энд л 500 гарч байсан
        return JsonResponse({
            "error": "DB list алдаа",
            "detail": str(e),
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def create_or_update_property(request):
    """
    Create or update property. (same behavior as earlier implementation)
    If update: user must be owner
    """
    user_decoded, err = get_auth_user(request)
    if err:
        return err
    user_id = user_decoded["user_id"]

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "JSON parse алдаа"}, status=400)

    action = (body.get("action") or "create").lower()
    is_update = action == "update" or bool(body.get("id"))
    prop_id = body.get("id")

    # parse top-level fields
    title = body.get("title")
    price = to_decimal(body.get("price"))
    currency = body.get("currency") or None
    location_text = body.get("location_text") or body.get("place") or None
    main_image = body.get("main_image") or None
    images = body.get("images") or body.get("media") or []
    is_active = to_bool(body.get("is_active", True))
    is_vip = to_bool(body.get("is_vip", False))
    area_size_top = to_float(body.get("area_size"))  # top-level area_size if provided

    # details
    details = body.get("details", {})
    if not details:
        details = {
            "description": body.get("description"),
            "area_size": body.get("area"),
            "floor_count": body.get("floor_number") or body.get("floor_count"),
            "balcony": body.get("balcony"),
            "usage_status": body.get("usage_status"),
            "expected_completion": body.get("expected_completion") or body.get("expected_completion_date"),
            "purpose": body.get("purpose"),
            "loan_type": body.get("loan_type"),
            "is_available": body.get("is_available"),
            "payment_condition": body.get("payment_condition"),
            "latitude": body.get("latitude"),
            "longitude": body.get("longitude"),
            "has_tag": body.get("has_tag"),
            "district_ids": body.get("district_ids") or body.get("districts"),
        }

    # simple validation
    if not title and not details.get("description"):
        return JsonResponse({"error": "Гарчиг эсвэл тайлбар шаардлагатай"}, status=400)

    ul_payload = {
        "user_id": user_id,
        "title": title,
        "price": float(price) if price is not None else None,
        "currency": currency,
        "location_text": location_text,
        "main_image": main_image,
        "image_count": len(images) if isinstance(images, list) else None,
        "is_active": is_active,
        "is_vip": is_vip,
        "area_size": area_size_top,
    }
    ul_payload = {k: v for k, v in ul_payload.items() if v is not None}

    try:
        if is_update and prop_id:
            # ownership check
            existing = supabase.table("tbl_ul_hudluh").select("user_id").eq("id", prop_id).execute()
            if not existing.data:
                return JsonResponse({"error": "Зар олдсонгүй"}, status=404)
            owner_id = existing.data[0].get("user_id")
            if owner_id != user_id:
                return JsonResponse({"error": "Та энэ зарыг засах эрхгүй"}, status=403)

            upd = supabase.table("tbl_ul_hudluh").update(ul_payload).eq("id", prop_id).execute()
            property_id = prop_id
        else:
            ins = supabase.table("tbl_ul_hudluh").insert(ul_payload).select("id").execute()
            if not ins.data:
                return JsonResponse({"error": "Зар үүсгэхэд алдаа", "backend": getattr(ins, "data", None)}, status=500)
            property_id = ins.data[0]["id"]
    except Exception as e:
        return JsonResponse({"error": f"DB алдаа: {str(e)}"}, status=500)

    # details payload
    details_payload = {
        "property_id": property_id,
        "description": details.get("description"),
        "area_size": to_decimal(details.get("area_size") or details.get("area") or details.get("area_size")),
        "floor_count": details.get("floor_count"),
        "balcony": to_bool(details.get("balcony")),
        "sunlight_direction": details.get("sunlight_direction"),
        "usage_status": details.get("usage_status"),
        "expected_completion": details.get("expected_completion"),
        "purpose": details.get("purpose"),
        "loan_type": details.get("loan_type"),
        "is_available": to_bool(details.get("is_available")),
        "payment_condition": details.get("payment_condition"),
        "latitude": to_float(details.get("latitude")),
        "longitude": to_float(details.get("longitude")),
        "has_tag": to_bool(details.get("has_tag")),
        "district_ids": details.get("district_ids") or None,
    }
    details_payload = {k: v for k, v in details_payload.items() if v is not None}

    try:
        existing = supabase.table("tbl_ul_hudluh_details").select("id").eq("property_id", property_id).execute()
        if existing.data:
            supabase.table("tbl_ul_hudluh_details").update(details_payload).eq("property_id", property_id).execute()
        else:
            supabase.table("tbl_ul_hudluh_details").insert(details_payload).execute()
    except Exception as e:
        return JsonResponse({
            "warning": "Зар амжилттай хадгалагдсан, details хадгалахад алдаа",
            "property_id": property_id,
            "error": str(e)
        }, status=200)

    # images
    try:
        image_rows = []
        if isinstance(images, list):
            for idx, img in enumerate(images):
                if not img:
                    continue
                image_rows.append({
                    "property_id": property_id,
                    "image_url": img,
                    "is_main": (img == main_image),
                })

        if image_rows:
            if is_update and prop_id:
                supabase.table("tbl_ul_hudluh_images").delete().eq("property_id", property_id).execute()
            supabase.table("tbl_ul_hudluh_images").insert(image_rows).execute()
    except Exception as e:
        return JsonResponse({
            "warning": "Зар болон details амжилттай хадгалагдлаа, images хадгалахад алдаа",
            "property_id": property_id,
            "error": str(e)
        }, status=200)

    return JsonResponse({
        "status": "ok",
        "message": "Зар амжилттай хадгалагдлаа",
        "property_id": property_id
    }, status=200)


# ---------------- list (pagination + filters) ----------------
@csrf_exempt
@require_http_methods(["POST"])
def list_properties(request):
    """
    Request JSON:
    { page: 1, per_page: 30, query: "...", district: "...", type: "...", min_price, max_price, min_area, max_area }
    """
    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "JSON parse алдаа"}, status=400)

    page = int(body.get("page", 1))
    per_page = int(body.get("per_page", 30))
    q = body.get("query")
    district = body.get("district")
    ptype = body.get("type")
    min_price = body.get("min_price")
    max_price = body.get("max_price")
    min_area = body.get("min_area")
    max_area = body.get("max_area")

    start = (page - 1) * per_page
    end = start + per_page - 1

    try:
        # Base select (we'll fetch count)
        sel = supabase.table("tbl_ul_hudluh").select("*", count="exact")

        if q:
            # simple ilike on title or location_text
            sel = sel.ilike("title", f"%{q}%").or_(f"location_text.ilike.%{q}%") if hasattr(sel, "or_") else sel

            # NOTE: supabase-py chaining of or_ may differ; fallback to fetch all and filter in Python if necessary
        if district:
            sel = sel.eq("location_text", district) if False else sel  # avoid fragile server-side district match

        # Order by created_at desc
        sel = sel.order("created_at", desc=True)
        res = sel.range(start, end).execute()
    except Exception as e:
        return JsonResponse({"error": f"DB алдаа: {str(e)}"}, status=500)

    total = getattr(res, "count", None) or (len(res.data) if res.data else 0)
    rows = res.data or []

    property_ids = [r["id"] for r in rows]

    # fetch details and images in bulk
    details = {}
    try:
        if property_ids:
            dres = supabase.table("tbl_ul_hudluh_details").select("*").in_("property_id", property_ids).execute()
            if dres.data:
                for d in dres.data:
                    details[d["property_id"]] = d
    except Exception:
        pass

    images = {}
    try:
        if property_ids:
            ires = supabase.table("tbl_ul_hudluh_images").select("*").in_("property_id", property_ids).execute()
            if ires.data:
                for im in ires.data:
                    pid = im["property_id"]
                    images.setdefault(pid, []).append(im)
    except Exception:
        pass

    # assemble
    out = []
    for r in rows:
        pid = r["id"]
        out.append({
            **r,
            "details": details.get(pid),
            "images": images.get(pid, []),
        })

    return JsonResponse({
        "status": "ok",
        "data": out,
        "total": total,
        "page": page,
        "per_page": per_page
    }, status=200)


# ---------------- detail ----------------
@csrf_exempt
@require_http_methods(["GET", "POST"])
def property_detail(request, property_id=None):
    """
    GET / POST variant:
      - If GET: provide property_id in URL (we wire in urls.py)
      - If POST: JSON { property_id: N }
    Returns property + details + images + is_favorite (if token provided) + is_owner
    """
    try:
        if request.method == "GET":
            pid = int(property_id)
        else:
            body = json.loads(request.body.decode("utf-8") or "{}")
            pid = int(body.get("property_id"))
    except Exception:
        return JsonResponse({"error": "property_id шаардлагатай"}, status=400)

    try:
        pres = supabase.table("tbl_ul_hudluh").select("*").eq("id", pid).execute()
        if not pres.data:
            return JsonResponse({"error": "Зар олдсонгүй"}, status=404)
        prop = pres.data[0]
    except Exception as e:
        return JsonResponse({"error": f"DB алдаа: {str(e)}"}, status=500)

    # details
    det = None
    try:
        dres = supabase.table("tbl_ul_hudluh_details").select("*").eq("property_id", pid).execute()
        if dres.data:
            det = dres.data[0]
    except Exception:
        det = None

    # images
    imgs = []
    try:
        ires = supabase.table("tbl_ul_hudluh_images").select("*").eq("property_id", pid).order("is_main", desc=True).execute()
        if ires.data:
            imgs = ires.data
    except Exception:
        imgs = []

    # is_favorite and is_owner (if token)
    is_fav = False
    is_owner = False
    user_dec = None
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        decoded = decode_jwt(token)
        if isinstance(decoded, dict) and "user_id" in decoded:
            user_dec = decoded
            uid = decoded["user_id"]
            try:
                fav = supabase.table("ref_favorite").select("*").eq("user_id", uid).eq("ul_hudluh_id", pid).execute()
                is_fav = bool(fav.data)
            except Exception:
                is_fav = False
            # owner check
            is_owner = (prop.get("user_id") == uid)

    return JsonResponse({
        "status": "ok",
        "property": prop,
        "details": det,
        "images": imgs,
        "is_favorite": is_fav,
        "is_owner": is_owner
    }, status=200)


# ---------------- favorite toggle ----------------
@csrf_exempt
@require_http_methods(["POST"])
def toggle_favorite(request):
    """
    POST { property_id: N } -> toggles favorite for current user
    """
    user_decoded, err = get_auth_user(request)
    if err:
        return err
    uid = user_decoded["user_id"]

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "JSON parse алдаа"}, status=400)

    pid = body.get("property_id")
    if not pid:
        return JsonResponse({"error": "property_id шаардлагатай"}, status=400)

    try:
        # check exists
        exist = supabase.table("ref_favorite").select("*").eq("user_id", uid).eq("ul_hudluh_id", pid).execute()
        if exist.data:
            # delete
            supabase.table("ref_favorite").delete().eq("user_id", uid).eq("ul_hudluh_id", pid).execute()
            return JsonResponse({"status": "removed"}, status=200)
        else:
            supabase.table("ref_favorite").insert({"user_id": uid, "ul_hudluh_id": pid}).execute()
            return JsonResponse({"status": "added"}, status=200)
    except Exception as e:
        return JsonResponse({"error": f"DB алдаа: {str(e)}"}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def create_or_update_property(request):
    # --- auth ---
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JsonResponse({"error": "Token дутуу"}, status=401)
    token = auth_header.split(" ")[1]

    decoded = decode_jwt(token)
    if not isinstance(decoded, dict) or "user_id" not in decoded:
        return JsonResponse({"error": "Token буруу"}, status=401)
    user_id = decoded["user_id"]

    # --- parse body ---
    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "JSON parse алдаа"}, status=400)

    # Для debug — dev дээр харахын тулд хэвлэ
    print("DEBUG create_or_update_property - incoming body:", body)

    action = (body.get("action") or "create").lower()
    is_update = action == "update"

    # If client accidentally sends id on create, remove it
    if not is_update and "id" in body:
        print("DEBUG: removing id from create payload:", body.get("id"))
        body.pop("id", None)

    prop_id = body.get("id") if is_update else None

    # --- top-level fields ---
    title = body.get("title")
    price = to_decimal(body.get("price"))
    currency = body.get("currency")
    location_text = body.get("location_text") or body.get("place")
    main_image = body.get("main_image")
    images = body.get("images") or body.get("media") or []

    ul_payload = {
        "user_id": user_id,
        "ul_hudluh_type_id": body.get("ul_hudluh_type_id"),
        "source_id": body.get("source_id"),
        "external_id": body.get("external_id"),
        "title": title,
        "price": float(price) if price is not None else None,
        "currency": currency,
        "location_text": location_text,
        "main_image": main_image,
        "view_count": int(body.get("view_count") or 0),
        "image_count": len(images) if isinstance(images, list) else 0,
        "is_active": to_bool(body.get("is_active", True)),
        "is_vip": to_bool(body.get("is_vip", False)),
        "like_count": int(body.get("like_count") or 0),
        "area_size": to_float(body.get("area_size")),
    }

    # Remove None values and protect against id in payload
    ul_payload = {k: v for k, v in ul_payload.items() if v is not None}
    if "id" in ul_payload:
        ul_payload.pop("id", None)

    # --- details ---
    details = body.get("details") or {
        "description": body.get("description"),
        "area_size": body.get("area"),
        "floor_count": body.get("floor_count") or body.get("floor_number"),
        "balcony": body.get("balcony"),
        "usage_status": body.get("usage_status"),
        "expected_completion": body.get("expected_completion"),
        "purpose": body.get("purpose"),
        "loan_type": body.get("loan_type"),
        "is_available": body.get("is_available"),
        "payment_condition": body.get("payment_condition"),
        "latitude": body.get("latitude"),
        "longitude": body.get("longitude"),
        "has_tag": body.get("has_tag"),
        "district_ids": body.get("district_ids") or body.get("districts"),
    }

    if not title and not details.get("description"):
        return JsonResponse({"error": "Гарчиг эсвэл тайлбар шаардлагатай"}, status=400)

    # --- insert/update main record ---
    try:
        if is_update and prop_id:
            print("DEBUG: update property id:", prop_id)
            supabase.table("tbl_ul_hudluh").update(ul_payload).eq("id", prop_id).execute()
            property_id = prop_id
        else:
            # Ensure no id in payload
            if "id" in ul_payload:
                ul_payload.pop("id", None)
            print("DEBUG: insert payload:", ul_payload)
            ins = supabase.table("tbl_ul_hudluh").insert(ul_payload).execute()
            # ins.data should contain inserted row(s)
            if not getattr(ins, "data", None):
                return JsonResponse({"error": "Insert буцаасан data хоосон"}, status=500)
            property_id = ins.data[0]["id"]
    except Exception as e:
        err_str = str(e)
        # helpful message if duplicate key
        if "duplicate key value violates unique constraint" in err_str or "23505" in err_str:
            # suggest sequence fix
            seq_fix = (
                "Postgres duplicate key on id. If your table uses a sequence, run:\n"
                "SELECT setval(pg_get_serial_sequence('tbl_ul_hudluh','id'), (SELECT COALESCE(MAX(id),1) FROM tbl_ul_hudluh)+1, false);\n"
                "Adjust table name if different."
            )
            print("DB duplicate key error:", err_str)
            return JsonResponse({"error": "DB алдаа: " + err_str, "hint": seq_fix}, status=500)
        print("DB error on insert/update:", err_str)
        return JsonResponse({"error": f"DB алдаа: {err_str}"}, status=500)

    # --- details table ---
    details_payload = {
        "property_id": property_id,
        "description": details.get("description"),
        "area_size": to_decimal(details.get("area_size") or details.get("area")),
        "floor_count": details.get("floor_count"),
        "balcony": to_bool(details.get("balcony")),
        "sunlight_direction": details.get("sunlight_direction"),
        "usage_status": details.get("usage_status"),
        "expected_completion": details.get("expected_completion"),
        "purpose": details.get("purpose"),
        "loan_type": details.get("loan_type"),
        "is_available": to_bool(details.get("is_available")),
        "payment_condition": details.get("payment_condition"),
        "latitude": to_float(details.get("latitude")),
        "longitude": to_float(details.get("longitude")),
        "has_tag": to_bool(details.get("has_tag")),
        "district_ids": details.get("district_ids"),
    }
    details_payload = {k: v for k, v in details_payload.items() if v is not None}
    if "id" in details_payload:
        details_payload.pop("id", None)

    try:
        exists = supabase.table("tbl_ul_hudluh_details").select("id").eq("property_id", property_id).execute()
        if getattr(exists, "data", None):
            supabase.table("tbl_ul_hudluh_details").update(details_payload).eq("property_id", property_id).execute()
        else:
            supabase.table("tbl_ul_hudluh_details").insert(details_payload).execute()
    except Exception as e:
        print("Details save error:", str(e))
        return JsonResponse({
            "warning": "Зар амжилттай хадгалагдсан, details хадгалахад алдаа",
            "property_id": property_id,
            "error": str(e)
        }, status=200)

    # --- images ---
    try:
        # images expected to be list of urls/paths
        image_rows = []
        if isinstance(images, list):
            for img in images:
                if not img:
                    continue
                image_rows.append({
                    "property_id": property_id,
                    "image_url": img,
                    "is_main": (img == main_image),
                })

        if is_update:
            supabase.table("tbl_ul_hudluh_images").delete().eq("property_id", property_id).execute()

        if image_rows:
            # ensure no id field in rows
            for r in image_rows:
                if "id" in r: r.pop("id", None)
            supabase.table("tbl_ul_hudluh_images").insert(image_rows).execute()
    except Exception as e:
        print("Images save error:", str(e))
        return JsonResponse({
            "warning": "Зар болон details амжилттай хадгалагдсан, images хадгалахад алдаа",
            "property_id": property_id,
            "error": str(e)
        }, status=200)

    return JsonResponse({
        "status": "ok",
        "message": "Зар амжилттай хадгалагдлаа",
        "property_id": property_id
    }, status=200)


@csrf_exempt
@require_http_methods(["POST"])
def ul_hudluh_jagsaalt_dashboard(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST хүсэлт шаардлагатай"}, status=405)
    try:
        res = supabase.table("tbl_ul_hudluh").select("*").eq("is_active", True).execute()
        return JsonResponse({
            "message": "Амжилттай",
            "data": getattr(res, "data", []) or [],
            "len": len(getattr(res, "data", []) or [])
        })
    except Exception as e:
        print("Dashboard error:", str(e))
        return JsonResponse({"error": f"Алдаа: {str(e)}"}, status=500)
