const items = require('@2003scape/rsc-data/config/items');
const itemKeys = Object.keys(items);
console.log(`Total Items: ${itemKeys.length}`);
console.log(`First 5 IDs: ${itemKeys.slice(0, 5).join(', ')}`);
console.log(`Last 5 IDs: ${itemKeys.slice(-5).join(', ')}`);

// Check specific known items
const check = [10, 1262, 1263]; // Coins, Rune Pickaxe, Sleeping Bag (if 1263 is it)
check.forEach(id => {
    if (items[id]) {
        console.log(`Item ${id}: ${items[id].name}`);
    } else {
        console.log(`Item ${id}: NOT FOUND`);
    }
});
