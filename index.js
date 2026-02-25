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
        console.log("Status: progress_log.txt updated.");

        // 3. GitHub Configuration
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura";
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : "";

        if (!GITHUB_TOKEN) {
            throw new Error("GITHUB_TOKEN is missing. Check your Secrets or .env file.");
        }

        // Secure URL for Cloud/Local Authentication
        const remoteUrl = `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        const remotes = await git.getRemotes();
        if (remotes.find(r => r.name === 'origin')) {
            await git.removeRemote('origin');
        }
        await git.addRemote('origin', remoteUrl);

        // 4. Git Operations
        await git.add('.');

        try {
            await git.commit(`Automated Cloud Update: ${AGENT_NAME} Day 3 Execution.`);
            console.log("Status: Committing changes...");
        } catch (e) {
            console.log("Status: No changes to commit.");
        }

        await git.push('origin', 'main', { '--force': null });

        console.log("Status: Remote synchronization successful.");
        console.log(`--- ${AGENT_NAME} Mission Complete ---`);

    } catch (error) {
        console.error("Execution Error:", error.message);
    }
}

runAuraDay3();