const CRATE_ID = 339;

const MYSTERY_ITEMS = [
    { id: 37, amount: 10, name: 'Life Rune' },
    { id: 1289, amount: 1, name: 'Scythe' },
    { id: 1156, amount: 1, name: 'Bunny Ears' },
    { id: 422, amount: 1, name: 'Pumpkin' },
    { id: 677, amount: 1, name: 'Easter Egg' },
    { id: 575, amount: 1, name: 'Christmas Cracker' },
    { id: 576, amount: 1, name: 'Santa Hat' },
    { id: 577, amount: 1, name: 'Red Party Hat' },
    { id: 578, amount: 1, name: 'Yellow Party Hat' },
    { id: 579, amount: 1, name: 'Blue Party Hat' },
    { id: 580, amount: 1, name: 'Green Party Hat' },
    { id: 581, amount: 1, name: 'Purple Party Hat' },
    { id: 582, amount: 1, name: 'White Party Hat' },
    { id: 828, amount: 1, name: 'Green H\'ween Mask' },
    { id: 831, amount: 1, name: 'Blue H\'ween Mask' },
    { id: 832, amount: 1, name: 'Red H\'ween Mask' },
    { id: 1278, amount: 1, name: 'Disk of Returning' },
    { id: 545, amount: 1, name: 'Half Wine' }
];

async function onGameObjectCommandTwo(player, gameObject) {
    if (gameObject.id !== CRATE_ID) {
        return false;
    }

    // Check if "search" command (usually command 2)
    // Assuming command 2 is search. If not, we might need to check command name.
    // But onGameObjectCommandTwo corresponds to the second menu option.

    player.message('You search the crate...');
    await player.world.sleepTicks(2);

    if (player.attributes.has('mystery_looted')) {
        player.message('You find nothing of interest.');
        return true;
    }

    player.message('@gre@You find a hidden stash of ancient artifacts!');

    let full = false;
    for (const item of MYSTERY_ITEMS) {
        if (player.inventory.full()) {
            player.message('@que@Your inventory is full! Some items were left behind.');
            full = true;
            break;
        }
        player.inventory.add(item.id, item.amount);
    }

    if (!full) {
        player.attributes.set('mystery_looted', true);
        player.message('You stash the items in your inventory.');
    } else {
        player.message('Make space and search again to get the rest.');
    }

    return true;
}

module.exports = { onGameObjectCommandTwo };
