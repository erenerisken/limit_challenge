import { Avatar, Card, Chip, Stack, Typography } from '@mui/material';

import type { SubmissionDetail } from '@/lib/types';
import { formatDateTime } from '@/lib/utils/date';
import { getInitials } from '@/lib/utils/string';

type NotesCardProps = {
  notes: SubmissionDetail['notes'];
};

export function NotesCard({ notes }: NotesCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>
          Notes
        </Typography>
        <Chip label={notes.length} size="small" />
      </Stack>

      {notes.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No notes yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {notes.map((note) => (
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
  );
}
