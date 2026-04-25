from django.db.models import Case, Count, IntegerField, OuterRef, Subquery, When
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from submissions import models, serializers
from submissions.filters.submission import SubmissionFilterSet


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Submission.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = SubmissionFilterSet
    ordering_fields = [
        "created_at",
        "updated_at",
        "priority_order",
        "status",
        "company__legal_name",
        "broker__name",
        "document_count",
        "note_count",
    ]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = super().get_queryset().select_related(
            "broker",
            "company",
            "owner",
        )

        if self.action == "list":
            latest_note = models.Note.objects.filter(
                submission_id=OuterRef("pk"),
            ).order_by("-created_at")

            return queryset.annotate(
                document_count=Count("documents", distinct=True),
                note_count=Count("notes", distinct=True),
                latest_note_author=Subquery(latest_note.values("author_name")[:1]),
                latest_note_body=Subquery(latest_note.values("body")[:1]),
                latest_note_created_at=Subquery(latest_note.values("created_at")[:1]),
                priority_order=Case(
                    When(priority=models.Submission.Priority.HIGH, then=1),
                    When(priority=models.Submission.Priority.MEDIUM, then=2),
                    When(priority=models.Submission.Priority.LOW, then=3),
                    output_field=IntegerField(),
                ),
            )

        return queryset.prefetch_related(
            "contacts",
            "documents",
            "notes",
        )

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.SubmissionListSerializer
        return serializers.SubmissionDetailSerializer


class BrokerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Broker.objects.all().order_by("name")
    serializer_class = serializers.BrokerSerializer
    pagination_class = None
