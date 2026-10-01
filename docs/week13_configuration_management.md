# Week 13: Configuration Management Script

## Overview
As our infrastructure grows, configuring servers manually (installing Docker, configuring networks, pulling images) becomes unscalable and error-prone. This week, we introduced **Ansible** as our Configuration Management tool to define our server infrastructure as code (IaC).

## 1. Directory Structure
We created a new `provisioning/` directory to hold all Infrastructure as Code (IaC) files:
- `setup_server.yml`: The main Ansible playbook.
- `inventory.ini`: The inventory defining the target servers.

## 2. The Ansible Playbook (`setup_server.yml`)
The playbook is a YAML file that declares the *desired state* of our target servers. It ensures:
1. The `docker` package is installed.
2. The Docker daemon service is running and enabled on boot.
3. Any old `shift-scheduler` containers are safely stopped and removed.
4. The latest `workforce-scheduling:latest` container is spun up on port `8080`.

Because Ansible is **idempotent**, running this script multiple times will only make changes if the system is out of alignment with this desired state.

## 3. Running the Playbook
To execute the configuration management script against the targets defined in the inventory, an administrator runs:
```bash
ansible-playbook -i provisioning/inventory.ini provisioning/setup_server.yml
```
*(Note: Running this requires Ansible installed on the control node. Since Ansible Control Nodes operate primarily on Linux/WSL, this script is designed to be executed via a CI/CD runner or a Linux workstation against remote target VMs).*
