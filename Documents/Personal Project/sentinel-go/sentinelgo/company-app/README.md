# SentinelGo

SentinelGo is a security-focused portfolio project that simulates a fictional company environment and uses a Go-based detection engine to identify suspicious activity from application logs.

## Project Goal

Build a Dockerized attack simulation and detection platform that combines:

- A vulnerable fake company web application (Django + React)
- Role-based access controls across departments and internal applications
- Simulated attack activity against the environment
- A Go CLI tool that analyzes logs and raises alerts
- Incident response style reporting

The long-term goal is to evolve this into a mini security engineering platform inspired by SIEM and detection engineering workflows.

---

## Fake Company Environment

Fictional Company: **Northbridge Systems Inc.**

Departments include:

- Finance
- Human Resources
- Development
- Cloud Engineering
- Sales
- IT / Security

Each department includes multiple users with varying privileges:

- Manager
- Team Lead
- Full-Time Employee
- Intern
- System Admin / Security Roles

Users have access only to applications allowed by both:

- Department
- Role privileges

Example:

- Finance users can access the Finance Portal
- Development users should not access the HR Portal
- Interns have fewer privileges than managers
- Admin Console is restricted to privileged roles

---

## Internal Applications

Planned internal applications:

- Employee Portal
- Finance Portal
- HR Portal
- Development Portal
- Cloud Operations Portal
- Admin Console

These applications intentionally include controlled vulnerable inputs for security detection testing.

---

## Planned Security Detection Coverage

SentinelGo will analyze logs for:

- Brute-force login activity
- Broken access control attempts
- Cross-department access violations
- SQL injection-like payloads
- XSS-like payloads
- SSRF-style suspicious URL inputs
- Admin route probing / reconnaissance
- Suspicious privileged activity

---

## Tech Stack

Backend:
- Python
- Django
- PostgreSQL

Frontend:
- React

Detection Engine:
- Go (CLI)

Infrastructure:
- Docker
- Docker Compose

---

## Current Django App Structure

```text
accounts/
finance/
hr/
development/
cloud_ops/
admin_console/
audit/
```

---

## Project Status

Current phase:

- [x] Architecture planning
- [ ] Build Django fake company environment
- [ ] Add structured audit logging
- [ ] Build Go detection engine
- [ ] Add incident reporting
- [ ] Add dashboard (future)

---

## Security Notice

This application is intentionally designed as a vulnerable training environment.

It is for local Dockerized use only.

DO NOT deploy this application to the public internet.

---

## Future Goals

Future enhancements may include:

- MITRE ATT&CK mapping
- Severity scoring engine
- React alert dashboard
- Detection tuning / false-positive reduction
- Containerized attack simulation modules

---