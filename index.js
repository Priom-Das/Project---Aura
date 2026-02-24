require('dotenv').config();
const fs = require('fs');
const simpleGit = require('simple-git');
const { OpenAI } = require('openai');

// Configure Git and OpenAI clients
const git = simpleGit();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const AGENT_NAME = "Aura";

async function runAuraDay2() {
    console.log(`--- ${AGENT_NAME} is analyzing today's progress ---`);

    try {
        // 1. Generate an AI-powered log message using OpenAI's API
        /*const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Write a short, professional one-line log for a developer who just integrated AI and GitHub automation. Keep it under 15 words." }],
    });

const aiLog = response.choices[0].message.content; */
        const aiLog = "AI integration in progress (Quota limit hit, but automation works!)";
        const timestamp = new Date().toLocaleString();
        const fullLog = `\n[${timestamp}] AI Insight: ${aiLog}`;

        // 2. Update the log file with the AI-generated message
        fs.appendFileSync('progress_log.txt', fullLog);
        console.log(`AI-Generated Log added to file.`);

        // 3. Github Automation(Commit & Push)
        console.log(`Aura is pushing updates directly to GitHub...`);

        // YOUR GITHUB REPO URL (Make sure to replace 'user_name' and 'Project-Aura' with your actual GitHub username and repository name)
        const remote = `https://${process.env.GITHUB_TOKEN}@github.com/Priom-Das/Project-Aura.git`;

        await git.add('.');
        await git.commit(`Day 2: ${AGENT_NAME} integrated AI and Auto-Push.`);

        // DIRECTLY PUSHING TO GITHUB WITHOUT ASKING FOR CREDENTIALS
        await git.push('origin', 'main');

        console.log(`Success! Check your GitHub repository online.`);
        console.log(`--- Day 2 Mission Complete ---`);

    } catch (error) {
        console.error("Critical Error:", error.message);
    }
}

runAuraDay2();