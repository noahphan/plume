import { simulateApiDelay } from "@/lib/utils";
import type {
  Contract,
  Template,
  TimelineEvent,
  SigningSession,
  ContractFilters,
  EvidenceBundle,
} from "@/lib/types";

import contractsData from "@/data/fixtures/contracts.json";
import templatesData from "@/data/fixtures/templates.json";
import timelineEventsData from "@/data/fixtures/timeline-events.json";
import signingSessionsData from "@/data/fixtures/signing-sessions.json";

// Type assertions
const contracts = contractsData as unknown as Contract[];
const templates = templatesData as unknown as Template[];
const timelineEvents = timelineEventsData as unknown as Record<string, TimelineEvent[]>;
const signingSessions = signingSessionsData as unknown as SigningSession[];

/**
 * Get all contracts with optional filtering
 */
export async function getContracts(filters?: ContractFilters): Promise<Contract[]> {
  await simulateApiDelay();

  let result = [...contracts];

  if (filters?.status?.length) {
    result = result.filter((c) => filters.status!.includes(c.status));
  }

  if (filters?.templateId) {
    result = result.filter((c) => c.templateId === filters.templateId);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.templateName.toLowerCase().includes(search) ||
        c.signers.some(
          (s) =>
            s.name.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search)
        )
    );
  }

  // Sort by updatedAt descending
  result.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return result;
}

/**
 * Get a single contract by ID
 */
export async function getContract(id: string): Promise<Contract | null> {
  await simulateApiDelay();
  return contracts.find((c) => c.id === id) || null;
}

/**
 * Get timeline events for a contract
 */
export async function getContractTimeline(
  contractId: string
): Promise<TimelineEvent[]> {
  await simulateApiDelay();
  return timelineEvents[contractId] || [];
}

/**
 * Get all templates
 */
export async function getTemplates(category?: string): Promise<Template[]> {
  await simulateApiDelay();

  if (category && category !== "all") {
    return templates.filter((t) => t.category === category);
  }

  return templates;
}

/**
 * Get a single template by ID
 */
export async function getTemplate(id: string): Promise<Template | null> {
  await simulateApiDelay();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Get signing session by token
 */
export async function getSigningSession(
  token: string
): Promise<SigningSession | null> {
  await simulateApiDelay();
  return signingSessions.find((s) => s.token === token) || null;
}

/**
 * Verify OTP (mock - accepts any 6-digit code)
 */
export async function verifyOtp(
  token: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  await simulateApiDelay();

  const session = signingSessions.find((s) => s.token === token);
  if (!session) {
    return { success: false, error: "Invalid session" };
  }

  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    return { success: false, error: "Invalid code" };
  }

  // Mock: accept any 6-digit code
  return { success: true };
}

/**
 * Get evidence bundle for a completed contract
 */
export async function getEvidenceBundle(
  contractId: string
): Promise<EvidenceBundle | null> {
  await simulateApiDelay();

  const contract = contracts.find((c) => c.id === contractId);
  if (!contract || contract.status !== "completed") {
    return null;
  }

  // Generate mock evidence bundle
  return {
    id: `bundle-${contractId}`,
    contractId,
    createdAt: contract.completedAt || contract.updatedAt,
    documentHash:
      "sha256:a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    bundleHash:
      "sha256:fedcba0987654321fedcba0987654321fedcba0987654321fedcba09876543",
    contents: {
      signedPdf: { name: `${contract.title}.pdf`, size: "245 KB" },
      auditTrail: { events: timelineEvents[contractId]?.length || 0 },
      consentRecords: { signers: contract.signers.length },
    },
  };
}

/**
 * Get contract statistics for dashboard
 */
export async function getContractStats(): Promise<{
  total: number;
  draft: number;
  pending: number;
  completed: number;
  voided: number;
}> {
  await simulateApiDelay();

  return {
    total: contracts.length,
    draft: contracts.filter((c) => c.status === "draft").length,
    pending: contracts.filter((c) => c.status === "pending").length,
    completed: contracts.filter((c) => c.status === "completed").length,
    voided: contracts.filter((c) => c.status === "voided").length,
  };
}

/**
 * Mock send contract action
 */
export async function sendContract(contractId: string): Promise<{ success: boolean }> {
  await simulateApiDelay();
  // In real implementation, this would update the contract status
  console.log(`Sending contract: ${contractId}`);
  return { success: true };
}

/**
 * Mock void contract action
 */
export async function voidContract(
  contractId: string,
  reason?: string
): Promise<{ success: boolean }> {
  await simulateApiDelay();
  // In real implementation, this would update the contract status
  console.log(`Voiding contract: ${contractId}, reason: ${reason}`);
  return { success: true };
}

/**
 * Mock resend to signer action
 */
export async function resendToSigner(
  contractId: string,
  signerId: string
): Promise<{ success: boolean }> {
  await simulateApiDelay();
  console.log(`Resending to signer: ${signerId} for contract: ${contractId}`);
  return { success: true };
}
