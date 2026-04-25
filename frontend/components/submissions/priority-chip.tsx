import { Chip } from '@mui/material';

import type { SubmissionPriority } from '@/lib/types';

const PRIORITY_CONFIG: Record<
  SubmissionPriority,
  { label: string; color: 'default' | 'warning' | 'info' }
> = {
  high: { label: 'High', color: 'warning' },
  medium: { label: 'Medium', color: 'info' },
  low: { label: 'Low', color: 'default' },
};

export function PriorityChip({ priority }: { priority: SubmissionPriority }) {
  const config = PRIORITY_CONFIG[priority];

  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
