import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import { Button, Card, Chip, Divider, Stack, Typography } from '@mui/material';

import type { SubmissionDetail } from '@/lib/types';
import { formatDate } from '@/lib/utils/date';

type DocumentsCardProps = {
  documents: SubmissionDetail['documents'];
};

export function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Documents
        </Typography>
        <Chip label={documents.length} size="small" />
      </Stack>

      {documents.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No documents attached.
        </Typography>
      ) : (
        <Stack spacing={1} divider={<Divider />}>
          {documents.map((document) => (
            <Stack
              key={document.id}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              sx={{ py: 1 }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <DescriptionIcon sx={{ fontSize: 20, color: 'text.secondary' }} />

                <Stack spacing={0.25}>
                  <Typography variant="body2" fontWeight={500}>
                    {document.title}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Chip
                      label={document.docType}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        borderRadius: 999,
                        '& .MuiChip-label': {
                          px: 1.25,
                          lineHeight: 1,
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(document.uploadedAt)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Button
                size="small"
                startIcon={<DownloadIcon />}
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
              >
                Download
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
    </Card>
  );
}
