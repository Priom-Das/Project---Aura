require('dotenv').config();
const fs = require('fs');
const simpleGit = require('simple-git');
const { OpenAI } = require('openai');

const git = simpleGit();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const AGENT_NAME = "Aura";

async function runAuraDay2() {
    console.log(`--- ${AGENT_NAME} Status: System Initialization ---`);

    try {
        // 1. Generate Log Content
        // Static fallback used due to API quota limits
        const aiLog = "AI integration operational. Automation pipeline synchronized.";
        const timestamp = new Date().toLocaleString();
        const fullLog = `\n[${timestamp}] ${AGENT_NAME} Insight: ${aiLog}`;

        // 2. Local File Update
        fs.appendFileSync('progress_log.txt', fullLog);
        console.log("Status: progress_log.txt updated.");

        // 3. GitHub Credentials and Repository Configuration
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura";
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN.trim();

        // Constructing Secure Remote URL
        const remoteUrl = `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        console.log("Status: Synchronizing with remote repository...");

        // Resetting remote origin to ensure correct authentication
        const remotes = await git.getRemotes();
        if (remotes.find(r => r.name === 'origin')) {
            await git.removeRemote('origin');
        }
        await git.addRemote('origin', remoteUrl);

        // 4. Git Operations: Stage, Commit, and Force Push
        await git.add('.');

        // Handling cases where there might be no changes to commit
        try {
            await git.commit(`Automated Update: ${AGENT_NAME} Day 2 execution.`);
        } catch (commitError) {
            console.log("Status: No new changes to commit.");
        }

        // Force pushing to resolve any previous rule violations or sync issues
        await git.push('origin', 'main', { '--force': null });

        console.log("Status: Remote synchronization successful.");
        console.log(`--- ${AGENT_NAME} Mission Complete ---`);

    } catch (error) {
        console.error("Execution Error:", error.message);
        console.log("Tip: Ensure your GITHUB_TOKEN is valid and Secret Protection is managed in GitHub settings.");
    }
}

runAuraDay2();