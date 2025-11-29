// https://classic.runescape.wiki/w/Mining

const items = require('@2003scape/rsc-data/config/items');
const { rocks, pickaxes } = require('@2003scape/rsc-data/skills/mining');
const { rollSkillSuccess } = require('../../rolls');

const ROCK_IDS = new Set(Object.keys(rocks).map(Number));

// in order of best to worst
const PICKAXE_IDS = Object.keys(pickaxes)
    .map(Number)
    .sort((a, b) => {
        if (pickaxes[a] === pickaxes[b]) {
            return 0;
        }

        return pickaxes[a] > pickaxes[b] ? -1 : 1;
    });

function getDefinition(id) {
    const rock = rocks[id];

    if (typeof rock.reference !== 'undefined') {
        return getDefinition(rock.reference);
    }

    return rock;
}

async function onGameObjectCommand(player, gameObject, command) {
    const rockID = gameObject.id;

    if (!ROCK_IDS.has(rockID)) {
        return false;
    }

    if (command === 'prospect') {
        const rock = getDefinition(rockID);
        player.message(`@que@You examine the rock for ores...`);
        await player.world.sleepTicks(2);
        player.message(`@que@This rock contains ${items[rock.ore].name.toLowerCase()}.`);
        return true;
    }

    if (command !== 'mine') {
        return false;
    }

    const rock = getDefinition(rockID);
    const miningLevel = player.skills.mining.current;

    if (rock.level > miningLevel) {
        player.message(
            `You need a mining level of ${rock.level} to mine this rock`
        );
        return true;
    }

    let bestPickaxeID = -1;

    // Pickaxe level requirements (Source: RSC Wiki)
    const PICKAXE_LEVELS = {
        1262: 41, // Rune
        1261: 31, // Adamant
        1260: 21, // Mithril
        1259: 6,  // Steel
        1258: 1,  // Iron
        156: 1    // Bronze
    };

    for (const pickaxeID of PICKAXE_IDS) {
        if (player.inventory.has(pickaxeID)) {
            const requiredLevel = PICKAXE_LEVELS[pickaxeID] || 1;
            if (miningLevel >= requiredLevel) {
                bestPickaxeID = pickaxeID;
                break;
            }
        }
    }

    if (bestPickaxeID === -1) {
        player.message('@que@You need a pickaxe to mine this rock');
        player.message('@que@(You do not have a pickaxe you have the level to use)');
        return true;
    }

    if (player.isTired()) {
        player.message('@que@You are too tired to mine the rock');
        return true;
    }

    const { world } = player;
    const { x, y } = gameObject;
    const pickaxeName = items[bestPickaxeID].name.toLowerCase();

    player.message(`@que@You swing your ${pickaxeName} at the rock...`);
    player.sendBubble(bestPickaxeID);
    player.sendSound('mine');

    await world.sleepTicks(3);

    const mineSuccess = rollSkillSuccess(
        rock.roll[0] * pickaxes[bestPickaxeID],
        rock.roll[1] * pickaxes[bestPickaxeID],
        miningLevel
    );

    if (world.gameObjects.getAtPoint(x, y)[0] === gameObject && mineSuccess) {
        const shouldDeplete = true; // Rocks always deplete in RSC? Or chance? usually yes.

        if (shouldDeplete) {
            const emptyRock = world.replaceEntity(
                'gameObjects',
                gameObject,
                rock.empty
            );

            world.setTimeout(() => {
                world.replaceEntity('gameObjects', emptyRock, rockID);
            }, rock.respawn);
        }

        player.addExperience('mining', rock.experience);
        player.message('@que@You manage to obtain some ' + rockName);
        player.inventory.add(rock.ore);

        // Gem drop logic (1/256 chance)
        // Uncut Sapphire (162), Emerald (161), Ruby (163), Diamond (164)
        if (Math.random() <= 1 / 256) {
            const gems = [162, 161, 163, 164];
            const gemID = gems[Math.floor(Math.random() * gems.length)];
            player.inventory.add(gemID);
            player.message('@que@You found a gem!');
        }
    } else {
        player.message('@que@You only succeed in scratching the rock');
    }

    return true;
}

async function onGameObjectCommandOne(player, gameObject) {
    if (!/mine/i.test(gameObject.definition.commands[0])) {
        return false;
    }

    await onGameObjectCommand(player, gameObject, 'mine');
}

async function onGameObjectCommandTwo(player, gameObject) {
    if (/prospect/i.test(gameObject.definition.commands[1])) {
        await onGameObjectCommand(player, gameObject, 'prospect');
    } else if (/mine/i.test(gameObject.definition.commands[1])) {
        await onGameObjectCommand(player, gameObject, 'mine');
    } else {
        return false;
    }
}

module.exports = { onGameObjectCommandOne, onGameObjectCommandTwo };
