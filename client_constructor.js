const { Client, LocalAuth } = require('whatsapp-web.js');



const wwebVersion = '2.3000.0';


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
                    args: ['--no-sandbox',
                        '--no-experiments',
                        '--hide-scrollbars',
                        '--disable-plugins',
                        '--disable-infobars',
                        '--disable-translate',
                        '--disable-pepper-3d',
                        '--disable-extensions',
                        '--disable-dev-shm-usage',
                        '--disable-notifications',
                        '--disable-setuid-sandbox',
                        '--disable-crash-reporter',
                        '--disable-smooth-scrolling',
                        '--disable-login-animations',
                        '--disable-dinosaur-easter-egg',
                        '--disable-accelerated-2d-canvas',
                        '--disable-rtc-smoothness-algorithm'
                    ],
                    headless: true,
                    ignoreDefaultArgs: ['--disable-dev-shm-usage'],
                    ignoreHTTPSErrors: true
                },
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
