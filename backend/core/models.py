from django.db import models


class Province(models.Model):
    name = models.CharField(max_length=255, unique=True)
    municipalities = models.IntegerField(default=0)
    barangays = models.IntegerField(default=0)
    status = models.CharField(max_length=32, default="active")

    class Meta:
        db_table = "provinces"

    def __str__(self):
        return self.name


class Municipality(models.Model):
    name = models.CharField(max_length=255)
    province = models.ForeignKey(
        Province,
        on_delete=models.CASCADE,
        related_name="municipalities_set",
    )
    barangays = models.IntegerField(default=0)
    status = models.CharField(max_length=32, default="active")
    lastUpdate = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "municipalities"

    def __str__(self):
        return self.name


class Barangay(models.Model):
    name = models.CharField(max_length=255)
    municipality = models.ForeignKey(
        Municipality,
        on_delete=models.CASCADE,
        related_name="barangays_set",
    )
    province = models.ForeignKey(
        Province,
        on_delete=models.CASCADE,
        related_name="barangays_set",
    )
    population = models.IntegerField(default=0)
    status = models.CharField(max_length=32, default="active")

    class Meta:
        db_table = "barangays"

    def __str__(self):
        return self.name


class ComplianceRecord(models.Model):
    municipality = models.ForeignKey(
        Municipality,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="compliance_records",
    )
    province = models.ForeignKey(
        Province,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="compliance_records",
    )
    reportDate = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=255, null=True, blank=True)
    officer = models.CharField(max_length=255, null=True, blank=True)

    planStartYear = models.IntegerField(null=True, blank=True)
    planEndYear = models.IntegerField(null=True, blank=True)
    resolutionNumber = models.CharField(max_length=255, null=True, blank=True)
    approvalDate = models.DateField(null=True, blank=True)
    hardCopyAvailable = models.BooleanField(default=False)
    softCopyUrl = models.CharField(max_length=1024, null=True, blank=True)

    class Meta:
        db_table = "compliance_records"

    def __str__(self):
        return f"ComplianceRecord({self.id})"


class ArchivedRecord(models.Model):
    municipality = models.CharField(max_length=255)
    province = models.CharField(max_length=255)
    records = models.IntegerField(default=0)
    archivedDate = models.DateTimeField(null=True, blank=True)
    reason = models.TextField(blank=True)

    class Meta:
        db_table = "archived_records"

    def __str__(self):
        return f"ArchivedRecord({self.id})"


class SystemLog(models.Model):
    timestamp = models.DateTimeField(null=True, blank=True)
    user = models.CharField(max_length=255, blank=True)
    action = models.CharField(max_length=255, blank=True)
    module = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    details = models.TextField(blank=True)

    class Meta:
        db_table = "system_logs"

    def __str__(self):
        return f"SystemLog({self.id})"
