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

    riskInformed = models.BooleanField(default=False)
    integratedShelterPlan = models.BooleanField(default=False)

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


class AnnexClupStatus(models.Model):
    cityMunicipality = models.CharField(max_length=255)
    province = models.CharField(max_length=255)
    planningStartYear = models.IntegerField(null=True, blank=True)
    planningEndYear = models.IntegerField(null=True, blank=True)
    resolutionNumber = models.CharField(max_length=255, null=True, blank=True)
    clupStatus = models.CharField(max_length=100, null=True, blank=True)
    prePhase = models.BooleanField(default=False)
    phase1 = models.BooleanField(default=False)
    phase2 = models.BooleanField(default=False)
    phase3 = models.BooleanField(default=False)
    phase4 = models.BooleanField(default=False)
    phase5 = models.BooleanField(default=False)
    currentProgress = models.CharField(max_length=100, blank=True, default="")

    class Meta:
        db_table = "annex_clup_status"
        unique_together = (("cityMunicipality", "province"),)

    def __str__(self):
        return f"{self.cityMunicipality}, {self.province}"


class AnnexPdpfpStatus(models.Model):
    region = models.CharField(max_length=255)
    province = models.CharField(max_length=255)
    incomeClassification = models.CharField(max_length=100, null=True, blank=True)
    version = models.CharField(max_length=100, null=True, blank=True)
    startYear = models.IntegerField(null=True, blank=True)
    endYear = models.IntegerField(null=True, blank=True)
    resolutionApprovingPlan = models.CharField(max_length=255, null=True, blank=True)
    yearApproved = models.IntegerField(null=True, blank=True)
    yearAdopted = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=100)
    technicalAssistance = models.TextField(null=True, blank=True)
    supportFromOtherInstitutions = models.TextField(null=True, blank=True)
    withLocalShelterPlan = models.CharField(max_length=100, null=True, blank=True)
    institutions = models.TextField(null=True, blank=True)
    remarks = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "annex_pdpfp_status"
        unique_together = (("province", "version"),)

    def __str__(self):
        return f"{self.province} ({self.status})"


class DefinitionStatus(models.Model):
    className = models.CharField(max_length=255, null=True, blank=True)
    subclass = models.CharField(max_length=255, null=True, blank=True)
    definition = models.TextField(null=True, blank=True)
    meansOfVerification = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "definition_status"

    def __str__(self):
        if self.className and self.subclass:
            return f"{self.className} - {self.subclass}"
        return self.className or self.subclass or f"DefinitionStatus({self.id})"
