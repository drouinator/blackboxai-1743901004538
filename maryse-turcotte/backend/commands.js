import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const ALLOWED_COMMANDS = [
    'ls', 'pwd', 'echo', 'date',
    'ps', 'top', 'df', 'du',
    'cat', 'head', 'tail',
    'grep', 'find', 'curl'
];

export const executeCommand = async (command) => {
    // Basic command validation
    const commandBase = command.split(' ')[0];
    if (!ALLOWED_COMMANDS.includes(commandBase)) {
        throw new Error(`Command '${commandBase}' is not allowed for security reasons`);
    }

    try {
        const { stdout, stderr } = await execAsync(command);
        if (stderr) {
            throw new Error(stderr);
        }
        return stdout;
    } catch (error) {
        throw new Error(`Command execution failed: ${error.message}`);
    }
};