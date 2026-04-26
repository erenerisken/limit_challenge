import { getInitials } from '@/lib/utils/string';

/** Generates a stable HSL color from a string value. */
export function stringToColor(str: string) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;

  return `hsl(${h}, 60%, 60%)`;
}

/** Builds display props for avatar components from a user's name. */
export function getAvatarProps(name?: string | null) {
  const safeName = name || '';

  return {
    children: getInitials(safeName),
    sx: {
      bgcolor: stringToColor(safeName),
      color: '#fff',
      fontSize: 13,
      fontWeight: 500,
    },
  };
}
