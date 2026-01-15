“Plume” — Lightweight Internal Contract Creation + Signature Platform (Awwwards-level UI, US/EU Defensible)

You are a Staff Product Manager + Design Director + Staff Engineer + Security Lead. Produce a complete PRD for Plume, an internal contract creation + e-signature platform that is very light, fast to deploy, and legally defensible for common B2B contracts across US (ESIGN/UETA) and EU (eIDAS simple e-sign lane by default).

Do not build full CLM. Do not do redlines/negotiation. Do not do QES in v1. Optimize for “works beautifully and holds up under scrutiny.”

Output format
	•	Markdown PRD with sections, sub-sections, and testable acceptance criteria.
	•	Include: Phase 1 (UI mock only) and Phase 2 (wired).
	•	Include: UI spec, engineering spec, data model, API, security, QA, rollout.

⸻

0) Product framing

Name
	•	Plume

Target users
	•	Internal: Sales, Partnerships, Ops, Legal-lite
	•	External: counterparties as signers (mobile-first)

Goal
	•	Create contracts from templates with variable fill, send for signature, track status, export evidence bundle.

Explicit non-goals
	•	No redlining, no clause library search, no approvals engine v1
	•	No eIDAS AdES/QES claims; no QTSP integration v1
	•	No payments, no notarization, no complex workflow orchestration

⸻

1) Design principles (Awwwards-level)

Visual style direction (MUST)
	•	Glassmorphism + Aurora gradients
	•	Responsive + subtle parallax
	•	“Calm luxury software” (minimal, crisp, confidence-inspiring)
	•	Motion: springy but restrained, never gimmicky; reduced-motion mode

UX principles
	•	“Minimum steps, maximum confidence”
	•	Always show progress + what happens next
	•	Every action produces a tangible, aesthetically pleasing response (micro-confirmations)

Accessibility + performance
	•	WCAG AA contrast targets (glass layers must remain readable)
	•	Keyboard navigation + focus states
	•	Lighthouse performance budget: fast-first render, lazy-loading previews, minimal JS

⸻

Phase 1 — UI/UX Mock Only (“Looks real, no real functions”)

Phase 1 objective

Build a fully clickable, production-feeling prototype using mock data only. It should be polished enough to win design awards and enable internal user testing.

Phase 1 deliverables
	1.	Responsive UI (desktop-first, mobile-perfect signer flow)
	2.	Clickable flow: Dashboard → Template → Builder → Prepare → Send → Detail → Evidence (mock)
	3.	Clickable signer flow: Consent → Verify (mock OTP) → Review → Adopt & Sign → Done
	4.	Design system + components + motion spec
	5.	Empty/loading/error states
	6.	Final copywriting (plain language, legal-friendly)

Phase 1 screen inventory

Specify each screen with layout, components, states, animations:
	•	Dashboard (search/filter, cards/list toggle, status chips, quick actions)
	•	Template Gallery (preview panel, “use template”)
	•	Contract Builder (2-pane: variables form + live preview)
	•	Prepare for Signature (signers + mock field placement)
	•	Review & Send
	•	Contract Detail (timeline + signer statuses + actions)
	•	Evidence Bundle view (mock contents)
	•	Signer: landing, consent, verify, review, sign, confirmation

Phase 1 acceptance criteria (UI-only)
	•	Entire flow is clickable end-to-end with realistic transitions
	•	Each screen includes empty/loading/error variants
	•	Mobile signer flow is flawless and fast
	•	Reduced-motion and high-contrast modes designed

⸻

Phase 2 — Build + Wire Up (“Defensible simple e-sign for US/EU”)

Phase 2 objective

Implement real signing with: document finalization, link-based signing sessions, optional OTP, append-only audit, evidence bundle, retention controls, and basic admin security.

⸻

2) Key product decisions (make these decisions; do not ask)

Signature lane strategy (compliance-safe)
	•	Ship Simple Electronic Signature lane only (US/EU) with strong evidence.
	•	Add “Future: AdES/QES via QTSP” as roadmap only; no claims in v1.

Authentication baseline (light but defensible)
	•	Default signer access: single-use magic link.
	•	Default verification: OTP (email OTP), with an admin toggle to require OTP for all external signers.
	•	Optional: SSO for internal users only (creator side), not required for signers in v1.

