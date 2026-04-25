'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import ChatIcon from '@mui/icons-material/Chat';
import InboxIcon from '@mui/icons-material/Inbox';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRouter } from 'next/navigation';

import type { SubmissionListItem } from '@/lib/types';

import { PriorityChip } from './priority-chip';
import { StatusChip } from './status-chip';

type SubmissionsTableProps = {
  submissions: SubmissionListItem[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  isLoading: boolean;
  error: string | null;
  onPageChangeAction: (page: number) => void;
  onRetryAction?: () => void;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function LoadingState() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 8 }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={8}>
        <Box
          sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}
        >
          <InboxIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
          <Typography variant="h6" color="text.secondary">
            No submissions found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <TableRow>
      <TableCell colSpan={8}>
        <Box sx={{ py: 4, px: 2 }}>
          <Alert
            severity="error"
            action={
              onRetry ? (
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
                  onClick={onRetry}
                >
                  Retry
                </Button>
              ) : undefined
            }
          >
            {error}
          </Alert>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export function SubmissionsTable({
  submissions,
  totalCount,
  page,
  rowsPerPage,
  isLoading,
  error,
  onPageChangeAction,
  onRetryAction,
}: SubmissionsTableProps) {
  const router = useRouter();

  return (
    <Stack spacing={1}>
      {!isLoading && !error && (
        <Typography variant="body2" color="text.secondary">
          Showing {submissions.length} of {totalCount} submissions
        </Typography>
      )}

      <Card variant="outlined">
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                {[
                  'Company',
                  'Broker',
                  'Status',
                  'Priority',
                  'Owner',
                  'Docs',
                  'Notes',
                  'Created',
                ].map((label) => (
                  <TableCell
                    key={label}
                    sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13 }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {error ? (
                <ErrorState error={error} onRetry={onRetryAction} />
              ) : isLoading ? (
                <LoadingState />
              ) : submissions.length === 0 ? (
                <EmptyState />
              ) : (
                submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    hover
                    onClick={() => router.push(`/submissions/${submission.id}`)}
                    sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                  >
                    <TableCell>
                      <Stack spacing={0.25}>
                        <Typography variant="body2" fontWeight={500}>
                          {submission.company.legalName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {submission.company.industry} • {submission.company.headquartersCity}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>{submission.broker.name}</TableCell>
                    <TableCell>
                      <StatusChip status={submission.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityChip priority={submission.priority} />
                    </TableCell>
                    <TableCell>{submission.owner.fullName}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <DescriptionIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{submission.documentCount}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ChatIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{submission.noteCount}</Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(submission.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!isLoading && !error && totalCount > 0 && (
          <TablePagination
            component="div"
            count={totalCount}
            page={page - 1}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
            onPageChange={(_, nextPage) => onPageChangeAction(nextPage + 1)}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        )}
      </Card>
    </Stack>
  );
}
