from rest_framework import serializers

from .models import (
    ArchivedRecord,
    Barangay,
    ComplianceRecord,
    Municipality,
    Province,
    SystemLog,
)


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = '__all__'


class MunicipalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipality
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['province'] = instance.province.name if instance.province else ""
        return representation


class BarangaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Barangay
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['province'] = instance.province.name if instance.province else ""
        representation['municipality'] = instance.municipality.name if instance.municipality else ""
        return representation


class ComplianceRecordSerializer(serializers.ModelSerializer):
    province = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    municipality = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = ComplianceRecord
        fields = '__all__'

    def _get_or_create_province(self, name: str):
        if not name:
            return None
        province, _ = Province.objects.get_or_create(name=name)
        return province

    def _get_or_create_municipality(self, name: str, province: Province | None):
        if not name:
            return None
        defaults = {'province': province} if province else {}
        municipality, _ = Municipality.objects.get_or_create(
            name=name, defaults=defaults
        )
        # If municipality exists but has no province and we can provide one, update it
        if municipality and province and municipality.province is None:
            municipality.province = province
            municipality.save(update_fields=['province'])
        return municipality

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Return the string names for province and municipality for the frontend
        representation['province'] = instance.province.name if instance.province else ""
        representation['municipality'] = instance.municipality.name if instance.municipality else ""
        return representation

    def create(self, validated_data):
        province_name = validated_data.pop('province', None)
        municipality_name = validated_data.pop('municipality', None)
        province = self._get_or_create_province(province_name)
        municipality = self._get_or_create_municipality(municipality_name, province)
        return ComplianceRecord.objects.create(
            province=province,
            municipality=municipality,
            **validated_data,
        )

    def update(self, instance, validated_data):
        province_name = validated_data.pop('province', None)
        municipality_name = validated_data.pop('municipality', None)
        if province_name is not None:
            instance.province = self._get_or_create_province(province_name)
        if municipality_name is not None:
            instance.municipality = self._get_or_create_municipality(
                municipality_name, instance.province
            )
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ArchivedRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchivedRecord
        fields = '__all__'


class SystemLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = '__all__'