Document integrity approach (fast + strong)
	•	Canonicalize to a single PDF at “Finalize.”
	•	Compute and store SHA-256 hash at:
	•	finalize (pre-sign canonical)
	•	completion (final signed artifact)
	•	Store immutable PDF bytes in object storage with versioning.

Evidence bundle approach (fast to build)
	•	Evidence bundle is a single PDF (human readable) + a JSON (machine readable) in a zip.
	•	Bundle includes:
	•	signed PDF
	•	hashes
	•	audit trail
	•	consent text version
	•	auth results
	•	Bundle generation must be deterministic and hash-verified.

Storage approach (simple & robust)
	•	Use object storage (immutable) for finalized docs + signed docs + bundles.
	•	Use Postgres for metadata and audit events (append-only table).

⸻

3) Engineering spec (bulked up, decisions included)

3.1 Architecture (recommendation for fast deployment)

Choose a modern, minimal stack:
	•	Frontend: Next.js (App Router) + TypeScript
	•	UI: Tailwind + Radix UI primitives (or shadcn/ui) with custom glass/aurora layers
	•	Backend: Next.js API routes OR a small Node service (Fastify) (pick one and justify)
	•	DB: Postgres (managed)
	•	Object storage: S3-compatible with versioning enabled
	•	Email: Postmark (or SES) for invites + OTP (pick one and justify)
	•	Auth (internal users): Auth0 or Clerk (pick one and justify)
	•	Secrets/KMS: Managed KMS
	•	Observability: Sentry + OpenTelemetry traces + structured logs
	•	Queue: managed queue (or DB-backed job runner) for emails/reminders/bundle generation (choose simplest viable)

Decision guidance (write in PRD)
	•	Prefer managed services to reduce time-to-ship.
	•	Keep signer endpoints stateless where possible (token-based sessions).
	•	Treat audit log as append-only at the API layer (no update/delete endpoints).

3.2 Core domain objects (data model)

Define tables/fields with types and constraints:

Tenant
	•	id, name, settings_json (retention, OTP policy, consumer_mode flag), created_at

User
	•	id, tenant_id, email, name, role (admin/member/viewer), mfa_enabled, created_at

Template
	•	id, tenant_id, name, body_source (docx/html), variables_schema_json, created_at

Envelope
	•	id, tenant_id, template_id, title, status, created_by, created_at, finalized_at, completed_at
	•	canonical_doc_object_key, canonical_doc_sha256
	•	final_signed_object_key, final_signed_sha256

Signer
	•	id, envelope_id, name, email, role_label, signing_order, status

SigningSession
	•	id, signer_id, token_hash, expires_at, used_at, created_at
	•	otp_required, otp_verified_at

DisclosureVersion
	•	id, tenant_id, type (b2b_consent / consumer_esign), content, content_sha256, effective_at

AuditEvent (append-only)
	•	id, tenant_id, envelope_id, signer_id nullable, actor_type, actor_id nullable
	•	event_type, occurred_at_utc, ip, user_agent, payload_json

EvidenceBundle
	•	id, envelope_id, object_key_zip, created_at, bundle_sha256

Add indexes:
	•	(tenant_id, envelope_id, occurred_at_utc)
	•	(envelope_id, event_type)
	•	uniqueness on session tokens (token_hash)

3.3 API spec (endpoints + contracts)

Define request/response shapes and idempotency.

Creator APIs:
	•	POST /api/templates
	•	POST /api/envelopes (create draft)
	•	POST /api/envelopes/{id}/finalize (locks doc, generates canonical PDF, stores hash)
	•	POST /api/envelopes/{id}/send (creates signing sessions, sends emails)
	•	GET /api/envelopes/{id} (detail)
	•	GET /api/envelopes/{id}/audit (admin view)
	•	POST /api/envelopes/{id}/void
	•	POST /api/envelopes/{id}/resend

Signer APIs:
	•	GET /s/{token} (landing + session validation)
	•	POST /api/sign/{token}/consent
	•	POST /api/sign/{token}/request-otp
	•	POST /api/sign/{token}/verify-otp
	•	POST /api/sign/{token}/adopt-and-sign
	•	GET /api/sign/{token}/document (read-only; watermark if desired)

Exports:
	•	POST /api/envelopes/{id}/evidence-bundle (async job + ready status)
	•	GET /api/envelopes/{id}/evidence-bundle/download

Security:
	•	Tokens single-use: store only hash; compare with constant-time method.
	•	Rate limit OTP attempts and token usage.

