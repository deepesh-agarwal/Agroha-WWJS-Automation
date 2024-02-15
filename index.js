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

// PM2 Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'healthy' });
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
        sendBonfire(name, phoneNumber);
        res.send(`Bonfire message sent to ${name}`);
    } else {
        res.status(400).send('Missing name or phoneNumber query parameters');
    }

});

app.get('/sendImages', (req, res) => {

    const { name, phoneNumber } = req.query;

    if (name && phoneNumber) {
        sendImagesAll(name, phoneNumber);
        res.send(`All Images message sent to ${name}`);
    } else {
        res.status(400).send('Missing name or phoneNumber query parameters');
    }

});

async function sendImagesAll(name, phoneNumber) {
    // Define the file paths array
    const filePaths = [
        './img/02a23617-89c7-4202-8b13-f04b60449e6b 2.JPG',
        './img/1f513b51-975a-4a60-913b-c2a6faf9ff5b 2.JPG',
        './img/2466cc7e-4eb1-47b4-b1fd-1076ed9965ef.JPG',
        './img/28977b47-4975-4f84-9511-e93fdaebe737.JPG',
        './img/2d9383eb-3778-4c74-be53-0618aec82b08 2.JPG',
        './img/3ae817f7-aaae-42af-9240-6338cc30b168 2.JPG',
        './img/6569d69b-c882-489b-b7f7-ce724bea0eb4.JPG',
        './img/68a54214-1fa9-423e-8036-b30007c28e34 2.JPG',
        './img/6a0798b6-79b9-49e3-9ed0-ddeb810a699e 2.JPG',
        './img/6fa3c612-6fd0-4332-a0fe-b510bb953b14 2.JPG',
        './img/849a538d-c237-4623-b7e7-956919763721.JPG',
        './img/84b37985-5f60-4fa0-8008-c530772f844b.JPG',
        './img/8a733a1b-1c92-41fe-b156-39ddc2b3c441 2.JPG',
        './img/91d1f29e-49eb-4085-b387-cdf610c30aa7 2.JPG',
        './img/a16c8eec-8bc7-467c-89b9-d306c3db1765 2.JPG',
        './img/a64fae5f-f1c2-4971-a5f5-ff3de8a59d6e 2.JPG',
        './img/aebf3854-e12c-4613-a53a-88601713c8cd 2.JPG',
        './img/b4467330-02a3-48fa-81a5-31137ac1851e 2.JPG',
        './img/b798d033-ecd6-466a-9805-cc07be9f6e62 2.JPG',
        './img/c6897eeb-2bbf-4306-84a9-90d50c50a34a 2.JPG',
        './img/cb953b06-7767-44e3-bdf3-cc0050afb469 2.JPG',
        './img/d599feb1-04f2-488d-bc97-bc781f5d65f9 2.JPG',
        './img/e65192ba-3fac-4897-b3ac-883b58f71b42 2.JPG',
        './img/e82e5715-05aa-4962-aa89-a38b653e30c6 2.JPG',
        './img/ee46e8ad-e7cc-45f9-be38-12aaada1d9bc.JPG',
        './img/f823b2d4-edea-4d67-bec6-6afb76310e33 2.JPG',
        './img/fb9251ee-4906-415a-8ac1-3367c7804bb2 2.JPG'
    ];


    try {
        for (const filePath of filePaths) {
            // Create a MessageMedia instance from the file path
            const media = await MessageMedia.fromFilePath(filePath);

            // Send the media to the specified number
            await client.sendMessage(`${phoneNumber}@c.us`, media);
        }
    } catch (error) {
        console.error('Error sending media:', error);
    }

    try {
        const media_101 = await MessageMedia.fromFilePath('./img/101.MP4');
        const media_103 = await MessageMedia.fromFilePath('./img/103.MP4');
        const media_bonfire = await MessageMedia.fromFilePath('./img/bonfire.mp4');

        // Send videos with caption
        client.sendMessage(`${phoneNumber}@c.us`, media_101, { caption: `Room 101 - Family Suite Deluxe` });
        client.sendMessage(`${phoneNumber}@c.us`, media_103, { caption: `Room 103 - Family Suite Super Deluxe` });
        client.sendMessage(`${phoneNumber}@c.us`, media_bonfire, { caption: `Experience Dinner with bonfire.` });

    } catch (error) {
        console.error('Error sending videos:', error);
    }

}

async function sendBonfire(name, phoneNumber) {

    try {
        // Create a MessageMedia instance from the URL
        //const media = await MessageMedia.fromUrl(imageUrl);
        const media = await MessageMedia.fromFilePath('./img/bonfire.mp4');

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

    //Send Bonfire Msg
    sendBonfire(name, phoneNumber);
}

client.initialize();

