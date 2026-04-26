'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Container,
  Divider,
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

function getBooleanSelectValue(value?: boolean) {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  return 'any';
}

function parseBooleanSelectValue(value: string) {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return undefined;
}

export function SubmissionsPageContent() {
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const [ordering] = useSearchState<SubmissionOrdering | undefined>({
    name: 'ordering',
    ...searchStatePresets.string<SubmissionOrdering>(),
  });

  const [createdFrom] = useSearchState({
    name: 'createdFrom',
    ...searchStatePresets.string(),
  });

  const [createdTo] = useSearchState({
    name: 'createdTo',
    ...searchStatePresets.string(),
  });

  const [hasDocuments] = useSearchState({
    name: 'hasDocuments',
    ...searchStatePresets.boolean(),
  });

  const [hasNotes] = useSearchState({
    name: 'hasNotes',
    ...searchStatePresets.boolean(),
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
      createdFrom,
      createdTo,
      hasDocuments,
      hasNotes,
    }),
    [
      status,
      brokerId,
      companyQuery,
      page,
      ordering,
      createdFrom,
      createdTo,
      hasDocuments,
      hasNotes,
    ],
  );

  const submissionsQuery = useSubmissionsList(filters);
  const brokerQuery = useBrokerOptions();

  const selectedBroker = brokerQuery.data?.find((broker) => broker.id === brokerId) ?? null;

  const activeAdvancedFilters = [
    createdFrom,
    createdTo,
    hasDocuments !== undefined,
    hasNotes !== undefined,
  ].filter(Boolean).length;

  const hasActiveFilters = Boolean(
    status ||
    brokerId ||
    companyInput ||
    createdFrom ||
    createdTo ||
    hasDocuments !== undefined ||
    hasNotes !== undefined,
  );

  const clearFilters = () => {
    setCompanyInput('');
    setSearchState({
      status: undefined,
      brokerId: undefined,
      companySearch: undefined,
      createdFrom: undefined,
      createdTo: undefined,
      hasDocuments: undefined,
      hasNotes: undefined,
      page: undefined,
    });
  };

  return (
    <Container sx={{ py: 4 }}>
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
          <CardContent sx={{ py: 2.5 }}>
            <Stack>
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
                  fullWidth
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
                    <TextField {...params} label="Broker" fullWidth placeholder="All brokers" />
                  )}
                  sx={{ minWidth: { md: 220 }, maxWidth: { md: 280 } }}
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

                <Stack direction="row" flex={1} spacing={1} justifyContent="space-between">
                  <Button
                    variant="text"
                    size="small"
                    endIcon={
                      <ExpandMoreIcon
                        sx={{
                          transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      />
                    }
                    onClick={() => setShowAdvanced((value) => !value)}
                    sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}
                  >
                    Advanced {activeAdvancedFilters > 0 && `(${activeAdvancedFilters})`}
                  </Button>

                  <Button
                    variant="text"
                    size="small"
                    startIcon={<RestartAltIcon />}
                    disabled={!hasActiveFilters}
                    onClick={clearFilters}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>

              <Collapse in={showAdvanced}>
                <Box sx={{ mt: 2, pt: 1 }}>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ md: 'center' }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        size="small"
                        type="date"
                        label="Created from"
                        value={createdFrom ?? ''}
                        onChange={(event) => {
                          setSearchState({
                            createdFrom: event.target.value || undefined,
                            page: undefined,
                          });
                        }}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        sx={{ width: { sm: 170 } }}
                      />

                      <TextField
                        size="small"
                        type="date"
                        label="Created to"
                        value={createdTo ?? ''}
                        onChange={(event) => {
                          setSearchState({
                            createdTo: event.target.value || undefined,
                            page: undefined,
                          });
                        }}
                        slotProps={{
                          inputLabel: { shrink: true },
                        }}
                        sx={{ width: { sm: 170 } }}
                      />
                    </Stack>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ display: { xs: 'none', md: 'block' } }}
                    />

                    <FormControl size="small" sx={{ minWidth: { md: 150 } }}>
                      <InputLabel id="has-documents-label">Has documents</InputLabel>
                      <Select
                        labelId="has-documents-label"
                        label="Has documents"
                        value={getBooleanSelectValue(hasDocuments)}
                        onChange={(event) => {
                          setSearchState({
                            hasDocuments: parseBooleanSelectValue(event.target.value),
                            page: undefined,
                          });
                        }}
                      >
                        <MenuItem value="any">Any</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: { md: 130 } }}>
                      <InputLabel id="has-notes-label">Has notes</InputLabel>
                      <Select
                        labelId="has-notes-label"
                        label="Has notes"
                        value={getBooleanSelectValue(hasNotes)}
                        onChange={(event) => {
                          setSearchState({
                            hasNotes: parseBooleanSelectValue(event.target.value),
                            page: undefined,
                          });
                        }}
                      >
                        <MenuItem value="any">Any</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </Box>
              </Collapse>
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
          onOrderingChangeAction={(nextOrdering) => {
            setSearchState({
              ordering: nextOrdering,
              page: undefined,
            });
          }}
        />
      </Stack>
    </Container>
  );
}
