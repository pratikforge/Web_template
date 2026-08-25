# 🚀 Web_template

> **High-Velocity AI-Assisted Website & Agent Template for Hackathons & Rapid Prototyping**

A high-performance, agentic-ready full-stack web template engineered specifically for rapid hackathon turnarounds, AI agent pair-programming, and production-grade prototyping. Designed to eliminate boilerplate, enforce strict test-driven development (TDD), and leverage AST-based codebase knowledge graphs for instant agent context.

---

## 📑 Table of Contents

- [Overview & Philosophy](#-overview--philosophy)
- [Key Features](#-key-features)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Agent & Knowledge Graph Integration](#-agent--knowledge-graph-integration)
- [Development Workflow & Guardrails](#-development-workflow--guardrails)
- [Testing & Security Standards](#-testing--security-standards)
- [CI/CD & Pre-Commit Hooks](#-cicd--pre-commit-hooks)
- [License](#-license)

---

## ⚡ Overview & Philosophy

In hackathons and fast-paced sprints, speed without guardrails leads to fragile code, broken builds, and wasted time. **Web_template** combines speed with rigorous engineering principles:

- **Zero-Setup Agent Context:** Built-in Graphify knowledge graph for instant AST understanding without full-context grepping.
- **Specification-First:** Ready-made PRD and Tech Stack PRD templates in `spec/` to define scope before writing code.
- **Strict TDD & Security:** Microsoft STRIDE & OWASP Top 10 security verification integrated directly into development plans.
- **Modular Boundaries:** Clear separation between agent orchestration, frontend, backend, deployment, telemetry, and evaluations.

---

## ✨ Key Features

```yaml
core_capabilities:
  agent_ecosystem:
    - "30+ specialized agent skills in `.agents/skills/` (TDD, UI engineering, security hardening, etc.)"
    - "Standardized agent rules and guidelines in `.agents/AGENTS.md`"
    - "Automated error logging and dynamic rule adaptation in `telemetry/`"
  knowledge_graph:
    - "AST-level codebase mapping via Graphify"
    - "Interactive visualization in `graphify-out/graph.html`"
    - "Instant query, shortest path, and concept explanation tools"
  scaffolding:
    - "Modular frontend and backend placeholders ready for any modern stack"
    - "Pre-configured CI/CD workflow (`.github/workflows/lint-and-test.yml`)"
    - "Pre-commit security and formatting hooks (`.pre-commit-config.yaml`)"
  security_and_testing:
    - "STRIDE & OWASP Top 10 attack vectors integrated into test templates"
    - "Space & Time Complexity benchmarks template in `spec/template_testing.md`"
    - "Agent discovery and validation pipeline in `discovery-agent-spec.md`"
```

---

## 📂 Repository Structure

The repository structure follows a clean separation of concerns:

```yaml
directory_layout:
  .agents/:
    description: "Agent configuration, project rules (AGENTS.md), and reusable skills"
  .github/:
    description: "GitHub Actions CI pipelines and repository automation"
  agent/:
    description: "Autonomous agents, background workers, and orchestrators"
  backend/:
    description: "Backend APIs, database schemas, routes, and services"
  frontend/:
    description: "Client web application, UI components, state management, and assets"
  deployment/:
    description: "Deployment configurations, Dockerfiles, and Infrastructure-as-Code"
  evals/:
    description: "Evaluation benchmarks, prompt evals, and agent performance checks"
  error_db/:
    description: "Postmortems, known bug patterns, and resolution database"
  graphify-out/:
    description: "Graphify knowledge graph outputs (graph.json, graph.html, GRAPH_REPORT.md)"
  spec/:
    description: "PRD templates, Tech Stack specifications, and testing guidelines"
  telemetry/:
    description: "Error logs, runtime telemetry, and continuous learning records"
  tests/:
    description: "Unit, integration, end-to-end, and cyber security test suites"
```

---

## 🚀 Getting Started

### 1. Clone & Set Up Remote
```bash
git clone https://github.com/pratikforge/Web_template.git
cd Web_template
```

### 2. Install Pre-Commit Hooks
Ensure quality gates and secret detection run automatically on every commit:
```bash
# Using Python pre-commit
pip install pre-commit
pre-commit install
```

### 3. Generate Codebase Knowledge Graph
Generate or update the AST knowledge graph:
```bash
# Windows
update-graph.bat

# Or directly via CLI
graphify update .
```

View the interactive knowledge graph by opening `graphify-out/graph.html` in your browser.

---

## 🧠 Agent & Knowledge Graph Integration

This template is purpose-built to pair with AI coding agents:

- **Graphify-First Navigation:** Agents query `graph.json` via `graphify query "<query>"` before reading or editing source files.
- **Autonomous Rule Learning:** Whenever an unexpected error occurs during execution, it is logged in `telemetry/error_log.md` and registered in `.agents/AGENTS.md`.
- **Specialized Skills:** Agent capabilities are defined in `.agents/skills/`, covering UI engineering, DevTools automation, cyber security frameworks, and API design.

---

## 🛡️ Development Workflow & Guardrails

To maintain stability during high-speed development, adhere to the following workflow:

```yaml
workflow_steps:
  step_1_spec_and_plan:
    action: "Define requirements using `spec/PRD_Template.md` and `spec/TechStack_PRD_Template.md`"
  step_2_knowledge_lookup:
    action: "Query the Graphify graph before modifying or adding code"
  step_3_tdd_implementation:
    action: "Write automated tests (unit + security) before implementing features"
  step_4_graph_update:
    action: "Execute `graphify update .` to keep the AST map synchronized"
  step_5_atomic_commit:
    action: "Commit changes using standard Conventional Commits with clear scope separation"
```

### Git Commit Conventions
Follow atomic conventional commits:
- `feat`: New feature or user capability
- `fix`: Bug fix or error resolution
- `docs`: Documentation updates
- `test`: Adding or updating test suites
- `refactor`: Code refactoring without behavior change
- `chore`: Tooling, dependencies, or configuration changes
- `ci`: CI/CD pipeline modifications

---

## 🔒 Testing & Security Standards

Every feature implementation must satisfy:
1. **Unit & Integration Tests:** Comprehensive functional coverage with zero test failures.
2. **Cyber Security Verification:** Validated against Microsoft STRIDE and OWASP Top 10 vulnerabilities (Input validation, Auth bypass, Injection, XSS, SSRF).
3. **Complexity Budgets:** Space and time complexity verification as outlined in `spec/template_testing.md`.

---

## 📦 License

This project is licensed under the MIT License.
