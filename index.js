require('dotenv').config();
const fs = require('fs');
const simpleGit = require('simple-git');
const { HfInference } = require('@huggingface/inference');

const git = simpleGit();
const hf = new HfInference(process.env.HF_TOKEN);
const AGENT_NAME = "Aura";

async function runAuraDay3() {
    console.log(`--- ${AGENT_NAME} Status: System Initialization ---`);

    try {
        // 1. Generate Log Content using AI
        console.log("Status: Requesting AI-generated insights...");
        const aiResponse = await hf.chatCompletion({
            model: "meta-llama/Llama-3.2-1B-Instruct",
            messages: [{
                role: "user",
                content: "Write a professional, one-sentence developer log about an AI agent automating a GitHub push. Keep it under 15 words."
            }],
            max_tokens: 30,
            temperature: 0.5
        });

        const aiLog = aiResponse.choices[0].message.content.trim();
        const timestamp = new Date().toLocaleString();
        const fullLog = `\n[${timestamp}] ${AGENT_NAME} Insight: ${aiLog}`;

        // 2. Local File Update
        fs.appendFileSync('progress_log.txt', fullLog);
        console.log("Status: progress_log.txt updated locally.");

        // 3. GitHub Configuration for Authentication
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura";
        // Cloud-এ GITHUB_TOKEN ভেরিয়েবল ব্যবহার হবে, আর local-এ .env থেকে নেবে
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : "";

        if (!GITHUB_TOKEN) {
            throw new Error("GITHUB_TOKEN missing! Check Secrets or .env file.");
        }

        // Authentication URL (x-access-token is standard for GitHub Actions)
        const remoteUrl = `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        // Reset remote to ensure correct authentication every time
        const remotes = await git.getRemotes();
        if (remotes.find(r => r.name === 'origin')) {
            await git.removeRemote('origin');
        }
        await git.addRemote('origin', remoteUrl);

        // Set Identity for GitHub Actions
        await git.addConfig('user.name', 'GitHub Action');
        await git.addConfig('user.email', 'action@github.com');

        // 4. Git Operations: Stage, Commit, and Push
        console.log("Status: Staging files...");
        await git.add('.');

        const status = await git.status();
        if (status.staged.length > 0) {
            console.log("Status: Changes detected, committing...");
            await git.commit(`Automated Cloud Update: ${AGENT_NAME} Day 3 Execution.`);

            console.log("Status: Pushing to GitHub main branch...");
            // Force push usage can be safer in ephemeral CI environments, or standard push
            await git.push('origin', 'main');
            console.log("Status: Remote synchronization successful!");
        } else {
            console.log("Status: No new changes to commit.");
        }

    } catch (error) {
        console.error("Execution Error:", error.message);
    }
}

runAuraDay3();