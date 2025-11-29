const https = require('https');

const url = 'https://raw.githubusercontent.com/2003scape/rsc-data/master/config/items.json';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const items = JSON.parse(data);
        const targets = [
            'life rune', 'scythe', 'bunny ears', 'pumpkin', 'easter egg',
            'christmas cracker', 'santa hat', 'party hat', 'mask',
            'disk of returning', 'half wine', 'zamorak', 'purple',
            'curry', 'wire', 'chisel', 'soil', 'present', 'info', 'null'
        ];

        console.log('--- Mystery Item IDs ---');
        items.forEach((item, index) => {
            const name = item.name.toLowerCase();
            if (targets.some(t => name.includes(t))) {
                console.log(`${index}: ${item.name}`);
            }
        });
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
