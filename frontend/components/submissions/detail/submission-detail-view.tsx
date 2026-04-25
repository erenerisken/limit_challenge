'use client';

import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import { Avatar, Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/material';

import { PriorityChip } from '../priority-chip';
import { StatusChip } from '../status-chip';
import { SubmissionDetail } from '@/lib/types';
import { formatDate, formatDateTime } from '@/lib/utils/date';
import { getInitials } from '@/lib/utils/string';

type SubmissionDetailViewProps = {
  submission: SubmissionDetail;
};

function EmptySection({ message }: { message: string }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  );
}

export function SubmissionDetailView({ submission }: SubmissionDetailViewProps) {
  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={600}>
            {submission.company.legalName}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <StatusChip status={submission.status} />
            <PriorityChip priority={submission.priority} />
            <Typography variant="body2" color="text.secondary">
              Created {formatDate(submission.createdAt)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Summary
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {submission.summary}
            </Typography>
          </Card>

          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Documents
              </Typography>
              <Chip label={submission.documents.length} size="small" />
            </Stack>

            {submission.documents.length === 0 ? (
              <EmptySection message="No documents attached." />
            ) : (
              <Stack spacing={1} divider={<Divider />}>
                {submission.documents.map((document) => (
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

          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                Notes
              </Typography>
              <Chip label={submission.notes.length} size="small" />
            </Stack>

            {submission.notes.length === 0 ? (
              <EmptySection message="No notes yet." />
            ) : (
              <Stack spacing={2}>
                {submission.notes.map((note) => (
                  <Stack key={note.id} direction="row" spacing={2}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                      {getInitials(note.authorName)}
                    </Avatar>

                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
                        <Typography variant="body2" fontWeight={600}>
                          {note.authorName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(note.createdAt)}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" color="text.secondary">
                        {note.body}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Stack>

        <Stack spacing={3}>
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
                <Typography variant="body2">{submission.company.legalName}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Industry
                </Typography>
                <Typography variant="body2">{submission.company.industry}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Headquarters
                </Typography>
                <Typography variant="body2">{submission.company.headquartersCity}</Typography>
              </Box>
            </Stack>
          </Card>

          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Broker
            </Typography>

            <Stack spacing={1}>
              <Typography variant="body2" fontWeight={500}>
                {submission.broker.name}
              </Typography>

              {submission.broker.primaryContactEmail ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {submission.broker.primaryContactEmail}
                  </Typography>
                </Stack>
              ) : (
                <EmptySection message="No primary contact email." />
              )}
            </Stack>
          </Card>

          <Card variant="outlined" sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="h6" fontWeight={600}>
                Owner
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 40, height: 40 }}>
                {getInitials(submission.owner.fullName)}
              </Avatar>

              <Stack spacing={0.25}>
                <Typography variant="body2" fontWeight={500}>
                  {submission.owner.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {submission.owner.email}
                </Typography>
              </Stack>
            </Stack>
          </Card>

          <Card variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contacts
            </Typography>

            {submission.contacts.length === 0 ? (
              <EmptySection message="No contacts added." />
            ) : (
              <Stack spacing={2} divider={<Divider />}>
                {submission.contacts.map((contact) => (
                  <Stack key={contact.id} spacing={1} sx={{ py: 0.5 }}>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={500}>
                        {contact.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.role}
                      </Typography>
                    </Stack>

                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                          {contact.email}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                          {contact.phone}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Card>
        </Stack>
      </Box>
    </Stack>
  );
}
