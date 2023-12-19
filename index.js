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
                    args: ['--no-sandbox'],
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
console.log("App is booting up")
const qrcode = require('qrcode-terminal');
const { ClientConstructor } = require('./client_constructor.js');
const { MessageTypes } = require("whatsapp-web.js");
const { checkForLinkInMessage } = require('./message.js');
const client = process.argv.indexOf("headless") !== -1 ?
    ClientConstructor.getHeadlessClient() :
    ClientConstructor.getNormalClient();
client.on('qr', qr => {
    console.log("No saved auth data found. Booting up webservice... ");
    qrcode.generate(qr, { small: true });
});
client.on('ready', () => {
    console.log("Client is ready and listening.");
});
client.on('message_create', async message => {
    if (!message.fromMe) {
        console.log("Ignoring message because it was not be us")
        return;
    }
    const [command, ...params] = message.body.split(' ');
    switch (command) {
        case "!p":
        case "!ping":
            {
                await message.reply("pong");
                await sendWelcome('Deepesh Agarwal', '+919829235735')
                return;
            }
    }
})
async function sendWelcome(name, phoneNumber) {
    const message = `Dear ${name}, Thank you for your stay. Pls. Dial *'110'* for kitchen and *'9'* for Reception, you can also call *8881088844*. To access FREE WiFi service pls. connect to 'Hotel Agroha' with password - agroha123. We strictly prohibit any illegal activity in our premises like Gambling.`;
    const chatId = `${phoneNumber}@c.us`;
    client.sendMessage(chatId, message)
        .then(response => {
            if (response.id.fromMe) {
                console.log(`Message successfully sent to ${name}`);
            }
        })
        .catch(err => {
            console.error(`Failed to send message: ${err}`);
        });
}
client.initialize();