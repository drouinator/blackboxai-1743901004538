// DOM Elements
const micButton = document.getElementById('micButton');
const voiceStatus = document.getElementById('voiceStatus');
const commandInput = document.getElementById('commandInput');
const sendCommand = document.getElementById('sendCommand');
const commandOutput = document.getElementById('commandOutput');
const settingsBtn = document.getElementById('settingsBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const activityLog = document.getElementById('activityLog');

// System stats elements
const cpuUsage = document.getElementById('cpuUsage');
const cpuBar = document.getElementById('cpuBar');
const memoryUsage = document.getElementById('memoryUsage');
const memoryBar = document.getElementById('memoryBar');
const diskUsage = document.getElementById('diskUsage');
const diskBar = document.getElementById('diskBar');

// Backend API URL
const API_URL = 'http://localhost:8000';

// Window control using IPC
const { ipcRenderer } = require('electron');

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

// Voice Command Handling
let isRecording = false;

micButton.addEventListener('click', async () => {
    if (!isRecording) {
        // Start recording
        isRecording = true;
        micButton.classList.add('pulse');
        micButton.style.backgroundColor = '#EF4444'; // Red color
        voiceStatus.textContent = 'Listening...';
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // TODO: Implement actual voice recording and processing
            // For now, just simulate a voice command after 3 seconds
            setTimeout(() => {
                stopRecording();
                addToActivityLog('Voice command received');
                processVoiceCommand('sample audio data');
            }, 3000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            stopRecording();
            voiceStatus.textContent = 'Error accessing microphone';
        }
    } else {
        stopRecording();
    }
});

function stopRecording() {
    isRecording = false;
    micButton.classList.remove('pulse');
    micButton.style.backgroundColor = ''; // Reset to default
    voiceStatus.textContent = 'Click to start voice command';
}

// Command Execution
sendCommand.addEventListener('click', () => {
    const command = commandInput.value.trim();
    if (command) {
        executeCommand(command);
        commandInput.value = '';
    }
});

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const command = commandInput.value.trim();
        if (command) {
            executeCommand(command);
            commandInput.value = '';
        }
    }
});

async function executeCommand(command) {
    addToCommandOutput(`> ${command}`);
    addToActivityLog(`Executed command: ${command}`);

    try {
        const response = await fetch(`${API_URL}/execute-command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ command }),
        });

        const data = await response.json();
        if (data.success) {
            addToCommandOutput(data.output);
        } else {
            addToCommandOutput(`Error: ${data.error}`);
        }
    } catch (error) {
        addToCommandOutput(`Error: ${error.message}`);
    }
}

async function processVoiceCommand(audioData) {
    try {
        const response = await fetch(`${API_URL}/voice-command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ audioData }),
        });

        const data = await response.json();
        if (data.success) {
            addToCommandOutput(`Voice command: ${data.text}`);
        } else {
            addToCommandOutput(`Error processing voice command: ${data.error}`);
        }
    } catch (error) {
        addToCommandOutput(`Error: ${error.message}`);
    }
}

// System Stats Update
async function updateSystemStats() {
    try {
        const response = await fetch(`${API_URL}/system-stats`);
        const data = await response.json();

        if (data.success) {
            const { cpu, memory, disk } = data.stats;

            // Update CPU
            cpuUsage.textContent = `${Math.round(cpu.usage)}%`;
            cpuBar.style.width = `${cpu.usage}%`;

            // Update Memory
            const memUsagePercent = memory.usagePercentage;
            memoryUsage.textContent = `${memUsagePercent}%`;
            memoryBar.style.width = `${memUsagePercent}%`;

            // Update Disk (using first disk if multiple)
            const diskData = disk[0];
            diskUsage.textContent = `${diskData.usagePercentage}%`;
            diskBar.style.width = `${diskData.usagePercentage}%`;
        }
    } catch (error) {
        console.error('Error updating system stats:', error);
    }
}

// Activity Log
function addToActivityLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logItem = document.createElement('div');
    logItem.className = 'flex items-center space-x-2';
    logItem.innerHTML = `
        <span class="text-gray-500">${timestamp}</span>
        <span>${message}</span>
    `;
    activityLog.insertBefore(logItem, activityLog.firstChild);

    // Keep only last 5 items
    while (activityLog.children.length > 5) {
        activityLog.removeChild(activityLog.lastChild);
    }
}

function addToCommandOutput(message) {
    const outputLine = document.createElement('p');
    outputLine.textContent = message;
    commandOutput.appendChild(outputLine);
    commandOutput.scrollTop = commandOutput.scrollHeight;
}

// Initial system stats update and periodic refresh
updateSystemStats();
setInterval(updateSystemStats, 5000); // Update every 5 seconds