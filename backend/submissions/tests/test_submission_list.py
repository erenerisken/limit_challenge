from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase

from submissions import models


class SubmissionListTests(APITestCase):
    def setUp(self):
        self.url = reverse("submission-list")

        self.broker_a = models.Broker.objects.create(name="Alpha Broker")
        self.broker_b = models.Broker.objects.create(name="Beta Broker")
        self.broker_c = models.Broker.objects.create(name="Gamma Broker")

        self.company_a = models.Company.objects.create(
            legal_name="Acme Inc",
            industry="Tech",
            headquarters_city="NY",
        )
        self.company_b = models.Company.objects.create(
            legal_name="Beta Manufacturing",
            industry="Manufacturing",
            headquarters_city="LA",
        )
        self.company_c = models.Company.objects.create(
            legal_name="Cyberdyne Systems",
            industry="Robotics",
            headquarters_city="Austin",
        )

        self.owner = models.TeamMember.objects.create(
            full_name="John Doe",
            email="john@example.com",
        )

        self.sub_high = models.Submission.objects.create(
            broker=self.broker_b,
            company=self.company_b,
            owner=self.owner,
            status=models.Submission.Status.NEW,
            priority=models.Submission.Priority.HIGH,
            summary="High priority submission",
        )
        self.sub_medium = models.Submission.objects.create(
            broker=self.broker_a,
            company=self.company_a,
            owner=self.owner,
            status=models.Submission.Status.IN_REVIEW,
            priority=models.Submission.Priority.MEDIUM,
            summary="Medium priority submission",
        )
        self.sub_low = models.Submission.objects.create(
            broker=self.broker_c,
            company=self.company_c,
            owner=self.owner,
            status=models.Submission.Status.CLOSED,
            priority=models.Submission.Priority.LOW,
            summary="Low priority submission",
        )

        models.Document.objects.create(
            submission=self.sub_high,
            title="High Summary",
            doc_type="Summary",
        )
        models.Document.objects.create(
            submission=self.sub_high,
            title="High Contract",
            doc_type="Contract",
        )
        models.Document.objects.create(
            submission=self.sub_medium,
            title="Medium Spreadsheet",
            doc_type="Spreadsheet",
        )

        models.Note.objects.create(
            submission=self.sub_high,
            author_name="Jane",
            body="First high note",
        )
        models.Note.objects.create(
            submission=self.sub_high,
            author_name="Jane",
            body="Second high note",
        )
        models.Note.objects.create(
            submission=self.sub_low,
            author_name="Jack",
            body="Low note",
        )

        self.created_old = timezone.now() - timedelta(days=3)
        self.created_middle = timezone.now() - timedelta(days=2)
        self.created_new = timezone.now() - timedelta(days=1)

        self.updated_old = timezone.now() - timedelta(hours=3)
        self.updated_middle = timezone.now() - timedelta(hours=2)
        self.updated_new = timezone.now() - timedelta(hours=1)

        models.Submission.objects.filter(pk=self.sub_high.pk).update(
            created_at=self.created_middle,
            updated_at=self.updated_new,
        )
        models.Submission.objects.filter(pk=self.sub_medium.pk).update(
            created_at=self.created_old,
            updated_at=self.updated_middle,
        )
        models.Submission.objects.filter(pk=self.sub_low.pk).update(
            created_at=self.created_new,
            updated_at=self.updated_old,
        )

        self.sub_high.refresh_from_db()
        self.sub_medium.refresh_from_db()
        self.sub_low.refresh_from_db()

    def get_results(self, params=None):
        response = self.client.get(self.url, params or {})
        self.assertEqual(response.status_code, 200)
        return response.data["results"]

    def assert_result_ids(self, results, expected_ids):
        self.assertEqual([result["id"] for result in results], expected_ids)

    def test_filter_by_status(self):
        results = self.get_results({"status": models.Submission.Status.IN_REVIEW})

        self.assert_result_ids(results, [self.sub_medium.id])

    def test_filter_by_broker_id(self):
        results = self.get_results({"brokerId": self.broker_b.id})

        self.assert_result_ids(results, [self.sub_high.id])

    def test_filter_by_company_search(self):
        results = self.get_results({"companySearch": "acme"})

        self.assert_result_ids(results, [self.sub_medium.id])

    def test_filter_by_company_search_ignores_blank_value(self):
        results = self.get_results({"companySearch": "   "})

        self.assertEqual(len(results), 3)

    def test_filter_created_from(self):
        results = self.get_results({"createdFrom": self.created_middle.isoformat()})

        self.assert_result_ids(results, [self.sub_low.id, self.sub_high.id])

    def test_filter_created_to(self):
        results = self.get_results({"createdTo": self.created_middle.isoformat()})

        self.assert_result_ids(results, [self.sub_high.id, self.sub_medium.id])

    def test_filter_created_from_and_created_to(self):
        results = self.get_results(
            {
                "createdFrom": self.created_middle.isoformat(),
                "createdTo": self.created_middle.isoformat(),
            },
        )

        self.assert_result_ids(results, [self.sub_high.id])

    def test_filter_has_documents_true(self):
        results = self.get_results({"hasDocuments": "true"})

        self.assert_result_ids(results, [self.sub_high.id, self.sub_medium.id])

    def test_filter_has_documents_false(self):
        results = self.get_results({"hasDocuments": "false"})

        self.assert_result_ids(results, [self.sub_low.id])

    def test_filter_has_notes_true(self):
        results = self.get_results({"hasNotes": "true"})

        self.assert_result_ids(results, [self.sub_low.id, self.sub_high.id])

    def test_filter_has_notes_false(self):
        results = self.get_results({"hasNotes": "false"})

        self.assert_result_ids(results, [self.sub_medium.id])

    def test_ordering_by_created_at(self):
        results = self.get_results({"ordering": "created_at"})

        self.assert_result_ids(
            results,
            [self.sub_medium.id, self.sub_high.id, self.sub_low.id],
        )

    def test_ordering_by_updated_at(self):
        results = self.get_results({"ordering": "updated_at"})

        self.assert_result_ids(
            results,
            [self.sub_low.id, self.sub_medium.id, self.sub_high.id],
        )

    def test_ordering_by_priority_order(self):
        results = self.get_results({"ordering": "priority_order"})

        self.assert_result_ids(
            results,
            [self.sub_high.id, self.sub_medium.id, self.sub_low.id],
        )

    def test_ordering_by_status(self):
        results = self.get_results({"ordering": "status"})

        self.assert_result_ids(
            results,
            [self.sub_low.id, self.sub_medium.id, self.sub_high.id],
        )

    def test_ordering_by_company_legal_name(self):
        results = self.get_results({"ordering": "company__legal_name"})

        self.assert_result_ids(
            results,
            [self.sub_medium.id, self.sub_high.id, self.sub_low.id],
        )

    def test_ordering_by_broker_name(self):
        results = self.get_results({"ordering": "broker__name"})

        self.assert_result_ids(
            results,
            [self.sub_medium.id, self.sub_high.id, self.sub_low.id],
        )

    def test_ordering_by_document_count(self):
        results = self.get_results({"ordering": "document_count"})

        self.assert_result_ids(
            results,
            [self.sub_low.id, self.sub_medium.id, self.sub_high.id],
        )

    def test_ordering_by_note_count(self):
        results = self.get_results({"ordering": "note_count"})

        self.assert_result_ids(
            results,
            [self.sub_medium.id, self.sub_low.id, self.sub_high.id],
        )

    def test_descending_ordering(self):
        results = self.get_results({"ordering": "-broker__name"})

        self.assert_result_ids(
            results,
            [self.sub_low.id, self.sub_high.id, self.sub_medium.id],
        )
