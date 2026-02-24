# Project Aura

Project Aura is an automated documentation agent built to track daily development progress. It leverages AI-driven insights to maintain activity logs and synchronizes them directly with GitHub repositories.

## Core Capabilities

- Automated Logging: Generates and appends status updates to a persistent log file.
- AI Insights: Integrates with language models to produce professional progress reports.
- Version Control Integration: Handles git operations including staging, committing, and pushing updates automatically.
- Security Protocol: Implements environment variable management to ensure API credentials remain private.

## Technical Architecture

- Environment: Node.js
- Version Control: Simple-Git
- AI Models: Support for OpenAI and Hugging Face Inference API
- Configuration: Dotenv for secure credential handling

## Directory Structure

Project-Aura/
├── node_modules/       # Project dependencies
├── .env                # Private credentials and API keys
├── .gitignore          # Rules for excluded files
├── index.js            # Primary logic and execution flow
├── progress_log.txt    # Chronological activity history
└── README.md           # Project documentation

## Installation and Execution

1. Clone the repository
   git clone https://github.com/Priom-Das/Project---Aura.git
   cd Project---Aura

2. Install necessary packages
   npm install

3. Configure environment variables
   Create a .env file in the root folder with the following:
   GITHUB_TOKEN=your_token_here
   HUGGINGFACE_TOKEN=your_token_here

4. Initialize the agent
   node index.js

## Project Roadmap

- Phase 1: Establish core GitHub automation and file handling (Completed)
- Phase 2: Integrate AI inference for dynamic logging (Completed)
- Phase 3: Transition to GitHub Actions for cloud-based scheduling (Pending)
- Phase 4: Develop a monitoring dashboard for activity visualization (Planned)

Developed by - Priom Das