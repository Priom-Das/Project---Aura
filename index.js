// // Load environment variables from the .env file (for local development)
// require('dotenv').config();

// // Import required modules: fs (File System), simple-git (Git control), and Hugging Face Inference
// const fs = require('fs');
// const simpleGit = require('simple-git');
// const { HfInference } = require('@huggingface/inference');

// // Initialize the Git and AI instances
// const git = simpleGit();
// const hf = new HfInference(process.env.HF_TOKEN);
// const AGENT_NAME = "Aura";

// async function runAuraAutonomous() {
//     console.log(`--- ${AGENT_NAME} Status: System Initialization ---`);

//     try {
//         /**
//          * SECTION 1: AI CONTENT GENERATION
//          * Connects to Hugging Face to generate a professional log entry using Llama 3.2.
//          */
//         console.log("Status: Requesting AI-generated insights...");
//         const aiResponse = await hf.chatCompletion({
//             model: "meta-llama/Llama-3.2-1B-Instruct",
//             messages: [{
//                 role: "user",
//                 content: "Write a professional, one-sentence developer log about an AI agent automating a GitHub push. Keep it under 15 words."
//             }],
//             max_tokens: 30,
//             temperature: 0.5
//         });

//         // Clean the AI output and prepare the timestamped string
//         const aiLog = aiResponse.choices[0].message.content.trim();
//         const timestamp = new Date().toLocaleString();
//         const fullLog = `\n[${timestamp}] ${AGENT_NAME} Insight: ${aiLog}`;

//         /**
//          * SECTION 2: LOCAL FILE SYSTEM UPDATE
//          * Appends the generated log entry to the progress_log.txt file.
//          */
//         fs.appendFileSync('progress_log.txt', fullLog);
//         console.log("Status: progress_log.txt updated.");

//         /**
//          * SECTION 3: GIT AUTHENTICATION & CONFIGURATION
//          * Sets up the environment to allow pushing changes back to GitHub.
//          */
//         const GITHUB_USER = "Priom-Das";
//         const REPO_NAME = "Project---Aura";

//         // Retrieve the token from environment variables (provided by .env or GitHub Secrets)
//         const GITHUB_TOKEN = process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.trim() : "";

//         if (!GITHUB_TOKEN) {
//             throw new Error("GITHUB_TOKEN is missing. Configuration failed.");
//         }

//         // Create an authenticated URL using the Personal Access Token
//         const remoteUrl = `https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

//         // Refresh the 'origin' remote to ensure we use the authenticated URL
//         const remotes = await git.getRemotes();
//         if (remotes.find(r => r.name === 'origin')) {
//             await git.removeRemote('origin');
//         }
//         await git.addRemote('origin', remoteUrl);

//         // Identify the committer as 'GitHub Action Bot' for the repository history
//         await git.addConfig('user.name', 'github-actions[bot]');
//         await git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');

//         /**
//          * SECTION 4: COMMIT AND PUSH
//          * Stages the modified log file, commits the change, and pushes it to the main branch.
//          */
//         await git.add('progress_log.txt');

//         const status = await git.status();

//         // Only proceed if there are actual changes to avoid empty commits
//         if (status.modified.length > 0 || status.not_added.length > 0) {
//             console.log("Status: Changes detected, committing...");
//             await git.commit(`Automated Cloud Update: ${AGENT_NAME} Execution.`);

//             console.log("Status: Pushing to remote main branch...");
//             await git.push('origin', 'main');
//             console.log("Status: Synchronization successful.");
//         } else {
//             console.log("Status: No changes detected.");
//         }

//     } catch (error) {
//         // Log any critical failures (API issues, Git conflicts, or permission errors)
//         console.error("Critical Error:", error.message);
//     }
// }

// // Execute the autonomous process
// runAuraAutonomous();/**
*
Project Aura - Autonomous AI Agent *
    Professional Deployment Version 2.0 *
    /

require('dotenv').config();
const fs = require('fs');
const simpleGit = require('simple-git');
const { HfInference } = require('@huggingface/inference');

const git = simpleGit();
const hf = new HfInference(process.env.HF_TOKEN);
const AGENT_NAME = "Aura";

async function runAuraAutonomous() {
    console.log(`--- [SYSTEM] ${AGENT_NAME} Initialization ---`);

    try {
        // AI Content Generation
        const aiResponse = await hf.chatCompletion({
            model: "meta-llama/Llama-3.2-1B-Instruct",
            messages: [{
                role: "user",
                content: "Professional developer log about AI automating GitHub. Under 12 words."
            }],
            max_tokens: 30,
            temperature: 0.5
        });

        const aiLog = aiResponse.choices[0].message.content.trim();
        const timestamp = new Date().toLocaleString();
        const logEntry = `\n[${timestamp}] ${AGENT_NAME} Insight: ${aiLog}`;

        // Local File Update
        fs.appendFileSync('progress_log.txt', logEntry);
        console.log("[FILE] progress_log.txt updated.");

        // Git Configuration
        const GITHUB_USER = "Priom-Das";
        const REPO_NAME = "Project---Aura";
        const TOKEN = process.env.GITHUB_TOKEN ? .trim();

        if (!TOKEN) throw new Error("GITHUB_TOKEN is missing in environment variables.");

        // Authenticated Remote URL
        const remoteUrl = `https://x-access-token:${TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

        // Update Git Identity (Crucial for CI)
        await git.addConfig('user.name', 'github-actions[bot]');
        await git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');

        // Re-align Remote
        const remotes = await git.getRemotes();
        if (remotes.find(r => r.name === 'origin')) await git.removeRemote('origin');
        await git.addRemote('origin', remoteUrl);

        // Stage and Synchronize
        await git.add('progress_log.txt');
        const status = await git.status();

        if (status.modified.length > 0) {
            console.log("[GIT] Changes detected. Committing...");
            await git.commit(`Automated Cloud Log: ${AGENT_NAME} Execution`);

            // Push directly to main branch
            await git.push('origin', 'main');
            console.log("[SUCCESS] Aura synchronization successful.");
        } else {
            console.log("[IDLE] No changes to push.");
        }

    } catch (error) {
        console.error(`[CRITICAL] ${error.message}`);
        process.exit(1);
    }
}

runAuraAutonomous();