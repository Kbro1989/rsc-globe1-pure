const items = require('@2003scape/rsc-data/config/items');
const thieving = require('@2003scape/rsc-data/skills/thieving');
const { rollSkillSuccess } = require('../../rolls');

const PICKPOCKET_NPC_IDS = new Set(Object.keys(thieving.pickpocket).map(Number));
const STALL_IDS = new Set(Object.keys(thieving.stalls).map(Number));
const CHEST_IDS = new Set(Object.keys(thieving.chests || {}).map(Number)); // Handle if chests missing

function getDefinition(type, id) {
    const def = thieving[type][id];
    if (def && typeof def.reference !== 'undefined') {
        return getDefinition(type, def.reference);
    }
    return def;
}

function getLoot(def) {
    if (!def.items || def.items.length === 0) return null;

    // Calculate total weight
    let totalWeight = 0;
    for (const item of def.items) {
        totalWeight += item.weight || 1; // Default weight 1 if not specified
    }

    let random = Math.random() * totalWeight;
    for (const item of def.items) {
        const weight = item.weight || 1;
        if (random < weight) {
            return { id: item.id, amount: item.amount || 1 };
        }
        random -= weight;
    }
    return { id: def.items[0].id, amount: def.items[0].amount || 1 };
}

async function onNPCCommand(player, npc, command) {
    if (command !== 'pickpocket' || !PICKPOCKET_NPC_IDS.has(npc.id)) {
        return false;
    }

    const def = getDefinition('pickpocket', npc.id);
    const thievingLevel = player.skills.thieving.current;

    if (def.level > thievingLevel) {
        player.message(`You need a thieving level of ${def.level} to pick the ${npc.definition.name}'s pocket`);
        return true;
    }

    player.message(`@que@You attempt to pick the ${npc.definition.name}'s pocket...`);
    await player.world.sleepTicks(2);

    // Roll for success
    // Use rollSkillSuccess if roll is defined, otherwise default chance
    let success = false;
    if (def.roll) {
        success = rollSkillSuccess(def.roll[0], def.roll[1], thievingLevel);
    } else {
        // Fallback if no roll defined (shouldn't happen with valid data)
        success = Math.random() > 0.5;
    }

    if (success) {
        player.message(`@que@You pick the ${npc.definition.name}'s pocket`);
        const loot = getLoot(def);
        if (loot) {
            player.inventory.add(loot.id, loot.amount);
        }
        player.addExperience('thieving', def.experience);
    } else {
        player.message(`@que@You fail to pick the ${npc.definition.name}'s pocket`);
        if (def.exclaimation) {
            npc.chat(def.exclaimation);
        }
        // Stun player / Damage
        player.damage(Math.floor(Math.random() * 3) + 1); // 1-3 damage typical
        player.message('@que@You have been stunned!');
        // TODO: Apply actual stun state if server supports it
        // npc.startCombat(player); // Optional: NPC attacks
    }

    return true;
}

async function onGameObjectCommand(player, gameObject, command) {
    // Handle Stalls
    if (STALL_IDS.has(gameObject.id) && (command === 'steal-from' || command === 'steal from')) {
        const def = getDefinition('stalls', gameObject.id);
        const thievingLevel = player.skills.thieving.current;

        if (def.level > thievingLevel) {
            player.message(`You need a thieving level of ${def.level} to steal from this stall`);
            return true;
        }

        player.message('@que@You attempt to steal from the stall...');
        await player.world.sleepTicks(2);

        // Stalls usually succeed if guard doesn't see, but for now assume success check
        // Or just succeed if no guard check implemented
        // Let's use a simple success check based on level vs req
        const success = true; // Simplified for now

        if (success) {
            player.message('@que@You steal from the stall');
            const loot = getLoot(def);
            if (loot) {
                player.inventory.add(loot.id, loot.amount);
            }
            player.addExperience('thieving', def.experience);

            // Deplete stall
            if (def.emptyID) { // Assuming 'emptyID' or similar exists in data, or use a default empty stall ID
                // Need to check data for empty stall ID. 
                // If not in data, maybe don't replace.
                // But authentic RSC stalls go empty.
                // Let's assume we can replace if we knew the ID. 
                // For now, skip visual depletion if ID unknown.
            }
        }
        return true;
    }

    // Handle Chests (TODO: Implement if chest data available)

    return false;
}

async function onGameObjectCommandOne(player, gameObject) {
    return onGameObjectCommand(player, gameObject, gameObject.definition.commands[0].toLowerCase());
}

async function onGameObjectCommandTwo(player, gameObject) {
    return onGameObjectCommand(player, gameObject, gameObject.definition.commands[1].toLowerCase());
}

module.exports = { onNPCCommand, onGameObjectCommandOne, onGameObjectCommandTwo };
