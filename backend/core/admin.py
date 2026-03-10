from django.contrib import admin

from .models import (
    ArchivedRecord,
    Barangay,
    ComplianceRecord,
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
