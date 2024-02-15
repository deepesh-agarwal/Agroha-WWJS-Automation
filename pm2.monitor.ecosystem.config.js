module.exports = {
    apps: [{
        name: 'WWJS',
        script: 'index.js', // Path to your app's main file
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
        },
        env_production: {
            NODE_ENV: 'production',
        },
        health_check: {
            path: 'http://localhost:3000/health', // URL to ping
            interval: 1200000, // 20 minute
            timeout: 6000, // 1 second
            retries: 3, // Number of failed attempts to restart
        }
    }]
};