3.4 Document generation + signing mechanics (light)
	•	Canonical document generation:
	•	Input: template body + variables
	•	Output: canonical PDF
	•	Store PDF bytes in object storage, compute SHA-256
	•	Signature application:
	•	For v1, do visible signature block + completion certificate page (rendered into final PDF)
	•	Record signature placement coordinates + timestamp in audit payload
	•	Recompute final SHA-256 on completed PDF

(Note: This is “evidence-driven” signing. Future: real cryptographic PDF signatures.)

3.5 Audit integrity (append-only)
	•	API layer MUST only allow inserts.
	•	DB role permissions deny UPDATE/DELETE on audit table.
	•	Optional: daily hash chain / merkle root over audit events for extra tamper-evidence (nice-to-have; include as Phase 2.5).

3.6 Security controls (minimum, ship-fast)
	•	TLS
	•	KMS encryption at rest
	•	RBAC
	•	Admin MFA enforced
	•	Tenant isolation: tenant_id required everywhere
	•	Object storage: private buckets, signed URLs, short TTL
	•	Backups + restore test schedule
	•	Sentry alerts for auth anomalies

3.7 Operational readiness
	•	Environments: dev/staging/prod with separate keys and buckets
	•	CI/CD: automated tests + migrations + canary deploy
	•	Feature flags: OTP required, consumer mode, reminders

⸻

4) Legal acceptance criteria (testable “System MUST…”)

4.1 US B2B lane (default)
	1.	Intent

	•	System MUST require an explicit “Adopt & Sign” action before marking signer complete.
	•	System MUST log signature_intent_confirmed with UTC timestamp, IP, UA, ceremony version.

	2.	Consent to transact electronically

	•	System MUST present an electronic transaction consent disclosure and capture affirmative acceptance.
	•	System MUST store the exact disclosure text version and link acceptance to disclosure_version_id.

	3.	Attribution / authentication

	•	System MUST require a valid single-use signing token delivered to signer email.
	•	If OTP is enabled, System MUST verify OTP prior to allowing “Adopt & Sign” and log otp_verified.

	4.	Association to record + integrity

	•	System MUST generate a canonical PDF at finalize, store canonical_doc_sha256, and prevent edits afterward.
	•	System MUST compute final_signed_sha256 and validate it during every export.

	5.	Retention + reproducibility

	•	System MUST retain signed PDF + audit log for tenant-configured retention and reproduce exports with hash verification.

4.2 US Consumer ESIGN mode (optional feature flag; OFF by default)

If enabled:
	•	System MUST present ESIGN consumer disclosures and capture affirmative consent.
	•	System MUST demonstrate access to record format before consent (e.g., require opening the PDF).
	•	System MUST version hardware/software requirement disclosures and trigger re-consent on material change.

4.3 EU simple e-sign lane (default)
	•	System MUST preserve sufficient evidence for admissibility (audit + integrity + identity assertions).
	•	System MUST ensure any post-sign changes are detectable (hash verification).
	•	System MUST NOT claim AdES or QES unless those lanes are implemented and enabled.

4.4 Claims matrix acceptance criteria
	•	System MUST display “Electronic signature with audit trail” language (simple lane).
	•	System MUST hide or disable any UI labels implying “qualified” or “advanced.”

⸻

5) QA plan (include detailed test cases)

Include:
	•	Token replay prevention
	•	OTP brute force rate limiting
	•	Audit completeness test: required events exist for a completed envelope
	•	Hash verification test: tamper with stored PDF → export must fail and alert
	•	Evidence bundle determinism test
	•	Cross-tenant access tests
	•	Accessibility audits + performance budgets

⸻

6) Rollout plan (fast deployment)
	•	Week 1–2: Phase 1 prototype user testing
	•	Week 3–5: Phase 2 core wiring (draft/finalize/send/sign)
	•	Week 6: evidence bundle + retention + admin MFA
	•	Pilot with 1–2 internal teams + real counterparties
	•	Legal review checkpoint: claims matrix + consent text + evidence bundle output

⸻

7) Final PRD output requirements

Your PRD MUST include:
	•	Full screen-by-screen UI spec (Phase 1)
	•	Full engineering spec (Phase 2) including data model, endpoints, security, and operations
	•	Legal acceptance criteria (US B2B, US consumer optional, EU simple) as MUST statements
	•	QA plan with concrete tests
	•	A strict MVP cut line and a “Phase 2.5” list

⸻
