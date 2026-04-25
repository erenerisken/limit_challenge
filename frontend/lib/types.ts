export type SubmissionStatus = 'new' | 'in_review' | 'closed' | 'lost';
export type SubmissionPriority = 'high' | 'medium' | 'low';

export interface Broker {
  id: number;
  name: string;
  primaryContactEmail: string | null;
}

export interface Company {
  id: number;
  legalName: string;
  industry: string;
  headquartersCity: string;
}

export interface TeamMember {
  id: number;
  fullName: string;
  email: string;
}

export interface NoteSummary {
  authorName: string;
  bodyPreview: string;
  createdAt: string;
}

export interface SubmissionListItem {
  id: number;
  status: SubmissionStatus;
  priority: SubmissionPriority;
  summary: string;
  createdAt: string;
  updatedAt: string;
  broker: Broker;
  company: Company;
  owner: TeamMember;
  documentCount: number;
  noteCount: number;
  latestNote: NoteSummary | null;
}

export interface Contact {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Document {
  id: number;
  title: string;
  docType: string;
  uploadedAt: string;
  fileUrl: string;
}

export interface NoteDetail {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface SubmissionDetail extends Omit<
  SubmissionListItem,
  'documentCount' | 'noteCount' | 'latestNote'
> {
  contacts: Contact[];
  documents: Document[];
  notes: NoteDetail[];
}

export interface PaginationRequest {
  page?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export type SubmissionOrdering =
  | 'created_at'
  | '-created_at'
  | 'updated_at'
  | '-updated_at'
  | 'priority_order'
  | '-priority_order'
  | 'status'
  | '-status'
  | 'company__legal_name'
  | '-company__legal_name'
  | 'broker__name'
  | '-broker__name'
  | 'document_count'
  | '-document_count'
  | 'note_count'
  | '-note_count';

export interface SubmissionListFilters extends PaginationRequest {
  status?: SubmissionStatus;
  brokerId?: string;
  companySearch?: string;
  ordering?: SubmissionOrdering;
}
