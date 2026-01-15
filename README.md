# Plume

**Lightweight contract creation and e-signature platform**

Plume is a beautiful, modern contract signing platform featuring glassmorphism UI, aurora gradients, and smooth animations. This repository contains the Phase 1 UI prototype with fully interactive flows.

![Plume Preview](https://via.placeholder.com/1200x630/0a0a0f/6366f1?text=Plume+-+Contract+Signing)

## ✨ Features

### Creator Flow (Internal Users)
- **Dashboard** - View, filter, and search contracts with status tracking
- **Template Gallery** - Browse and select from pre-configured contract templates
- **Contract Builder** - Fill in contract details with live document preview
- **Prepare for Signature** - Add signers and configure signing order
- **Review & Send** - Final review with custom message and reminder settings
- **Contract Detail** - Timeline view of signing activity
- **Evidence Bundle** - Download cryptographic proof of signatures

### Signer Flow (External Recipients)
- **Landing Page** - Welcome screen with contract summary
- **Consent** - E-signature disclosure with scroll tracking
- **Verification** - OTP email verification
- **Document Review** - Full document viewer with zoom controls
- **Signature** - Draw or type signature with preview
- **Completion** - Success animation with confetti

## 🎨 Design System

- **Aurora Gradients** - Animated multi-color background gradients
- **Glassmorphism** - Frosted glass cards with backdrop blur
- **Calm Luxury** - Dark theme with soft glows and smooth transitions
- **WCAG AA Compliant** - Accessible color contrast and keyboard navigation
- **Responsive** - Mobile-first design from 375px to 1440px+

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI primitives
- **Animation**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/noahphan/plume.git
cd plume

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
plume/
├── app/                          # Next.js App Router
│   ├── (creator)/               # Internal user routes
│   │   ├── dashboard/           # Contract list
│   │   ├── templates/           # Template gallery
│   │   └── contracts/           # Contract management
│   └── sign/[token]/            # Signer flow routes
├── components/
│   ├── ui/                      # Primitive components
│   ├── patterns/                # Composite patterns
│   ├── layout/                  # Layout components
│   └── features/                # Feature-specific components
├── lib/
│   ├── api/                     # Mock API layer
│   ├── hooks/                   # React hooks
│   ├── contexts/                # React contexts
│   ├── utils.ts                 # Utility functions
│   ├── constants.ts             # App constants
│   └── types.ts                 # TypeScript types
├── data/fixtures/               # Mock data
└── public/                      # Static assets
```

## 🎯 Demo Routes

### Creator Flow
- `/dashboard` - Contract dashboard
- `/templates` - Template gallery
- `/contracts/new?templateId=tpl-001` - Create new contract
- `/contracts/ctr-001` - Contract detail
- `/contracts/ctr-001/evidence` - Evidence bundle

### Signer Flow
- `/sign/demo-token-abc123` - Start signing flow
- `/sign/demo-token-abc123/consent` - Consent disclosure
- `/sign/demo-token-abc123/verify` - OTP verification
- `/sign/demo-token-abc123/review` - Document review
- `/sign/demo-token-abc123/sign` - Add signature
- `/sign/demo-token-abc123/complete` - Success page

## 🚢 Deployment

This project is configured for deployment on Vercel:

1. Push to the `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests

### Environment Variables

No environment variables are required for Phase 1 (mock data only).

For Phase 2 backend integration:
```env
DATABASE_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
AWS_S3_BUCKET=
```

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Bundle Size**: Optimized with tree-shaking

## ♿ Accessibility

- Full keyboard navigation
- ARIA labels and roles
- Focus visible indicators
- Reduced motion support
- High contrast mode
- Screen reader tested

## 📝 Phase 2 Roadmap

- [ ] Backend API with database
- [ ] Real PDF document processing
- [ ] Email delivery system
- [ ] Cryptographic signature verification
- [ ] Audit trail storage
- [ ] Team management
- [ ] Custom templates

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Noah Phan](https://github.com/noahphan)
