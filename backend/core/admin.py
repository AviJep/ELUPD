from django.contrib import admin

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


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status')
    search_fields = ('name',)


@admin.register(Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'province', 'status')
    search_fields = ('name',)


@admin.register(Barangay)
class BarangayAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'municipality', 'province', 'status')
    search_fields = ('name',)


@admin.register(ComplianceRecord)
class ComplianceRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'municipality', 'province', 'reportDate', 'status', 'officer')


@admin.register(ArchivedRecord)
class ArchivedRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'municipality', 'province', 'archivedDate')


@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp', 'user', 'action', 'module', 'status')
    ordering = ('-timestamp',)


@admin.register(AnnexClupStatus)
class AnnexClupStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'cityMunicipality', 'province', 'clupStatus', 'currentProgress')
    list_filter = ('province', 'clupStatus', 'currentProgress')
    search_fields = ('cityMunicipality', 'province', 'resolutionNumber')


@admin.register(AnnexPdpfpStatus)
class AnnexPdpfpStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'region', 'province', 'status', 'version', 'yearApproved', 'yearAdopted')
    list_filter = ('region', 'status', 'withLocalShelterPlan')
    search_fields = ('province', 'version', 'resolutionApprovingPlan')


@admin.register(DefinitionStatus)
class DefinitionStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'className', 'subclass')
    list_filter = ('className',)
    search_fields = ('className', 'subclass', 'definition', 'meansOfVerification')
