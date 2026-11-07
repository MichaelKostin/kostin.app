// Run with Node.js and Playwright installed: node scripts/render-social-card.cjs
// Renders a deterministic HTML/CSS layout using the existing, unmodified app icons.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const icon = name => 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'img', name)).toString('base64');
(async () => {
  const browser = await chromium.launch({headless: true, ...(process.env.BROWSER_CHANNEL ? {channel: process.env.BROWSER_CHANNEL} : {})});
  try {
    const page = await browser.newPage({viewport: {width: 1200, height: 630}, deviceScaleFactor: 1});
    await page.setContent(`<!doctype html><html lang="en"><meta charset="utf-8"><title>Kostin Apps sharing card</title><style>
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;padding:46px 60px;background:radial-gradient(circle at 90% 5%,#ded7ff,transparent 40%),radial-gradient(circle at 0% 100%,#ffedb2,transparent 50%),#f8f5ed;color:#202018;font-family:Arial,sans-serif}
      header{display:flex;align-items:center;gap:13px;font-size:23px;font-weight:bold}.mark{display:grid;place-items:center;width:43px;height:43px;border-radius:13px;background:#202018;color:white;font-size:28px}
      h1{font-size:51px;letter-spacing:-2px;line-height:1.07;margin:27px 0 12px} .intro{font-size:23px;color:#5d594d;margin:0}
      .apps{display:flex;gap:24px;margin-top:30px}.app{display:flex;align-items:center;gap:22px;width:528px;padding:24px;border:1px solid #ffffff;border-radius:28px;background:#ffffffb3}.app img{width:130px;height:130px;border-radius:28px}.app h2{font-size:29px;letter-spacing:-.8px;margin:0 0 10px}.app p{font-size:18px;line-height:1.4;color:#5d594d;margin:0}.bottom{display:flex;justify-content:space-between;margin-top:29px;font-size:19px;color:#5d594d}.url{font-weight:bold;color:#202018}
    </style><body><header><span class="mark">K</span>Kostin Apps</header><h1>Little discoveries. Big curiosity.</h1><p class="intro">Picture puzzles and animal sounds for young children.</p><div class="apps"><section class="app"><img src="${icon('puzzle-garden-icon.png')}" alt="Puzzle Garden icon"><div><h2>Puzzle Garden</h2><p>Little worlds,<br>piece by piece.</p></div></section><section class="app"><img src="${icon('animal-sounds-icon.png')}" alt="Animal Sounds icon"><div><h2>Animal Sounds</h2><p>Listen, guess,<br>and explore together.</p></div></section></div><div class="bottom"><span>For iPhone, iPad &amp; Android</span><span class="url">kostin.app</span></div></body></html>`);
    await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
    await page.screenshot({path: path.join(root, 'img/kostin-apps-social.png')});
  } finally { await browser.close(); }
})();
