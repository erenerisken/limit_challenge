import django_filters

from submissions import models


class SubmissionFilterSet(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(
        field_name="status",
        choices=models.Submission.Status.choices,
    )
    brokerId = django_filters.NumberFilter(field_name="broker_id")
    companySearch = django_filters.CharFilter(method="filter_company_search")

    createdFrom = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="gte",
    )
    createdTo = django_filters.IsoDateTimeFilter(
        field_name="created_at",
        lookup_expr="lte",
    )

    hasDocuments = django_filters.BooleanFilter(method="filter_has_documents")
    hasNotes = django_filters.BooleanFilter(method="filter_has_notes")

    class Meta:
        model = models.Submission
        fields = [
            "status",
            "brokerId",
            "companySearch",
            "createdFrom",
            "createdTo",
            "hasDocuments",
            "hasNotes",
        ]

    def filter_company_search(self, queryset, name, value):
        value = value.strip()
        if not value:
            return queryset

        return queryset.filter(company__legal_name__icontains=value)

    def filter_has_documents(self, queryset, name, value):
        if value is None:
            return queryset

        lookup = {"documents__isnull": not value}
        return queryset.filter(**lookup).distinct()

    def filter_has_notes(self, queryset, name, value):
        if value is None:
            return queryset

        lookup = {"notes__isnull": not value}
        return queryset.filter(**lookup).distinct()
