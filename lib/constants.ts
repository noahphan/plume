/**
 * Animation constants for Framer Motion
 */
export const ANIMATIONS = {
  // Spring configurations
  spring: {
    default: { type: "spring" as const, stiffness: 300, damping: 30 },
    gentle: { type: "spring" as const, stiffness: 200, damping: 25 },
    bouncy: { type: "spring" as const, stiffness: 400, damping: 25 },
    stiff: { type: "spring" as const, stiffness: 500, damping: 35 },
  },

  // Duration presets
  duration: {
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    slower: 0.5,
  },

  // Easing presets
  ease: {
    out: [0.16, 1, 0.3, 1],
    in: [0.4, 0, 1, 1],
    inOut: [0.4, 0, 0.2, 1],
  },

  // Common variants
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },

  slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  },
} as const;

/**
 * Breakpoint values (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Status configurations
 */
export const CONTRACT_STATUSES = {
  draft: {
    label: "Draft",
    color: "gray",
    icon: "FileText",
  },
  pending: {
    label: "Pending",
    color: "amber",
    icon: "Clock",
  },
  completed: {
    label: "Completed",
    color: "green",
    icon: "CheckCircle2",
  },
  voided: {
    label: "Voided",
    color: "red",
    icon: "XCircle",
  },
} as const;

export const SIGNER_STATUSES = {
  pending: {
    label: "Pending",
    color: "gray",
    icon: "Clock",
  },
  sent: {
    label: "Sent",
    color: "blue",
    icon: "Send",
  },
  viewed: {
    label: "Viewed",
    color: "blue",
    icon: "Eye",
  },
  signed: {
    label: "Signed",
    color: "green",
    icon: "Check",
  },
  declined: {
    label: "Declined",
    color: "red",
    icon: "X",
  },
} as const;

/**
 * Template categories
 */
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "nda", label: "NDAs" },
  { id: "msa", label: "Master Agreements" },
  { id: "sow", label: "Statements of Work" },
  { id: "employment", label: "Employment" },
  { id: "sales", label: "Sales" },
] as const;

/**
 * Reminder frequency options
 */
export const REMINDER_OPTIONS = [
  { value: "none", label: "No reminders" },
  { value: "daily", label: "Daily" },
  { value: "every3days", label: "Every 3 days" },
  { value: "weekly", label: "Weekly" },
] as const;

/**
 * Timeline event types
 */
export const TIMELINE_EVENT_TYPES = {
  created: { label: "Contract created", icon: "Plus" },
  sent: { label: "Contract sent", icon: "Send" },
  delivered: { label: "Email delivered", icon: "Mail" },
  viewed: { label: "Document viewed", icon: "Eye" },
  signed: { label: "Signature completed", icon: "PenTool" },
  completed: { label: "Contract completed", icon: "CheckCircle2" },
  voided: { label: "Contract voided", icon: "XCircle" },
  reminder: { label: "Reminder sent", icon: "Bell" },
  bundle_generated: { label: "Evidence bundle generated", icon: "Package" },
} as const;

/**
 * Consent disclosure text
 */
export const CONSENT_DISCLOSURE = `
Electronic Signature Consent

By clicking "I Agree" below, you are agreeing to use electronic signatures to sign this document. You confirm that:

1. You consent to conduct this transaction electronically and to use electronic signatures.

2. You have the ability to access and retain electronic records related to this transaction.

3. You understand that you may request a paper copy of any document you sign electronically.

4. You can withdraw your consent at any time by contacting the sender before signing.

5. Your electronic signature will have the same legal effect as a handwritten signature.

This consent applies only to this specific transaction. You may still receive paper documents for other transactions.

If you do not agree to these terms, please close this window and contact the sender to arrange an alternative signing method.
`.trim();

/**
 * App routes
 */
export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  templates: "/templates",
  contracts: {
    new: "/contracts/new",
    detail: (id: string) => `/contracts/${id}`,
    prepare: (id: string) => `/contracts/${id}/prepare`,
    review: (id: string) => `/contracts/${id}/review`,
    evidence: (id: string) => `/contracts/${id}/evidence`,
  },
  sign: {
    landing: (token: string) => `/sign/${token}`,
    consent: (token: string) => `/sign/${token}/consent`,
    verify: (token: string) => `/sign/${token}/verify`,
    review: (token: string) => `/sign/${token}/review`,
    sign: (token: string) => `/sign/${token}/sign`,
    complete: (token: string) => `/sign/${token}/complete`,
  },
} as const;
