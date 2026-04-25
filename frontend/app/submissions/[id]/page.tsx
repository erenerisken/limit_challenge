'use client';

import { Button, Container, Stack } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useSubmissionDetail } from '@/lib/hooks/useSubmissions';
import { SubmissionDetailView } from '@/components/submissions/detail/submission-detail-view';
import { SubmissionDetailViewPlaceholder } from '@/components/submissions/detail/submission-detail-placeholder';
import { SubmissionDetailError } from '@/components/submissions/detail/submission-detail-error';

export default function SubmissionDetailPage() {
  const router = useRouter();

  const params = useParams<{ id: string }>();
  const submissionId = params?.id ?? '';

  const detailQuery = useSubmissionDetail(submissionId);

  let content;

  if (detailQuery.isLoading) {
    content = <SubmissionDetailViewPlaceholder />;
  } else if (detailQuery.error) {
    content = <SubmissionDetailError onRetryAction={detailQuery.refetch} />;
  } else if (detailQuery.data) {
    content = <SubmissionDetailView submission={detailQuery.data} />;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Stack spacing={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/submissions${window.location.search}`)}
          sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
        >
          Back to Submissions
        </Button>
      </Stack>

      {content}
    </Container>
  );
}
