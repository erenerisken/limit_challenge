'use client';

import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';

import { searchStatePresets, useSearchState } from '@/lib/hooks/useSearchState';
import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionStatus } from '@/lib/types';

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

  const filters = useMemo(
    () => ({
      status,
      brokerId: brokerId ? String(brokerId) : undefined,
      companySearch: companyQuery,
    }),
    [status, brokerId, companyQuery],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1">
            Submissions
          </Typography>
          <Typography color="text.secondary">
            Filters are synced with the URL and drive backend filtering.
          </Typography>
        </Box>

        <Card variant="outlined">
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                label="Status"
                value={status ?? ''}
                onChange={(event) =>
                  setStatus((event.target.value || undefined) as SubmissionStatus | undefined)
                }
                fullWidth
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value || 'all'} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Broker"
                value={brokerId ? String(brokerId) : ''}
                onChange={(event) =>
                  setBrokerId(event.target.value ? Number(event.target.value) : undefined)
                }
                fullWidth
                helperText="Populate options via /api/brokers"
              >
                <MenuItem value="">All brokers</MenuItem>
                {brokerQuery.data?.map((broker) => (
                  <MenuItem key={broker.id} value={String(broker.id)}>
                    {broker.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Company search"
                value={companyQuery ?? ''}
                onChange={(event) => setCompanyQuery(event.target.value || undefined)}
                fullWidth
                helperText="Send as ?companySearch=..."
              />
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Submission list</Typography>
              <Typography color="text.secondary">
                Hook `submissionsQuery` to render rows, totals, and pagination states.
              </Typography>
              <Divider />
              <Box>
                <pre style={{ margin: 0, fontSize: 14 }}>
                  {JSON.stringify({ filters }, null, 2)}
                </pre>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
