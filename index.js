console.log("App is booting up")

const express = require('express');
const app = express();
const qrcode = require('qrcode-terminal');
const { ClientConstructor } = require('./client_constructor.js');
const { MessageTypes, MessageMedia } = require("whatsapp-web.js");
const { checkForLinkInMessage } = require('./message.js');

const client = ClientConstructor.getHeadlessClient();

client.on('qr', qr => {
    console.log("No saved auth data found. Booting up webservice... ");
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("Client is ready and listening.");
    app.listen(3000, () => console.log('Server running on port 3000'));
});

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

// Express server path
app.get('/sendBonfire', (req, res) => {

    const { name, phoneNumber } = req.query;
    
    if (name && phoneNumber) {
        sendBonfire(name, phoneNumber,'https://www.mosquitomagnet.com/media/Articles/Mosquito-Magnet/Dont-Fear-the-Fire.jpg');
        res.send(`Bonfire message sent to ${name}`);
    } else {
        res.status(400).send('Missing name or phoneNumber query parameters');
    }
    
});

async function sendBonfire(name, phoneNumber,imageUrl) {
    
        try {
        // Create a MessageMedia instance from the URL
        //const media = await MessageMedia.fromUrl(imageUrl);
            const media = await MessageMedia.fromFilePath('./img/bonfire.mov');
            
        // Send the video to the specified number
        client.sendMessage(`${phoneNumber}@c.us`, media, { caption: `Hello ${name} ji, dont forget to ask for Bonfire at dinner for an unforgettable experience.` });    
    } catch (error) {
        console.error('Error sending video:', error);
    }
 
}

async function sendWelcome(name, phoneNumber) {
    const message = `Dear ${name}, Thank you for your stay. Pls. Dial *'110'* for kitchen and *'9'* for Reception, you can also call *8881088844*. To access FREE WiFi service pls. connect to *Hotel Agroha* with password - *agroha123*. We strictly prohibit any illegal activity in our premises like Gambling.`;
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

