import si from 'systeminformation';

export const getSystemStats = async () => {
    try {
        const [cpu, mem, disk] = await Promise.all([
            si.cpu(),
            si.mem(),
            si.fsSize()
        ]);

        return {
            cpu: {
                model: cpu.manufacturer + ' ' + cpu.brand,
                cores: cpu.cores,
                speed: cpu.speed,
                usage: cpu.speed / cpu.speedMax * 100
            },
            memory: {
                total: Math.round(mem.total / (1024 * 1024 * 1024)), // Convert to GB
                used: Math.round(mem.used / (1024 * 1024 * 1024)),
                free: Math.round(mem.free / (1024 * 1024 * 1024)),
                usagePercentage: Math.round((mem.used / mem.total) * 100)
            },
            disk: disk.map(drive => ({
                fs: drive.fs,
                size: Math.round(drive.size / (1024 * 1024 * 1024)),
                used: Math.round(drive.used / (1024 * 1024 * 1024)),
                available: Math.round(drive.available / (1024 * 1024 * 1024)),
                usagePercentage: Math.round((drive.used / drive.size) * 100)
            }))
        };
    } catch (error) {
        throw new Error(`Failed to get system stats: ${error.message}`);
    }
};