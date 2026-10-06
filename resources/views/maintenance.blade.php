<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>Chhondo — Under Maintenance</title>
  <link rel="icon" type="image/svg+xml" href="/assets/chhondo/logo-mark-dark.svg">
  <style>
    :root {
      --green: #4a7a1e;
      --green-soft: #eef4e6;
      --text: #2b3326;
      --muted: #6b7564;
      --bg: #fafcf7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: radial-gradient(circle at top, var(--green-soft), var(--bg) 60%);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      text-align: center;
    }
    main { max-width: 560px; width: 100%; }
    .logo { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 40px; }
    .logo-mark { width: 120px; height: auto; }
    .logo-word { width: 144px; height: auto; }
    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: var(--green-soft); color: var(--green);
      border: 1px solid rgba(74, 122, 30, .25);
      padding: 6px 14px; border-radius: 999px;
      font-size: 13px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
      margin-bottom: 20px;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
    h1 { font-size: clamp(26px, 5vw, 36px); line-height: 1.25; margin-bottom: 14px; }
    p { color: var(--muted); font-size: 16px; line-height: 1.7; }
    .divider { width: 60px; height: 3px; background: var(--green); border-radius: 2px; margin: 32px auto; opacity: .6; }
    footer { font-size: 13px; color: var(--muted); }
  </style>
</head>
<body>
  <main>
    <div class="logo" aria-label="Chhondo">
      <img class="logo-mark" src="/assets/chhondo/logo-mark-dark.svg" alt="">
      <img class="logo-word" src="/assets/chhondo/logo-word-dark.svg" alt="Chhondo">
    </div>
    <div class="badge"><span class="dot"></span>Under Maintenance</div>
    <h1>We'll be back shortly</h1>
    <p>Chhondo is currently undergoing scheduled maintenance to improve your shopping experience. Thank you for your patience — please check back soon.</p>
    <div class="divider"></div>
    <footer>&copy; {{ date('Y') }} Chhondo. All rights reserved.</footer>
  </main>
</body>
</html>
