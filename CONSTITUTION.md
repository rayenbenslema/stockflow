STOCKFLOW TUNISIA — MASTER AI CONSTITUTION
Production-Grade SaaS Constitution & Engineering Rulebook
Version 1.0 — Canonical Source of Truth
0. ABSOLUTE CONSTITUTIONAL RULE

This document is the:

SINGLE SOURCE OF TRUTH

for:

all AI agents
all engineers
all contributors
all future architectural decisions

If any implementation contradicts this constitution:

THE CONSTITUTION WINS

# DOCUMENTATION HIERARCHY

This constitution is the canonical source of truth.

However, the following supporting documents MUST also be consulted before major implementation decisions:

## Core Documents

- `README.md`
- `ARCHITECTURE.md`
- `ROADMAP.md`

## Supporting Technical Documents

- `docs/compliance/tunisian-facturation.md`
- `docs/db/erd.md`
- `docs/diagrams/flows.md`
- `docs/exports/export-rules.md`
- `docs/ux/design-system.md`
- `docs/api/api-contracts.md`

# AI MANDATORY PRE-IMPLEMENTATION RULE

Before implementing ANY feature, every AI agent MUST:

1. Read `CONSTITUTION.md` fully.
2. Read relevant supporting documents.
3. Inspect existing architecture.
4. Inspect existing reusable components.
5. Inspect database schema.
6. Avoid duplicate systems.
7. Preserve architecture consistency.
8. Preserve French-first UX.
9. Preserve scalability and compliance architecture.
10. Extend existing systems before creating new ones.

Failure to follow these rules is considered an architectural violation.
1. PROJECT IDENTITY
Project Name

StockFlow Tunisia (temporary codename)

Product Type

French-first:

inventory management
invoicing/facturation
POS/cashier
supplier management
client management
analytics
business operations SaaS

for Tunisian SMBs.

2. CORE PRODUCT VISION

The platform MUST become:

The modern operating system for Tunisian businesses.

The platform MUST:

feel premium
feel modern
feel extremely fast
remain simple
remain scalable
remain legally adaptable
remain mobile-first

The platform MUST NOT become:

bloated ERP
accounting monster
cluttered admin system
outdated Windows-style software
3. TARGET BUSINESSES
Primary Targets
alimentation
cafés
phone shops
mini markets
cosmetics stores
Secondary Targets
wholesalers
quincaillerie
pièces auto
depots
warehouses
4. PRODUCT MODULES
Mandatory Core Modules
Dashboard
Inventory
POS
Facturation
Client Management
Supplier Management
Analytics
Settings
User Roles & Permissions
Accounting Exports
Compliance Layer
5. BUSINESS MODEL
SaaS-first

The platform is a subscription SaaS.

Must Support
multi-business
multi-user
isolated workspaces
future feature gating
future subscriptions
future branches
6. LANGUAGE CONSTITUTION
Mandatory

French-first UX.

Examples
Tableau de bord
Produits
Factures
Fournisseurs
Clients
Paiements
Historique
Future

Arabic support later.
English internal/dev support later.

7. DESIGN CONSTITUTION

The UI system is locked to the Stripe-inspired design system provided by the user.

8. VISUAL PHILOSOPHY

The platform MUST feel:

premium
fintech-grade
trustworthy
responsive
elegant
touch-friendly

The platform MUST combine:

Stripe dashboard professionalism
Square POS ergonomics
Linear spacing rhythm
Shopify mobile usability
9. UI/UX MANDATORY RULES
MUST
use generous whitespace
use modern cards
use smooth transitions
use proper loading states
use skeleton loaders
use responsive tables
use mobile-first layouts
use accessible contrast
use consistent spacing
use touch-friendly targets
MUST NOT
clutter interfaces
overload dashboards
use tiny buttons
create deeply nested menus
use legacy ERP visual patterns
10. DESIGN TOKENS
COLORS
Primary

#635BFF
#675DFF
#533AFD

Neutral

#FFFFFF
#F4F7FA
#ECF1F6
#414552

Semantic

#E61947
#CC4B00
#22C55E

Reference design system is mandatory.

11. TYPOGRAPHY CONSTITUTION

Mandatory typography rules from locked design system.

Primary Font
-apple-system
Secondary Font
sohne-var
Minimum readable text

13px.

Buttons

16px.
Weight 500.

12. SPACING CONSTITUTION

Mandatory 4px spacing scale.

Allowed spacing values

4
8
12
16
20
24
32
48
64
76
172

Arbitrary spacing is forbidden.

13. RESPONSIVE CONSTITUTION

Mandatory responsive rules from locked design system.

Mobile-first mandatory.
Breakpoints

320+
480+
768+
1024+
1280+

14. TOUCH/TABLET CONSTITUTION

