from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AnnexClupStatusViewSet,
    AnnexPdpfpStatusViewSet,
    ArchivedRecordViewSet,
    BarangayViewSet,
    ComplianceRecordViewSet,
    DefinitionStatusViewSet,
    HealthCheckView,
    MunicipalityViewSet,
    ProvinceViewSet,
    ResetDatabaseView,
    SystemLogViewSet,
)

router = DefaultRouter(trailing_slash=False)
router.register(r'provinces', ProvinceViewSet, basename='province')
router.register(r'municipalities', MunicipalityViewSet, basename='municipality')
router.register(r'barangays', BarangayViewSet, basename='barangay')
router.register(r'compliance', ComplianceRecordViewSet, basename='compliance')
router.register(r'archives', ArchivedRecordViewSet, basename='archives')
router.register(r'logs', SystemLogViewSet, basename='logs')
router.register(r'annex-clup-status', AnnexClupStatusViewSet, basename='annex-clup-status')
router.register(r'annex-pdpfp-status', AnnexPdpfpStatusViewSet, basename='annex-pdpfp-status')
router.register(r'definition-status', DefinitionStatusViewSet, basename='definition-status')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health'),
    path('reset-db/', ResetDatabaseView.as_view(), name='reset-db'),
]

urlpatterns += router.urls
