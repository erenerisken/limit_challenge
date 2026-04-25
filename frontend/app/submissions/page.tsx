'use client';

import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import { SubmissionsTable } from '@/components/submissions/submissions-table';
import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { searchStatePresets, useSearchState } from '@/lib/hooks/useSearchState';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionStatus } from '@/lib/types';

const ROWS_PER_PAGE = 10;

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export default function SubmissionsPage() {
  const [status, setStatus] = useSearchState<SubmissionStatus | undefined>({
    name: 'status',
    ...searchStatePresets.string<SubmissionStatus>(),
  });

  const [brokerId, setBrokerId] = useSearchState({
    name: 'brokerId',
    ...searchStatePresets.number(),
  });

  const [companyQuery, setCompanyQuery] = useSearchState({
    name: 'companySearch',
    ...searchStatePresets.string(),
  });

  const [page, setPage] = useSearchState({
    name: 'page',
    defaultValue: 1,
    ...searchStatePresets.number(),
  });

  const filters = useMemo(
    () => ({
      status,
      brokerId: brokerId ? String(brokerId) : undefined,
      companySearch: companyQuery,
      page,
    }),
    [status, brokerId, companyQuery, page],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  const resetPage = () => {
    setPage(1);
  };

  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
          <Typography color="text.secondary">
            Review broker-submitted opportunities and filter by status, broker, or company.
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Status"
                value={status ?? ''}
                onChange={(event) => {
                  setStatus((event.target.value || undefined) as SubmissionStatus | undefined);
                  resetPage();
                }}
                fullWidth
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                fullWidth
                options={brokerQuery.data ?? []}
                loading={brokerQuery.isLoading}
                value={brokerQuery.data?.find((broker) => broker.id === brokerId) ?? null}
                onChange={(_, broker) => {
                  setBrokerId(broker?.id);
                  resetPage();
                }}
                getOptionLabel={(broker) => broker.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Broker" helperText="Search and filter by broker" />
                )}
              />

              <TextField
                label="Company search"
                value={companyQuery ?? ''}
                onChange={(event) => {
                  setCompanyQuery(event.target.value || undefined);
                  resetPage();
                }}
                fullWidth
                helperText="Search by company legal name"
              />
            </Stack>
          </CardContent>
        </Card>

        <Stack>
          <SubmissionsTable
            submissions={submissionsQuery.data?.results ?? []}
            totalCount={submissionsQuery.data?.count ?? 0}
            page={page ?? 1}
            rowsPerPage={ROWS_PER_PAGE}
            isLoading={submissionsQuery.isLoading}
            error={submissionsQuery.error ? 'Failed to load submissions.' : null}
            onRetryAction={() => submissionsQuery.refetch()}
            onPageChangeAction={setPage}
          />
        </Stack>
      </Stack>
    </Container>
  );
}
