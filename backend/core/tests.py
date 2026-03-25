from django.test import TestCase

from .models import AnnexClupStatus, AnnexPdpfpStatus, DefinitionStatus


class AnnexApiEndpointTests(TestCase):
	@classmethod
	def setUpTestData(cls):
		AnnexClupStatus.objects.create(
			cityMunicipality="Sample City",
			province="Negros Occidental",
			planningStartYear=2020,
			planningEndYear=2030,
			resolutionNumber="SP-001",
			clupStatus="For Updating",
			prePhase=True,
			phase1=False,
			phase2=False,
			phase3=False,
			phase4=False,
			phase5=False,
			currentProgress="Prephase",
		)

		AnnexPdpfpStatus.objects.create(
			region="Negros Island Region",
			province="Negros Occidental",
			incomeClassification="1st",
			version="2nd",
			startYear=2023,
			endYear=2028,
			resolutionApprovingPlan="DHSUD DC 2024-014",
			yearApproved=2024,
			yearAdopted=2023,
			status="Approved/Updated",
		)

		DefinitionStatus.objects.create(
			className="CLUP Status",
			subclass="Updated",
			definition="Within planning period.",
			meansOfVerification="Resolution and approval record",
		)

	def test_annex_clup_status_endpoint_returns_rows(self):
		response = self.client.get("/api/annex-clup-status")

		self.assertEqual(response.status_code, 200)
		payload = response.json()
		self.assertIsInstance(payload, list)
		self.assertGreaterEqual(len(payload), 1)
		first = payload[0]
		self.assertIn("cityMunicipality", first)
		self.assertIn("province", first)
		self.assertIn("clupStatus", first)
		self.assertIn("currentProgress", first)

	def test_annex_pdpfp_status_endpoint_returns_rows(self):
		response = self.client.get("/api/annex-pdpfp-status")

		self.assertEqual(response.status_code, 200)
		payload = response.json()
		self.assertIsInstance(payload, list)
		self.assertGreaterEqual(len(payload), 1)
		first = payload[0]
		self.assertIn("region", first)
		self.assertIn("province", first)
		self.assertIn("status", first)
		self.assertIn("yearApproved", first)

	def test_definition_status_endpoint_returns_rows(self):
		response = self.client.get("/api/definition-status")

		self.assertEqual(response.status_code, 200)
		payload = response.json()
		self.assertIsInstance(payload, list)
		self.assertGreaterEqual(len(payload), 1)
		first = payload[0]
		self.assertIn("className", first)
		self.assertIn("subclass", first)
		self.assertIn("definition", first)
