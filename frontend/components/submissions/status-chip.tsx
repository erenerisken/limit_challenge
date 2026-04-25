import { Chip } from '@mui/material';

import type { SubmissionStatus } from '@/lib/types';

const STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: 'default' | 'info' | 'success' | 'error' }
> = {
  new: { label: 'New', color: 'info' },
  in_review: { label: 'In Review', color: 'info' },
  closed: { label: 'Closed', color: 'success' },
  lost: { label: 'Lost', color: 'error' },
};

export function StatusChip({ status }: { status: SubmissionStatus }) {
  const config = STATUS_CONFIG[status];

  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