POS must work excellently on:

tablets
touch laptops
phones

Minimum interactive target:
44px.

15. PERFORMANCE CONSTITUTION
Mandatory

Dashboard load:
< 2s.

Invoice generation:
< 1s.

POS interactions:
instant-feeling.

Required
optimistic updates
caching
pagination
lazy loading
query optimization
efficient rendering
16. TECH STACK CONSTITUTION
FRONTEND

Mandatory:

React
TypeScript
TailwindCSS
shadcn/ui

Recommended:

React Query
TanStack Table
Recharts
Framer Motion
BACKEND

Mandatory:

Supabase
PostgreSQL
RLS
Edge Functions
Storage
MOBILE

Mandatory:

PWA
responsive-first

Optional future:

React Native
native apps
17. ARCHITECTURE CONSTITUTION
FRONTEND STRUCTURE
src/
 ├── features/
 ├── pages/
 ├── layouts/
 ├── components/
 ├── hooks/
 ├── services/
 ├── lib/
 ├── store/
 ├── types/
 ├── utils/
 └── styles/
FEATURE STRUCTURE
features/inventory/
 ├── components/
 ├── hooks/
 ├── services/
 ├── pages/
 ├── schemas/
 ├── types/
 └── utils/
18. AI ENGINEER CONSTITUTION

Every AI agent working on this project is considered:

A senior production-grade fullstack engineer.
19. AI AGENT MANDATORY RULES
ALWAYS
preserve architecture consistency
preserve responsiveness
preserve mobile UX
preserve type safety
preserve scalability
preserve modularity
preserve French-first UX
preserve accounting integrity
NEVER
generate placeholders
generate fake logic
duplicate components unnecessarily
break responsiveness
hardcode IDs
bypass RLS
create monolithic files
create inconsistent naming
introduce technical debt
20. AI BEFORE IMPLEMENTING ANYTHING

AI MUST:

inspect existing architecture
inspect DB schema
inspect existing components
inspect naming conventions
avoid duplicate systems
extend existing systems before creating new ones
21. DATABASE CONSTITUTION
DATABASE ENGINE

PostgreSQL via Supabase.

MANDATORY
normalization
foreign keys
indexes
auditability
soft deletion where required
immutable financial records
22. CORE TABLES
businesses
users
roles
permissions
products
product_variants
categories
subcategories
brands
warehouses
stock_movements
inventory_snapshots
clients
client_addresses
suppliers
invoices
invoice_items
quotes
delivery_notes
credit_notes
purchases
payments
payment_allocations
tax_profiles
audit_logs
attachments
exports
notifications
23. PRODUCT TABLE REQUIREMENTS

Products MUST support:

barcode
SKU
category
subcategory
images
variants
taxes
stock thresholds
supplier linkage
cost price
sale price
margin calculations
24. INVENTORY CONSTITUTION
MUST
track all stock movements
support inventory history
support manual adjustments
support warehouse support later
MUST NOT

allow silent stock mutations.

25. FACTURATION CONSTITUTION

The invoicing system is:

MISSION CRITICAL
26. MANDATORY DOCUMENT TYPES
Facture
Avoir
Devis
Proforma
Bon de livraison
Facture fournisseur
Reçu de paiement
27. INVOICE LIFECYCLE
draft
validated
signed
queued_for_submission
submitted
registered
rejected
cancelled
credited
28. INVOICE IMMUTABILITY

Once validated:

invoice becomes immutable
no destructive editing
no deletion

Corrections MUST happen via:

avoir
corrective invoice
revision trail
29. TVA / TAX CONSTITUTION

The platform MUST support:

multiple TVA rates
exemptions
future tax rules
configurable tax profiles
tax snapshots

The platform MUST calculate:

HT
TVA
TTC
discounts
totals
rounding
30. TUNISIAN COMPLIANCE CONSTITUTION

The platform MUST be:

TTN / El Fatoora READY

But MUST remain modular.

31. COMPLIANCE ADAPTER ARCHITECTURE
Business Logic
↓
Invoice Engine
↓
Compliance Adapter
↓
TTN / Ministry Connectors
32. TTN-READY FIELDS

Invoices MUST support:

ttn_reference
government_reference
qr_payload
xml_payload
compliance_status
signature_hash
submitted_to_ttn_at
validation_response
rejection_reason
33. COMPLIANCE STATES
not_required
pending
queued
submitted
registered
rejected
34. AUDIT CONSTITUTION

The system MUST audit:

invoice creation
stock mutations
payments
role changes
exports
user actions

Audit logs MUST be immutable.

35. EXPORT CONSTITUTION
Mandatory exports
Excel
CSV
PDF
Exportable entities
invoices
products
inventory
analytics
clients
suppliers
payments
TVA reports
36. EXCEL EXPORT RULES

