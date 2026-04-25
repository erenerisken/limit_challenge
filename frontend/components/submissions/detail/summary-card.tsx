import { Card, Typography } from '@mui/material';

type SummaryCardProps = {
  summary: string;
};

export function SummaryCard({ summary }: SummaryCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Summary
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {summary}
      </Typography>
    </Card>
  );
}
