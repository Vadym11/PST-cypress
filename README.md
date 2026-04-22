# PST-Cypress

End-to-end test automation suite for [Practice Software Testing (PST) Toolshop](https://practicesoftwaretesting.com) application. Combines UI and API tests to validate a full e-commerce platform — authentication, product catalog, shopping cart, and checkout flows.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
  - [UI Tests](#ui-tests)
  - [API Tests](#api-tests)
- [Architecture](#architecture)
  - [Page Object Models](#page-object-models)
  - [API Models](#api-models)
  - [Custom Commands](#custom-commands)
  - [Utilities](#utilities)
- [CI/CD](#cicd)
- [Docker](#docker)

---

## Overview

PST-Cypress tests a full e-commerce toolshop application across two layers:

- **UI tests** — browser-level flows using Page Object Models
- **API tests** — direct REST API validation

Key features under test:
- User registration, login, logout, and password reset
- Product search, filtering, and sorting
- Shopping cart management
- Complete checkout flows (guest and registered users)
- Payment processing (bank transfer, credit card)
- User account management
- Admin product CRUD operations

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| [Cypress](https://www.cypress.io/) | ^15.11.0 | E2E testing framework |
| [TypeScript](https://www.typescriptlang.org/) | ^5.9.3 | Type-safe test code |
| [@faker-js/faker](https://fakerjs.dev/) | ^10.3.0 | Dynamic test data generation |
| [@testing-library/cypress](https://testing-library.com/docs/cypress-testing-library/intro/) | ^10.1.0 | Accessibility-friendly queries |
| [ESLint](https://eslint.org/) | ^10.0.2 | Code quality & linting |
| [dotenv](https://github.com/motdotla/dotenv) | ^17.3.1 | Environment variable loading |

---

## Project Structure

```
PST-Cypress/
├── .github/
│   └── workflows/
│       └── PST-Cypress.yaml        # GitHub Actions CI/CD pipeline
├── _docker/
│   └── Dockerfile.cypress          # Docker image for CI test runs
├── k8s/                            # Kubernetes deployment manifests
├── cypress/
│   ├── e2e/
│   │   ├── ui/                     # UI end-to-end specs
│   │   └── api/                    # API specs
│   ├── fixtures/                   # Static test data (JSON)
│   ├── screenshots/                # Auto-captured failure screenshots
│   ├── videos/                     # Test run recordings
│   └── support/
│       ├── api-models/             # API abstraction classes
│       ├── page-objects/           # Page Object Model classes
│       ├── types/                  # TypeScript interfaces
│       ├── utils/                  # Helper utilities
│       ├── data/                   # Static test data (countries, users)
│       ├── commands.ts             # Custom Cypress commands
│       ├── e2e.js                  # Global test setup
│       └── index.d.ts              # TypeScript declarations
├── cypress.config.js               # Cypress configuration
├── entrypoint.cypress.cjs          # CI entry point with Slack notifications
├── eslint.config.mts               # ESLint configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- A running instance of the PST Toolshop app (or use the public demo at `https://practicesoftwaretesting.com`)

### Installation

```bash
git clone <repo-url>
cd PST-Cypress
npm install
```

### Environment Variables

Copy the example below into a `.env` file at the project root:

```bash
BASE_URL=https://practicesoftwaretesting.com

ADMIN_USER_EMAIL=admin@practicesoftwaretesting.com
ADMIN_USER_PASSWORD=welcome01

USER_EMAIL=customer@practicesoftwaretesting.com
USER_PASSWORD=welcome01

FORGOT_PASSWORD=welcome02
```

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Application base URL |
| `ADMIN_USER_EMAIL` | Admin account email (for product CRUD and user management tests) |
| `ADMIN_USER_PASSWORD` | Admin account password |
| `USER_EMAIL` | Regular user account email |
| `USER_PASSWORD` | Regular user account password |
| `FORGOT_PASSWORD` | Password used in password reset tests |

---

## Running Tests

```bash
# Run all tests (headless)
npm run test:all

# Run UI tests only
npm run test:ui

# Run API tests only
npm run test:api

# Run smoke tests only
npm run test:smoke

# Open Cypress interactive UI
npx cypress open
```

**Common options:**

```bash
# Run in a specific browser
npm run test:all -- --browser chrome

# Run in headed mode (shows the browser)
npm run test:all -- --headed

# Run a single spec file
npx cypress run --spec "cypress/e2e/ui/login.spec.ts"
```

By default, tests run in the Electron browser. Set `CYPRESS_VIDEO=true` to enable video recording.

---

## Test Coverage

### UI Tests

| Spec | What it covers |
|------|---------------|
| `login.spec.ts` | Login with valid/invalid credentials, account page verification |
| `register.spec.ts` | New user registration, API intercept validation, post-test cleanup |
| `product-search.spec.ts` | Full-term search, partial-term search, no-results handling, navigation |
| `product-purchase-flow.spec.ts` | Full checkout as guest; checkout as registered user (signed out); checkout with bank transfer while signed in |
| `header-navigation.spec.ts` | Home, category menu, contacts, sign-in link, language selector |

### API Tests

| Spec | What it covers |
|------|---------------|
| `user.spec.ts` | Get all users, get current user, get by ID, register, login, logout, change password, password reset, update user (full & partial), token refresh, delete user |
| `product.spec.ts` | Get all products (paginated), get by ID, search, filter by brand/category, sort by price, create/update/delete products, 404 handling |

---

## Architecture

### Page Object Models

Located in `cypress/support/page-objects/`. Each class encapsulates selectors and interactions for a single page or component:

| Class | Page / Component |
|-------|-----------------|
| `BasePage` | Shared methods across all pages |
| `HomePage` | Product listing, search, pagination, random product selection |
| `ProductPage` | Product details, add-to-cart |
| `LoginPage` | Login form, account page verification |
| `RegisterPage` | Registration form |
| `AccountPage` | User account management |
| `HeaderComponent` | Navigation, language selection, categories |
| `CartMainPage` | Cart display |
| `CartSignInPage` | Cart sign-in flow |
| `CartBillingAddressPage` | Billing address entry |
| `CartPaymentPage` | Payment method selection and confirmation |

### API Models

Located in `cypress/support/api-models/`. Wrap REST endpoints into reusable methods:

| Class | Endpoints covered |
|-------|------------------|
| `ApiUser` | User CRUD, auth, token management |
| `ApiProduct` | Product CRUD, search, filtering, sorting |

### Custom Commands

Defined in `cypress/support/commands.ts` and declared in `cypress/support/index.d.ts`:

| Command | Description |
|---------|-------------|
| `cy.getAdminCreds()` | Returns admin credentials from environment |
| `cy.loginViaApi(email, password)` | API-based login using `cy.session()` for efficient reuse; stores auth token in `localStorage` |
| `cy.findByTestId(id)` | Testing Library integration for `data-testid` queries |

### Utilities

Located in `cypress/support/utils/`:

| File | Contents |
|------|----------|
| `test-utils.ts` | `generateRandomUserData()`, `generateRandomUserDataFaker()`, `generateRandomProductDataFaker()` |
| `project-utils.ts` | Credential loaders, URL helpers |
| `api-handler.ts` | Generic HTTP wrapper for API calls |

**Type definitions** in `cypress/support/types/`: `user.ts`, `product.ts`, `payment-methods.ts`, `tool-categories.ts`, `languages.ts`, `common-responses-api.ts`.

---

## CI/CD

The GitHub Actions workflow (`.github/workflows/PST-Cypress.yaml`) triggers on push and pull requests to `main`.

**Pipeline stages:**

1. **Detect changes** — skips the run if no Cypress-related files changed
2. **Build & push** — builds the Docker image and pushes to GCP Artifact Registry
3. **Deploy to GKE** — spins up an ephemeral namespace (`toolshop-ci-{run_id}`) with the full application stack (DB, API, web frontend, cron)
4. **Seed database** — runs migrations and seeds test data
5. **Run tests** — executes the suite inside a K8s pod via `entrypoint.cypress.cjs`
6. **Collect artifacts** — uploads screenshots and videos to GitHub Artifacts
7. **Cleanup** — deletes the ephemeral namespace
8. **Notify** — sends pass/fail results to a Slack webhook

---

## Docker

The `_docker/Dockerfile.cypress` image is used in CI. To build it locally:

```bash
docker build -f _docker/Dockerfile.cypress -t pst-cypress .
```

To run tests inside the container:

```bash
docker run --rm \
  -e BASE_URL=https://practicesoftwaretesting.com \
  -e ADMIN_USER_EMAIL=admin@practicesoftwaretesting.com \
  -e ADMIN_USER_PASSWORD=welcome01 \
  -e USER_EMAIL=customer@practicesoftwaretesting.com \
  -e USER_PASSWORD=welcome01 \
  pst-cypress
```
