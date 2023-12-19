console.log("App is booting up")

const express = require('express');
const app = express();
const qrcode = require('qrcode-terminal');
const { ClientConstructor } = require('./client_constructor.js');
const { MessageTypes } = require("whatsapp-web.js");
const { checkForLinkInMessage } = require('./message.js');

const client = ClientConstructor.getHeadlessClient();


// Express server for handling '/sendWelcome' path
app.get('/sendWelcome', (req, res) => {
    const { name, phoneNumber } = req.query;
    
    if (name && phoneNumber) {
        sendWelcome(name, phoneNumber)
            .then(() => {
                res.send(`Welcome message sent to ${name}`);
            })
            .catch(err => {
                res.status(500).send(`Error sending message: ${err}`);
            });
    } else {
        res.status(400).send('Missing name or phoneNumber query parameters');
    }
});

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

// Choose the port you want to listen on
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


client.initialize();
