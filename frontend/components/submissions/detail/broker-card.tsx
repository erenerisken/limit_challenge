import EmailIcon from '@mui/icons-material/Email';
import { Card, Stack, Typography } from '@mui/material';

import type { SubmissionDetail } from '@/lib/types';

type BrokerCardProps = {
  broker: SubmissionDetail['broker'];
};

export function BrokerCard({ broker }: BrokerCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Broker
      </Typography>

      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={500}>
          {broker.name}
        </Typography>

        {broker.primaryContactEmail ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {broker.primaryContactEmail}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No primary contact email.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}
