import { Link, type LinkProps } from '@mui/material';

type ContactValueLinkProps = Omit<LinkProps, 'href'> & {
  type: 'email' | 'phone';
  value: string;
};

function getHref(type: ContactValueLinkProps['type'], value: string) {
  if (type === 'email') {
    return `mailto:${value}`;
  }

  const normalizedPhone = value.replace(/[^\d+]/g, '');
  return `tel:${normalizedPhone}`;
}

export function ContactValueLink({ type, value, sx, ...props }: ContactValueLinkProps) {
  return (
    <Link
      {...props}
      href={getHref(type, value)}
      sx={[
        {
          textDecoration: 'none',
          overflowWrap: 'anywhere',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {value}
    </Link>
  );
}
