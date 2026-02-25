/*
 * Project Aura - Autonomous AI Agent
 * This script automates the process of generating AI - driven insights using Hugging Face and synchronizing them with a GitHub repository.
 */

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Standard Node.js File System module for synchronous file operations
const fs = require('fs');

// High-level wrapper for Git commands to handle repository synchronization
const simpleGit = require('simple-git');

// Official client for interacting with the Hugging Face Inference API
const { HfInference } = require('@huggingface/inference');

// Core instances initialization
const git = simpleGit();
const hf = new HfInference(process.env.HF_TOKEN);
const AGENT_NAME = "Aura";

/**
 * Main execution block for the autonomous agent.
 * Handles AI generation, local storage, and remote repository updates.
 */
async function runAuraAutonomous() {
    console.log(`--- [SYSTEM] ${AGENT_NAME} Initialization Started ---`);

    try {
        /**
         * SECTION 1: AI GENERATIVE INSIGHTS
         * Utilizing Meta's Llama 3.2 model to produce a structured developer log.
         * The prompt is optimized for a professional, concise output.
         */
        console.log("[AI] Dispatching request to Hugging Face Inference API...");
        const aiResponse = await hf.chatCompletion({
            model: "meta-llama/Llama-3.2-1B-Instruct",
            messages: [{
                role: "user",
                content: "Write a professional, one-sentence developer log about an AI agent automating a GitHub push. Keep it under 15 words."
            }],
            max_tokens: 30,
            temperature: 0.5
        });

        // Extracting and formatting content with local system timestamp
        const aiLog = aiResponse.choices[0].message.content.trim();
        const timestamp = new Date().toLocaleString();
        const logEntry = `\n[${timestamp}] ${AGENT_NAME} Insight: ${aiLog}`;

        /**
         * SECTION 2: DATA PERSISTENCE
         * Appending the formatted log entry into the local log file.
         * Using synchronous append to ensure data integrity before Git operations.
         */
        fs.appendFileSync('progress_log.txt', logEntry);
        console.log("[FILE] Local synchronization successful for progress_log.txt.");

        /**
         * SECTION 3: REPOSITORY & AUTHENTICATION CONFIGURATION
         * Setting up credentials and remote URLs for secure GitHub synchronization.
         */
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura";

        // Secure token handling from environment variables
        const TOKEN = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : "";

        if (!TOKEN) throw new Error("Authentication failed: GITHUB_TOKEN not found in environment.");

        // Constructing an authenticated remote URL using the Personal Access Token (PAT)
        const remoteUrl = `https://x-access-token:${TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        /**
         * SECTION 4: GIT IDENTITY & REMOTE ALIGNMENT
         * Essential for CI/CD environments (like GitHub Actions) to prevent "Identity not set" errors.
         */
        await git.addConfig('user.name', 'github-actions[bot]');
        await git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');

        // Refreshing the 'origin' remote to ensure valid authentication headers
        const remotes = await git.getRemotes();
        if (remotes.find(r => r.name === 'origin')) {
            await git.removeRemote('origin');
        }
        await git.addRemote('origin', remoteUrl);

        /**
         * SECTION 5: REMOTE SYNCHRONIZATION (STAGE, COMMIT, PUSH)
         * Only triggers the push workflow if actual changes are detected in the workspace.
         */
        await git.add('progress_log.txt');
        const status = await git.status();

        if (status.modified.length > 0) {
            console.log("[GIT] Modification detected. Preparing commit...");
            await git.commit(`Automated Cloud Update: ${AGENT_NAME} Deployment Core.`);

            // Direct push to the designated 'main' branch
            await git.push('origin', 'main');
            console.log("[SUCCESS] Repository synchronization complete. Deployment finalized.");
        } else {
            console.log("[IDLE] Workspace clean. No synchronization required.");
        }

    } catch (error) {
        /**
         * ERROR HANDLING:
         * Captures API, File System, or Git-related failures and ensures a non-zero exit code.
         */
        console.error(`[CRITICAL FAILURE] ${error.message}`);
        process.exit(1);
    }
}

// Global invocation of the autonomous agent process
runAuraAutonomous();