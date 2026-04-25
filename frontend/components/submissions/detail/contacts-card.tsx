import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Card, Divider, Stack, Typography } from '@mui/material';

import type { SubmissionDetail } from '@/lib/types';

type ContactsCardProps = {
  contacts: SubmissionDetail['contacts'];
};

export function ContactsCard({ contacts }: ContactsCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Contacts
      </Typography>

      {contacts.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No contacts added.
        </Typography>
      ) : (
        <Stack spacing={2} divider={<Divider />}>
          {contacts.map((contact) => (
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
  );
}
