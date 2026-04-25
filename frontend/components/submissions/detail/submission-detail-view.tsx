'use client';

import { Box, Stack, Typography } from '@mui/material';

import { PriorityChip } from '../priority-chip';
import { StatusChip } from '../status-chip';
import type { SubmissionDetail } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';
import { BrokerCard } from './broker-card';
import { CompanyCard } from './company-card';
import { ContactsCard } from './contacts-card';
import { DocumentsCard } from './documents-card';
import { NotesCard } from './notes-card';
import { OwnerCard } from './owner-card';
import { SummaryCard } from './summary-card';

type SubmissionDetailViewProps = {
  submission: SubmissionDetail;
};

export function SubmissionDetailView({ submission }: SubmissionDetailViewProps) {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={600}>
            {submission.company.legalName}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <StatusChip status={submission.status} />
            <PriorityChip priority={submission.priority} />
            <Typography variant="body2" color="text.secondary">
              Created {formatDate(submission.createdAt)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          <SummaryCard summary={submission.summary} />
          <DocumentsCard documents={submission.documents} />
          <NotesCard notes={submission.notes} />
        </Stack>

        <Stack spacing={3}>
          <CompanyCard company={submission.company} />
          <BrokerCard broker={submission.broker} />
          <OwnerCard owner={submission.owner} />
          <ContactsCard contacts={submission.contacts} />
        </Stack>
      </Box>
    </Stack>
  );
}
