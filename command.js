require("./config.js")
const fs = require("fs")
const fetch = require("node-fetch")
const axios = require("axios")
const { exec } = require("child_process")
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
    getGroupAdmins,
} = require("./lib/library.js")

module.exports = async (sock, m) => {
    try {
        const body = (
            (m.mtype === 'conversation' && m.message.conversation) ||
            (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
            (m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
            (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
            (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
            (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
            (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
        ) ? (
            (m.mtype === 'conversation' && m.message.conversation) ||
            (m.mtype === 'imageMessage' && m.message.imageMessage.caption) ||
            (m.mtype === 'documentMessage' && m.message.documentMessage.caption) ||
            (m.mtype === 'videoMessage' && m.message.videoMessage.caption) ||
            (m.mtype === 'extendedTextMessage' && m.message.extendedTextMessage.text) ||
            (m.mtype === 'buttonsResponseMessage' && m.message.buttonsResponseMessage.selectedButtonId) ||
            (m.mtype === 'templateButtonReplyMessage' && m.message.templateButtonReplyMessage.selectedId)
        ) : '';

        const budy = (typeof m.text === 'string') ? m.text : '';
        const prefixRegex = /^[°zZ#$@*+,.?=''():√%!¢£¥€π¤ΠΦ_&><`™©®Δ^βα~¦|/\\©^]/;
        const prefix = prefixRegex.test(body) ? body.match(prefixRegex)[0] : '.';
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1)
        const text = q = args.join(" ")
        const sender = m.key.fromMe ? (sock.user.id.split(':')[0] + '@s.whatsapp.net' || sock.user.id) : (m.key.participant || m.key.remoteJid)
        const botNumber = await sock.decodeJid(sock.user.id)
        const senderNumber = sender.split('@')[0]
        const pushname = m.pushName || `${senderNumber}`
        const isBot = botNumber.includes(senderNumber)
        const fatkuns = (m.quoted || m)
        const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
        const mime = (quoted.m || quoted).mimetype || ''
        const qmsg = (quoted.m || quoted)
        const isCreator = (m && m.sender && [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)) || false;

        const groupMetadata = m.isGroup ? await sock.groupMetadata(m.chat).catch(e => { }) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''
        const participants = m.isGroup ? await groupMetadata.participants : ''
        const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
        const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
        const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
        const groupOwner = m.isGroup ? groupMetadata.owner : ''
        const isGroupOwner = m.isGroup ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender) : false

        if (isCmd) console.log("~> [CMD]", command, "from", pushname, "in", m.isGroup ? "Group Chat" : "Private Chat", '[' + args.length + ']');

        //FUNCTION
       async function randomUA() {
            const UAs = [
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.1 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.3 WOW64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_5) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.4",
                "Mozilla/5.0 (Windows NT 10.0 WOW64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.1 WOW64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Windows NT 6.3 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (X11 Ubuntu Linux x86_64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.1 WOW64 Trident/7.0 rv:11.0) like Gecko",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10.12 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0 WOW64 Trident/7.0 rv:11.0) like Gecko",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.1 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10.11 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.1 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_11_6) AppleWebKit/603.2.5 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.5",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/58.0.3029.110 Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0 WOW64 rv:54.0) Gecko/20100101 Firefox/54.0",
                "Mozilla/5.0 (Windows NT 6.1 Trident/7.0 rv:11.0) like Gecko",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
                "Mozilla/5.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (X11 Linux x86_64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 OPR/45.0.2552.888",
                "Mozilla/5.0 (Windows NT 6.1 Win64 x64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (X11 Linux x86_64 rv:45.0) Gecko/20100101 Firefox/45.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_10_5) AppleWebKit/603.2.5 (KHTML, like Gecko) Version/10.1.1 Safari/603.2.5",
                "Mozilla/5.0 (Windows NT 10.0 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.3 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
                "Mozilla/5.0 (iPad CPU OS 10_3_2 like Mac OS X) AppleWebKit/603.2.4 (KHTML, like Gecko) Version/10.0 Mobile/14F89 Safari/602.1",
                "Mozilla/5.0 (Windows NT 6.1 WOW64 rv:52.0) Gecko/20100101 Firefox/52.0",
                "Mozilla/5.0 (Windows NT 6.1 WOW64 rv:54.0) Gecko/20100101 Firefox/54.0",
                "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
                "Mozilla/5.0 (X11 Ubuntu Linux x86_64 rv:54.0) Gecko/20100101 Firefox/54.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_3) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36 OPR/45.0.2552.812",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 5.1 rv:52.0) Gecko/20100101 Firefox/52.0",
                "Mozilla/5.0 (X11 Linux x86_64 rv:52.0) Gecko/20100101 Firefox/52.0",
                "Mozilla/5.0 (Windows NT 6.1 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10.12 rv:54.0) Gecko/20100101 Firefox/54.0",
                "Mozilla/5.0 (Windows NT 6.1 WOW64 rv:40.0) Gecko/20100101 Firefox/40.1",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10.10 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
                "Mozilla/5.0 (compatible MSIE 9.0 Windows NT 6.0 Trident/5.0 Trident/5.0)",
                "Mozilla/5.0 (Windows NT 6.1 WOW64 rv:45.0) Gecko/20100101 Firefox/45.0",
                "Mozilla/5.0 (compatible MSIE 9.0 Windows NT 6.1 Trident/5.0 Trident/5.0)",
                "Mozilla/5.0 (Windows NT 6.1 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0 Win64 x64 rv:54.0) Gecko/20100101 Firefox/54.0",
                "Mozilla/5.0 (iPad CPU OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
                "Mozilla/5.0 (Windows NT 10.0 WOW64 rv:52.0) Gecko/20100101 Firefox/52.0",
                "Mozilla/5.0 (Windows NT 6.1 WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
                "Mozilla/5.0 (X11 Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36",
                "Mozilla/5.0 (X11 Fedora Linux x86_64 rv:53.0) Gecko/20100101 Firefox/53.0",
                "Mozilla/5.0 (Macintosh Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7",
                "Mozilla/5.0 (Windows NT 10.0 WOW64 Trident/7.0 Touch rv:11.0) like Gecko",
                "Mozilla/5.0 (Windows NT 6.2 Win64 x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                "Mozilla/5.0 (Windows NT 6.3 WOW64 Trident/7.0 rv:11.0) like Gecko"
            ]
        
            return UAs[Math.floor(Math.random() * UAs.length)]
        }

        async function fetchJson(url, options = {}) {
            let { data } = await axios(url, {
                headers: {
                    Accept: "application/json, text/plain, */*",
                    Priority: "u=0, i",
                    "User-Agent": randomUA(),
                    "family": 4,
                    ...(options.headers ? options.headers : {})
                },
                responseType: "json",
                timeout: 60 * 1000 * 15, // timeout 15 minutes
                ...(options && delete options.headers && options)
            })
        
            return data
        }

        async function luminai(content) {
            try {
                const response = await axios.post('https://luminai.my.id/', { content });
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }

        //BATASSSS
        switch (command) {
            //NSFW MENU
            case "waifu": case "neko": case "trap": case "blowjob":
                const rawr = await fetchJson(`https://api.waifu.pics/nsfw/${command}`)
                sock.sendFile(m.chat, rawr.url, null, `NSFW *${command}*`)
                break
            //AI MENU
            case 'openai': 
            if (!text) return m.reply(`${prefix + command} query`)
                const jsons = await fetchJson(`https://aemt.uk.to/openai?text=${text}`)
            m.reply(jsons.result)
            break
            case "gemini": 
            if (!text) return m.reply(`${command + prefix} query`)
            const genAI = new GoogleGenerativeAI("AIzaSyDlTNuMSwA3POZGJDvvTOhumoJ1N8wnBqI");
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(text);
            m.reply(result.response.text())
            break
            case 'luminai': 
            if (!text) return m.reply(`${prefix + command} query`)
                const manok = await luminai(text)
            m.reply(manok.result)
            break
            case 'menu':
                const menunya = `Hello ${pushname}!

*AI MENU*
${prefix}openai
${prefix}gemini
${prefix}luminai

*NSFW MENU*
${prefix}waifu
${prefix}neko
${prefix}trap
${prefix}blowjob

*DOWNLOADER*
${prefix}tiktok `
                m.reply(menunya)
                break;
                case 'tiktok': 
                if (!text) return m.reply(`${prefix + command} link tiktok`)
                    const res = await fetch(`https://tikwm.com/api?url=${text}`)
                const jsonn = await res.json()
                sock.sendFile(m.chat, jsonn.data.play, null, "*DONE*")
                break
            default:
                if (budy.startsWith('=>')) {
                    if (!isCreator) return
                    function Return(sul) {
                        sat = JSON.stringify(sul, null, 2)
                        bang = require('util').format(sat)
                        if (sat == undefined) {
                            bang = require('util').format(sul)
                        }
                        return m.reply(bang)
                    }
                    try {
                        m.reply(require('util').format(eval(`(async () => { return ${budy.slice(3)} })()`)))
                    } catch (e) {
                        m.reply(String(e))
                    }
                }

                if (budy.startsWith('>')) {
                    if (!isCreator) return
                    let kode = budy.trim().split(/ +/)[1]
                    let teks
                    try {
                        teks = /await/i.test(kode) ? eval("(async() => { " + kode + " })()") : eval(kode)
                    } catch (e) {
                        teks = e
                    } finally {
                        await m.reply(require('util').format(teks))
                    }
                }

                if (budy.startsWith('$')) {
                    if (!isCreator) return
                    exec(budy.slice(2), (err, stdout) => {
                        if (err) return m.reply(`${err}`)
                        if (stdout) return m.reply(stdout)
                    })
                }
                break;
                break;
        }
    } catch (err) {
        console.log(require('util').format(err));
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(`Update ${__filename}`);
    delete require.cache[file];
    require(file);
});
