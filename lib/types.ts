/**
 * Core domain types for Plume
 */

// Contract Status
export type ContractStatus = "draft" | "pending" | "completed" | "voided";

// Signer Status
export type SignerStatus = "pending" | "sent" | "viewed" | "signed" | "declined";

// Template Category
export type TemplateCategory = "all" | "nda" | "msa" | "sow" | "employment" | "sales";

// Timeline Event Type
export type TimelineEventType =
  | "created"
  | "sent"
  | "delivered"
  | "viewed"
  | "signed"
  | "completed"
  | "voided"
  | "reminder"
  | "bundle_generated";

/**
 * Signer
 */
export interface Signer {
  id: string;
  name: string;
  email: string;
  role: string;
  order: number;
  status: SignerStatus;
  signedAt?: string;
  viewedAt?: string;
}

/**
 * Contract
 */
export interface Contract {
  id: string;
  title: string;
  status: ContractStatus;
  templateId: string;
  templateName: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  completedAt?: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  signers: Signer[];
  variables?: Record<string, string>;
  batchId?: string;
  batchName?: string;
}

/**
 * Template Variable Schema
 */
export interface TemplateVariable {
  key: string;
  label: string;
  type: "text" | "date" | "email" | "currency" | "textarea" | "select";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
}

/**
 * Template
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  variables: TemplateVariable[];
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Timeline Event
 */
export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: string;
  actor?: {
    type: "user" | "signer" | "system";
    name?: string;
    email?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Evidence Bundle
 */
export interface EvidenceBundle {
  id: string;
  contractId: string;
  createdAt: string;
  documentHash: string;
  bundleHash: string;
  contents: {
    signedPdf: { name: string; size: string };
    auditTrail: { events: number };
    consentRecords: { signers: number };
  };
}

/**
 * Signing Session (for signer flow)
 */
export interface SigningSession {
  token: string;
  contractId: string;
  contractTitle: string;
  signerId: string;
  signerName: string;
  signerEmail: string;
  senderName: string;
  senderCompany: string;
  status: "valid" | "expired" | "completed" | "invalid";
  documentPages: number;
  currentStep: SignerFlowStep;
  consentGiven: boolean;
  otpVerified: boolean;
  signature?: string;
  signatureType?: "draw" | "type";
}

export type SignerFlowStep =
  | "landing"
  | "consent"
  | "verify"
  | "review"
  | "sign"
  | "complete";

/**
 * User (internal)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "admin" | "member" | "viewer";
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: "contract_signed" | "contract_completed" | "contract_viewed" | "reminder";
  title: string;
  message: string;
  contractId?: string;
  read: boolean;
  createdAt: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

/**
 * Pagination
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Filter options for contracts
 */
export interface ContractFilters {
  status?: ContractStatus[];
  templateId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  batchId?: string;
}

/**
 * Sort options
 */
export interface SortOptions {
  field: "createdAt" | "updatedAt" | "title" | "status";
  direction: "asc" | "desc";
}

/**
 * Batch/Group for bulk operations
 */
export interface ContractBatch {
  id: string;
  name: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "partial";
  contractIds: string[];
  totalContracts: number;
  signedCount: number;
  pendingCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

/**
 * Batch Statistics
 */
export interface BatchStats {
  total: number;
  signed: number;
  pending: number;
  viewed: number;
  completed: number;
  percentComplete: number;
}

/**
 * Bulk Action Types
 */
export type BulkActionType = "send" | "resend" | "void" | "download" | "remind";

/**
 * Bulk Action Result
 */
export interface BulkActionResult {
  action: BulkActionType;
  totalSelected: number;
  successful: number;
  failed: number;
  errors?: { contractId: string; error: string }[];
}
