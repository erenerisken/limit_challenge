'use client';

import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { SubmissionsTable } from '@/components/submissions/submissions-table';
import { useBrokerOptions } from '@/lib/hooks/useBrokerOptions';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { searchStatePresets, useSearchState } from '@/lib/hooks/useSearchState';
import { useSubmissionsList } from '@/lib/hooks/useSubmissions';
import { SubmissionOrdering, SubmissionStatus } from '@/lib/types';

const ROWS_PER_PAGE = 10;

const STATUS_OPTIONS: { label: string; value: SubmissionStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Closed', value: 'closed' },
  { label: 'Lost', value: 'lost' },
];

export default function SubmissionsPage() {
  const [status, , setSearchState] = useSearchState<SubmissionStatus | undefined>({
    name: 'status',
    ...searchStatePresets.string<SubmissionStatus>(),
  });

  const [brokerId] = useSearchState({
    name: 'brokerId',
    ...searchStatePresets.number(),
  });

  const [companyQuery] = useSearchState({
    name: 'companySearch',
    ...searchStatePresets.string(),
  });

  const [ordering, setOrdering] = useSearchState<SubmissionOrdering | undefined>({
    name: 'ordering',
    ...searchStatePresets.string<SubmissionOrdering>(),
  });

  const [companyInput, setCompanyInput] = useState(companyQuery ?? '');
  const debouncedCompanyInput = useDebounce(companyInput);

  const [page] = useSearchState({
    name: 'page',
    defaultValue: 1,
    ...searchStatePresets.number(),
  });

  useEffect(() => {
    if ((companyQuery ?? '') === debouncedCompanyInput) return;

    setSearchState({
      companySearch: debouncedCompanyInput || undefined,
      page: undefined,
    });
  }, [companyQuery, debouncedCompanyInput, setSearchState]);

  const filters = useMemo(
    () => ({
      status,
      brokerId: brokerId ? String(brokerId) : undefined,
      companySearch: companyQuery,
      page,
      ordering,
    }),
    [status, brokerId, companyQuery, page, ordering],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  const selectedBroker = brokerQuery.data?.find((broker) => broker.id === brokerId) ?? null;
  const hasActiveFilters = Boolean(status || brokerId || companyInput);

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
          <CardContent sx={{ py: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <FormControl size="small" sx={{ minWidth: { md: 180 } }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  label="Status"
                  value={status ?? ''}
                  onChange={(event) => {
                    setSearchState({
                      status: event.target.value || undefined,
                      page: undefined,
                    });
                  }}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value || 'all'} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete
                size="small"
                options={brokerQuery.data ?? []}
                loading={brokerQuery.isLoading}
                value={selectedBroker}
                onChange={(_, broker) => {
                  setSearchState({
                    brokerId: broker?.id,
                    page: undefined,
                  });
                }}
                getOptionLabel={(broker) => broker.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Broker" placeholder="All brokers" />
                )}
                sx={{ minWidth: { md: 220 } }}
              />

              <TextField
                size="small"
                placeholder="Search company..."
                value={companyInput}
                onChange={(event) => setCompanyInput(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ minWidth: { md: 260 }, flexGrow: 1, maxWidth: { md: 320 } }}
              />

              <Button
                variant="text"
                size="small"
                startIcon={<RestartAltIcon />}
                disabled={!hasActiveFilters}
                onClick={() => {
                  setCompanyInput('');
                  setSearchState({
                    status: undefined,
                    brokerId: undefined,
                    companySearch: undefined,
                    page: undefined,
                  });
                }}
                sx={{ whiteSpace: 'nowrap', marginLeft: { md: 'auto !important' } }}
              >
                Clear
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <SubmissionsTable
          submissions={submissionsQuery.data?.results ?? []}
          totalCount={submissionsQuery.data?.count ?? 0}
          page={page ?? 1}
          rowsPerPage={ROWS_PER_PAGE}
          isLoading={submissionsQuery.isLoading}
          error={submissionsQuery.error ? 'Failed to load submissions.' : null}
          onRetryAction={() => submissionsQuery.refetch()}
          onPageChangeAction={(nextPage) => {
            setSearchState({ page: nextPage });
          }}
          ordering={ordering}
          onOrderingChangeAction={setOrdering}
        />
      </Stack>
    </Container>
  );
}
