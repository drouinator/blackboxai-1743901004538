import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { executeCommand } from './commands.js';
import { getSystemStats } from './systemStats.js';
import { processVoiceCommand } from './voice.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/execute-command', async (req, res) => {
    try {
        const { command } = req.body;
        const result = await executeCommand(command);
        res.json({ success: true, output: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/system-stats', async (req, res) => {
    try {
        const stats = await getSystemStats();
        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/voice-command', async (req, res) => {
    try {
        const { audioData } = req.body;
        const result = await processVoiceCommand(audioData);
        res.json({ success: true, text: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Maryse Turcotte backend running on port ${PORT}`);
});