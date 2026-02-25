require('dotenv').config();
const fs = require('fs');
const simpleGit = require('simple-git');
const { HfInference } = require('@huggingface/inference');

const git = simpleGit();
const hf = new HfInference(process.env.HF_TOKEN);
const AGENT_NAME = "Aura";

async function runAuraDay2() {
    console.log(`--- ${AGENT_NAME} Status: System Initialization ---`);

    try {
        // 1. Generate Log Content using Hugging Face AI (Updated to chatCompletion)
        console.log("Status: Requesting AI-generated insights...");

        const aiResponse = await hf.chatCompletion({
            model: "meta-llama/Llama-3.2-1B-Instruct",
            messages: [{
                role: "user",
                content: "Write a professional, one-sentence developer log about an AI agent successfully automating GitHub pushes. Keep it under 15 words and direct."
            }],
            max_tokens: 30,
            temperature: 0.5
        });

        // Extract and format the AI response
        const aiLog = aiResponse.choices[0].message.content.trim();
        const timestamp = new Date().toLocaleString();
        const fullLog = `\n[${timestamp}] ${AGENT_NAME} Insight: ${aiLog}`;

        // 2. Local File Update
        fs.appendFileSync('progress_log.txt', fullLog);
        console.log("Status: progress_log.txt updated with AI content.");

        // 3. GitHub Credentials and Repository Configuration
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura";
        const GITHUB_TOKEN = process.env.GITHUB_TOKEN.trim();

        // Secure Authentication URL
        const remoteUrl = `https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        console.log("Status: Synchronizing with remote repository...");

        // Ensure remote origin is fresh
        const remotes = await git.getRemotes();
        if (remotes.find(r => r.name === 'origin')) {
            await git.removeRemote('origin');
        }
        await git.addRemote('origin', remoteUrl);

        // 4. Git Operations: Stage, Commit, and Force Push
        await git.add('.');

        try {
            await git.commit(`Automated Update: ${AGENT_NAME} AI log integration.`);
        } catch (commitError) {
            console.log("Status: No new changes to commit.");
        }

        // Force pushing to ensure remote matches local state
        await git.push('origin', 'main', { '--force': null });

        console.log("Status: Remote synchronization successful.");
        console.log(`--- ${AGENT_NAME} Mission Complete ---`);

    } catch (error) {
        console.error("Execution Error:", error.message);
        console.log("Solution: Check your HF_TOKEN and ensure the model has no temporary downtime.");
    }
}

runAuraDay2();