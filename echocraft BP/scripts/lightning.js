import { world, system } from "@minecraft/server";

// Track players on cooldown
const cooldownSet = new Set();

world.afterEvents.itemUse.subscribe(({ source: player, itemStack: item }) => {
    if (item.typeId !== "echocraft:echo_sword") return;

    // Cancel if player is on cooldown
    if (cooldownSet.has(player.id)) return;

    // Add player to cooldown
    cooldownSet.add(player.id);
    system.runTimeout(() => {
        cooldownSet.delete(player.id);
    }, 100); // 100 ticks = 5 seconds

    // Perform a raycast (line of sight)
    const result = player.getEntitiesFromViewDirection({
        maxDistance: 20,
    })[0];

    if (result && result.entity) {
        const target = result.entity;
        const loc = target.location;
        player.dimension.spawnEntity("minecraft:lightning_bolt", loc);
    }
});