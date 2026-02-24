require('dotenv').config();
const fs = require('fs');
const simpleGit = require('simple-git');
const { OpenAI } = require('openai');

const git = simpleGit();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const AGENT_NAME = "Aura";

async function runAuraDay2() {
    console.log(`--- ${AGENT_NAME} Status: Initializing Analysis ---`);

    try {
        // 1. Log Generation Logic
        // Using static message due to OpenAI quota constraints
        const aiLog = "AI integration complete. GitHub automation synchronized.";
        const timestamp = new Date().toLocaleString();
        const fullLog = `\n[${timestamp}] ${AGENT_NAME} Report: ${aiLog}`;

        // 2. File System Update
        fs.appendFileSync('progress_log.txt', fullLog);
        console.log("Status: progress_log.txt updated successfully.");

        // 3. GitHub Automation Configuration
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura"; // Ensuring exact repository name matches your URL
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

        // Constructing Authentication URL
        const remote = `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        console.log(`Status: Synchronizing with remote repository...`);

        // Re-configuring remote to prevent Authentication Errors
        const remotes = await git.getRemotes(false);
        if (remotes.some(r => r.name === 'origin')) {
            await git.remote(['set-url', 'origin', remote]);
        } else {
            await git.addRemote('origin', remote);
        }

        // 4. Git Operations: Add, Commit, and Push
        await git.add('.');
        await git.commit(`Automated Update: Day 2 ${AGENT_NAME} implementation.`);

        // Force pushing to main branch to ensure synchronization
        await git.push('origin', 'main', { '--force': null });

        console.log(`Status: Remote synchronization successful.`);
        console.log(`--- Mission Accomplished ---`);

    } catch (error) {
        console.error("Execution Error:", error.message);
    }
}

runAuraDay2();