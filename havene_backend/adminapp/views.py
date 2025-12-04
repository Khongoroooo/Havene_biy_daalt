from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from havene_backend.supabase_client import supabase  # эсвэл adminapp дотор байвал .supabase_client

class TblUneguiAPIView(APIView):
    """
    Supabase tbl_unegui table-ээс бүх data-г авч харуулна.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            response = supabase.table("tbl_unegui").select("*").execute()
            
            # Шинэ Supabase client хувилбар дээр:
            # response.data → data array
            # response.status_code → HTTP status
            # response.error → алдаа байхгүй, exception л гарна
            
            return Response(
                {"count": len(response.data), "results": response.data},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": "Failed to fetch data", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
