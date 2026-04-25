import { Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

type SubmissionDetailErrorProps = {
  message?: string;
  onRetryAction?: () => void;
};

export function SubmissionDetailError({
  message = 'Failed to load submission details.',
  onRetryAction,
}: SubmissionDetailErrorProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetryAction ? (
          <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetryAction}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
}
