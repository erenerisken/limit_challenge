import { Suspense } from 'react';

import { SubmissionsPageContent } from './submissions-page-content';

export default function SubmissionsPage() {
  return (
    <Suspense fallback={null}>
      <SubmissionsPageContent />
    </Suspense>
  );
}