Exports MUST:

be readable
use grouped headers
support filters
preserve formatting
preserve totals
include dates
include business identity
37. BULK ACTIONS CONSTITUTION

Tables MUST support:

multi-selection
bulk delete
bulk export
bulk category assignment
bulk status update
38. TABLE UX CONSTITUTION

Tables are:

CORE PRODUCT UX

Mandatory:

sorting
filtering
pagination
sticky headers
search
row actions
keyboard support
responsive behavior
39. SEARCH CONSTITUTION

Global search MUST support:

products
invoices
clients
suppliers
SKUs
barcodes
40. POS CONSTITUTION

POS must:

feel instant
minimize clicks
support barcode scanners
support touch
support keyboard shortcuts
41. OFFLINE CONSTITUTION

Future-ready support required for:

offline-safe invoices
queued sync
pending compliance sync
42. CLIENT MANAGEMENT CONSTITUTION

Clients MUST support:

debt tracking
invoice history
payment history
WhatsApp quick actions
multiple addresses
notes
tags
43. SUPPLIER MANAGEMENT CONSTITUTION

Suppliers MUST support:

purchases
debt tracking
payment history
purchase analytics
44. PAYMENT CONSTITUTION

Support:

cash
bank
cheque
card
split payments
partial payments
45. ACCOUNTING EXPORT CONSTITUTION

Mandatory:

TVA summaries
revenue reports
unpaid reports
export comptable
accountant-ready CSV/Excel
46. ROLE SYSTEM
owner
manager
cashier
analyst
accountant
47. SECURITY CONSTITUTION

Mandatory:

RLS everywhere
business isolation
auth validation
secure file access
audit trails
rate limiting later
input validation
XSS protection
SQL injection prevention
48. SAAS TENANCY CONSTITUTION

Every business is isolated.

Cross-business access is forbidden.

49. FILE STORAGE CONSTITUTION

Storage MUST support:

product images
invoice PDFs
exports
logos
attachments
50. NOTIFICATION CONSTITUTION

Notifications must support:

invoice reminders
stock alerts
payment alerts
export completion
compliance failures
51. ANALYTICS CONSTITUTION

Mandatory analytics:

sales
inventory
margins
top products
customer analytics
supplier analytics
52. FUTURE AI ASSISTANT CONSTITUTION

Architecture MUST remain AI-ready.

Future AI assistant may support:

stock forecasting
invoice generation
analytics explanations
voice assistance
OCR imports
53. API CONSTITUTION

Future API support required.

Architecture MUST support:

REST
webhook systems
integrations
54. REPOSITORY SELECTION CONSTITUTION

Any imported/open-source repo MUST:

use modern React
support scalability
use TypeScript preferably
support responsive layouts
avoid enterprise bloat
avoid legacy stacks
55. CODE QUALITY CONSTITUTION

Mandatory:

strict TypeScript
reusable components
typed services
centralized validation
loading states
empty states
error boundaries
56. FORBIDDEN ENGINEERING PATTERNS

Forbidden:

gigantic files
duplicated business logic
inline SQL everywhere
inline fetch logic everywhere
hardcoded styles
arbitrary spacing
inconsistent states
57. SCALABILITY CONSTITUTION

Architecture MUST scale to:

100k+ products
1M+ invoices
multi-branch businesses
large exports
concurrent POS usage
58. LEGAL DISCLAIMER CONSTITUTION

The platform is:

COMPLIANCE READY

But before public launch:

Tunisian accountant validation required
TTN integration validation required
invoice template validation required
59. UML — CORE FLOW
Product Sale Flow
POS
↓
Search Product
↓
Add Quantity
↓
Select Client
↓
Choose Payment
↓
Generate Invoice
↓
Update Inventory
↓
Create Audit Logs
↓
Generate PDF
↓
Queue Compliance
60. UML — COMPLIANCE FLOW
Draft Invoice
↓
Validation
↓
Lock Number
↓
Generate XML/TEIF
↓
Generate Signature
↓
Queue Submission
↓
Submit to TTN
↓
Receive Reference
↓
Archive Permanently
61. FINAL ENGINEERING PHILOSOPHY

The platform MUST prioritize:

Speed
Scalability
Clarity
Auditability
Responsiveness
Business Practicality
Legal Adaptability

over:

Feature Bloat
ERP Complexity
Visual Clutter
Technical Debt
62. FINAL CONSTITUTIONAL STATEMENT

StockFlow Tunisia is NOT:

a CRUD inventory project

It IS:

a production-grade Tunisian business operating system

built for:

real businesses
real accounting
real compliance
real scalability
real operations

using:

modern SaaS UX
scalable architecture
compliance-ready invoicing
fintech-grade design
mobile-first engineering