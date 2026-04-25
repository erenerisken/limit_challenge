import { render, screen } from '@testing-library/react';
import { SubmissionsTable } from '../submissions-table';
import { SubmissionListItem } from '@/lib/types';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

const mockData: SubmissionListItem[] = [
  {
    id: 1,
    status: 'new',
    priority: 'high',
    summary: '',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    broker: { id: 1, name: 'Broker A', primaryContactEmail: null },
    company: {
      id: 1,
      legalName: 'Acme Inc',
      industry: 'Tech',
      headquartersCity: 'NY',
    },
    owner: { id: 1, fullName: 'John Doe', email: '' },
    documentCount: 2,
    noteCount: 3,
    latestNote: null,
  },
];

test('renders submission rows', () => {
  render(
    <SubmissionsTable
      submissions={mockData}
      totalCount={1}
      page={1}
      rowsPerPage={10}
      isLoading={false}
      error={null}
      onOrderingChangeAction={() => {}}
      onPageChangeAction={() => {}}
    />,
  );

  expect(screen.getByText('Acme Inc')).toBeInTheDocument();
});

test('renders empty state', () => {
  render(
    <SubmissionsTable
      submissions={[]}
      totalCount={0}
      page={1}
      rowsPerPage={10}
      isLoading={false}
      error={null}
      onOrderingChangeAction={() => {}}
      onPageChangeAction={() => {}}
    />,
  );

  expect(screen.getByText(/no submissions/i)).toBeInTheDocument();
});

test('renders loading state', () => {
  render(
    <SubmissionsTable
      submissions={[]}
      totalCount={0}
      page={1}
      rowsPerPage={10}
      isLoading={true}
      error={null}
      onOrderingChangeAction={() => {}}
      onPageChangeAction={() => {}}
    />,
  );

  expect(screen.getAllByRole('row')).toBeTruthy();
});

test('renders error state', () => {
  render(
    <SubmissionsTable
      submissions={[]}
      totalCount={0}
      page={1}
      rowsPerPage={10}
      isLoading={false}
      error="Failed"
      onOrderingChangeAction={() => {}}
      onPageChangeAction={() => {}}
      onRetryAction={() => {}}
    />,
  );

  expect(screen.getByText(/failed/i)).toBeInTheDocument();
});
