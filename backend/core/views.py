from django.db import transaction
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AnnexClupStatus,
    AnnexPdpfpStatus,
    ArchivedRecord,
    Barangay,
    ComplianceRecord,
    DefinitionStatus,
    Municipality,
    Province,
    SystemLog,
)
from .serializers import (
    AnnexClupStatusSerializer,
    AnnexPdpfpStatusSerializer,
    ArchivedRecordSerializer,
    BarangaySerializer,
    ComplianceRecordSerializer,
    DefinitionStatusSerializer,
    MunicipalitySerializer,
    ProvinceSerializer,
    SystemLogSerializer,
)


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all().order_by('id')
    serializer_class = ProvinceSerializer


class MunicipalityViewSet(viewsets.ModelViewSet):
    queryset = Municipality.objects.all().order_by('id')
    serializer_class = MunicipalitySerializer


class BarangayViewSet(viewsets.ModelViewSet):
    queryset = Barangay.objects.all().order_by('id')
    serializer_class = BarangaySerializer


class ComplianceRecordViewSet(viewsets.ModelViewSet):
    queryset = ComplianceRecord.objects.all().order_by('id')
    serializer_class = ComplianceRecordSerializer


class ArchivedRecordViewSet(viewsets.ModelViewSet):
    queryset = ArchivedRecord.objects.all().order_by('id')
    serializer_class = ArchivedRecordSerializer


class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = SystemLog.objects.all().order_by('-timestamp')
    serializer_class = SystemLogSerializer


class AnnexClupStatusViewSet(viewsets.ModelViewSet):
    queryset = AnnexClupStatus.objects.all().order_by('province', 'cityMunicipality')
    serializer_class = AnnexClupStatusSerializer


class AnnexPdpfpStatusViewSet(viewsets.ModelViewSet):
    queryset = AnnexPdpfpStatus.objects.all().order_by('province')
    serializer_class = AnnexPdpfpStatusSerializer


class DefinitionStatusViewSet(viewsets.ModelViewSet):
    queryset = DefinitionStatus.objects.all().order_by('className', 'subclass', 'id')
    serializer_class = DefinitionStatusSerializer


class HealthCheckView(APIView):
    def get(self, request):
        return Response({'status': 'ok'})


class ResetDatabaseView(APIView):
    def post(self, request):
        with transaction.atomic():
            SystemLog.objects.all().delete()
            ArchivedRecord.objects.all().delete()
            ComplianceRecord.objects.all().delete()
            Barangay.objects.all().delete()
            Municipality.objects.all().delete()
            Province.objects.all().delete()
        return Response({'status': 'ok', 'message': 'Database cleared'})
