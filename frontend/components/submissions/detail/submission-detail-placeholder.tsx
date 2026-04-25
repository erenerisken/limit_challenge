import { Box, Card, Skeleton, Stack } from '@mui/material';

export function SubmissionDetailViewPlaceholder() {
  return (
    <Stack spacing={3}>
      {/* Header */}

      <Stack spacing={1}>
        <Skeleton width="40%" height={40} />
        <Stack direction="row" spacing={1} alignItems="center">
          <Skeleton width={80} height={28} />
          <Skeleton width={80} height={28} />
          <Skeleton width={140} height={20} />
        </Stack>
      </Stack>

      {/* Main Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        {/* LEFT */}
        <Stack spacing={3}>
          {/* Summary */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Skeleton width={120} height={28} sx={{ mb: 2 }} />
            <Skeleton width="100%" />
            <Skeleton width="90%" />
            <Skeleton width="60%" />
          </Card>

          {/* Documents */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton width={120} height={28} />
              <Skeleton width={30} height={24} />
            </Stack>

            <Stack spacing={2}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Stack key={i} direction="row" justifyContent="space-between">
                  <Stack direction="row" spacing={2}>
                    <Skeleton width={24} height={24} />
                    <Stack spacing={0.5}>
                      <Skeleton width={180} />
                      <Skeleton width={120} />
                    </Stack>
                  </Stack>
                  <Skeleton width={90} height={32} />
                </Stack>
              ))}
            </Stack>
          </Card>

          {/* Notes */}
          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" mb={2}>
              <Skeleton width={100} height={28} />
              <Skeleton width={30} height={24} />
            </Stack>

            <Stack spacing={2}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Stack key={i} direction="row" spacing={2}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Skeleton width={140} />
                    <Skeleton width="80%" />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Stack>

        {/* RIGHT */}
        <Stack spacing={3}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} variant="outlined" sx={{ p: 3 }}>
              <Skeleton width={120} height={24} sx={{ mb: 2 }} />
              <Stack spacing={1}>
                <Skeleton width="80%" />
                <Skeleton width="60%" />
                <Skeleton width="70%" />
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}
