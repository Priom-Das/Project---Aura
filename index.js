const fs = require('fs');
const simpleGit = require('simple-git');
const git = simpleGit();

const AGENT_NAME = "Aura";

async function initializeAura() {
    console.log(`--- ${AGENT_NAME} is awakening ---`);

    try {
        // 1. Making a daily Log file(Aura's Diary)
        const timestamp = new Date().toLocaleString();
        const logContent = `\n[${timestamp}] Day 1: System setup complete. Aura is now linked with Git.`;

        // Check if the log file exists, if not create it 
        fs.appendFileSync('progress_log.txt', logContent);
        console.log(` Log updated in progress_log.txt`);

        // ২. Work of Github(Local Commit)
        console.log(` ${AGENT_NAME} is recording progress locally...`);

        await git.init();
        await git.add('.');
        await git.commit(`Day 1: ${AGENT_NAME} system integration check.`);

        console.log(` Success! Aura has committed the changes.`);
        console.log(`--- Mission Accomplished for Day 1 ---`);

    } catch (error) {
        console.error("Error occurred:", error.message);
    }
}

initializeAura();