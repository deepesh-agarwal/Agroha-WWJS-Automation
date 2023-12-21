const { Client, LocalAuth } = require('whatsapp-web.js');

class ClientConstructor {
    static getHeadlessClient() {
        console.log("Provided headless argument.")
        return new Client(
            {
                authStrategy: new LocalAuth(
                    {
                        clientId: "self",
                        dataPath: "/data",
                    }
                ),
                puppeteer: {
                    executablePath: '/usr/bin/google-chrome-stable',
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--single-process',
                        '--disable-gpu'
                    ],
                    headless: true,
                    ignoreDefaultArgs: ['--disable-dev-shm-usage'],
                    ignoreHTTPSErrors: true
                }
            }
        );
    }

    static getNormalClient() {
        console.log("Creating normal Client.")
        return new Client(
            {
                authStrategy: new LocalAuth(
                    {
                        clientId: "self"
                    }
                ),
            }
        );
    }
}

module.exports = { ClientConstructor };
