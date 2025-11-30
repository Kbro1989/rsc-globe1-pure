$html = Get-Content 'public\index.html' -Raw

# Fix 1: Change import to script loading
$html = $html -replace 'const \{ default: mudclient \} = await import\(''\.\/rsc-client\/index\.bundle\.min\.js''\);', @'
// Load as UMD script
                const script = document.createElement('script');
                script.src = './rsc-client/index.bundle.min.js';
                script.onload = async () => {
                    const canvas = document.getElementById('mudclient-canvas');
                    const mc = new mudclient(canvas);
                    
                    mc.server = serverWorker;
                    mc.members = true;
                    mc.threadSleep = 10;
                    await mc.startApplication(512, 346, 'RuneScape Classic by Andrew Gower');
                    document.getElementById('loading').classList.add('hidden');
                    setupMobileKeyboard();
                    setupAutoSave(mc);
                    window.mudclient = mc;
                    console.log('✅ RSC Client loaded | ✅ Server Connected | ✅ KV Persistence | ✅ Auto-Save');
                };
                script.onerror = () => alert('Failed to load client');
                document.head.appendChild(script);
                return; // Exit early since script.onload continues
'@

# Fix 2: Remove lines after script loading that would execute before script loads
$html = $html -replace 'const canvas = document\.getElementById\(''mudclient-canvas''\);\r\n                const mc = new mudclient\(canvas\);[^}]+console\.log', '// Moved to script.onload above'

# Fix 3: Add GDPR banner before </body>
$gdpr = @'
    <div id="gdpr-banner" style="position:fixed;bottom:0;left:0;right:0;background:#1a1a1a;border-top:2px solid#ffcc00;padding:15px;z-index:9999;display:none;">
        <p style="margin:0 0 10px;font-size:14px;">🍪 We use Cloudflare KV to store your game progress. By playing, you consent to this storage. <a href="#" style="color:#ffcc00;">Privacy Policy</a></p>
        <button onclick="document.getElementById('gdpr-banner').style.display='none';localStorage.setItem('gdpr-accepted','1');" style="background:#ffcc00;color:#000;border:none;padding:8px 20px;cursor:pointer;border-radius:4px;">Accept</button>
    </div>
    <script>
        if (!localStorage.getItem('gdpr-accepted')) {
            document.getElementById('gdpr-banner').style.display = 'block';
        }
    </script>
'@

$html = $html -replace '</body>', "$gdpr`n</body>"

$html | Set-Content 'public\index.html'
Write-Host "✅ HTML fixed"
