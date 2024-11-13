const { default: makeWASocket, delay, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, PHONENUMBER_MCC, useMultiFileAuthState, BaileysEventEmitter, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const NodeCache = require("node-cache");
const readline = require("readline");
const fs = require("fs");

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});

const logger = MAIN_LOGGER.child({});
logger.level = "silent";

// Initialize store if enabled
const useStore = false; // Change it to true if needed
const store = useStore ? makeInMemoryStore({ logger }) : undefined;
store?.readFromFile(`store.json`);

setInterval(() => {
    store?.writeToFile("store.json");
}, 60000 * 60);

// Cache for message retry counter
const msgRetryCounterCache = new NodeCache();

// Readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const question = text => new Promise(resolve => rl.question(text, resolve));

// Pino silent logger
const P = require("pino")({
    level: "silent",
});

// Function to start the process
async function start() {
    try {
	let browserlist = ['Chrome', 'Firefox', 'Edge'];
	let browsernya = pickRandom(browserlist);
        let { state, saveCreds } = await useMultiFileAuthState("session");
        let { version, isLatest } = await fetchLatestBaileysVersion();

        // Create WhatsApp socket
        const sock = makeWASocket({
            logger: P,
            printQRInTerminal: true,
            browser: ['Ubuntu', browsernya, '24.0.3'],
            version: [2, 3000, 1015945155],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, P),
            },
            msgRetryCounterCache,
        });

        store?.bind(sock.ev);
        sock.ev.on("creds.update", saveCreds);

        if (!sock.authState.creds.registered) {
            const phoneNumber = await question("Enter your number\nExample: 6281190807060\n")
            const code = await sock.requestPairingCode(phoneNumber);
            console.log('YOUR PAIRING CODE');
            console.log(code)
        }

        // Logic to upsert message from WhatsApp
        sock.ev.on("connection.update", async ({ lastDisconnect, connection }) => {
            try {
                if (connection == 'close') {
                    if (new Boom(lastDisconnect.error).output?.statusCode === DisconnectReason.loggedOut) start();
                    else start();
                } else if (connection == 'open') {
                    console.log(`Connected to ${sock.user.id}\nSending session..`);
                    await delay(1000 * 2);
                    await sock.sendMessage(sock.user.id, {
                        document: {
                            url: `./sock/creds.json`
                        },
                        fileName: 'creds.json',
                        mimetype: 'application/json'
                    });
                    fs.unlinkSync(`./sock/creds.json`);
                    await delay(1000 * 2);
                    console.log('Closing connection..');
                    process.exit(0);
                    console.log('Done!');
                }
            } catch (e) {
                console.log(e);
            }
        });

        sock.ev.on('creds.update', saveCreds);
    } catch (e) {
        console.log(e);
    }
}

start();

function pickRandom(list) {
    return list[Math.floor(list.length * Math.random())]
}
