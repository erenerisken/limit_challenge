import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Card, Stack, Typography } from '@mui/material';

import type { SubmissionDetail } from '@/lib/types';
import { getAvatarProps } from '@/lib/utils/avatar';

type OwnerCardProps = {
  owner: SubmissionDetail['owner'];
};

export function OwnerCard({ owner }: OwnerCardProps) {
  const avatarProps = getAvatarProps(owner.fullName);

  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" spacing={0.5} alignItems="center" mb={2}>
        <PersonIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
        <Typography variant="h6" fontWeight={600}>
          Owner
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar {...avatarProps} sx={{ ...avatarProps.sx, width: 40, height: 40 }} />

        <Stack>
          <Typography variant="body2" fontWeight={500}>
            {owner.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {owner.email}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
