import BusinessIcon from '@mui/icons-material/Business';
import { Box, Card, Stack, Typography } from '@mui/material';

import type { SubmissionDetail } from '@/lib/types';

type CompanyCardProps = {
  company: SubmissionDetail['company'];
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <BusinessIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="h6" fontWeight={600}>
          Company
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Legal name
          </Typography>
          <Typography variant="body2">{company.legalName}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Industry
          </Typography>
          <Typography variant="body2">{company.industry}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">
            Headquarters
          </Typography>
          <Typography variant="body2">{company.headquartersCity}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}
