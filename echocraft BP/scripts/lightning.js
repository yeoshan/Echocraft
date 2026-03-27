import { world, system } from "@minecraft/server";

const cooldownSet = new Set();

world.afterEvents.itemuse.subscribe(({ source: player, itemStack: item }) => {
    if (item.typeId !== "echocraft:echo_sword") return;

    if (cooldownSet.has(player.id)) return;

    cooldownSet.add(player.id);
    system.runTimeout(() => {
        cooldownSet.delete(player.id);
    }, 100); // 5 seconds

    const result = player.getEntitiesFromViewDirection({
        maxDistance: 20,
    })[0];

    if (result && result.entity) {
        const target = result.entity;
        const loc = target.location;
        player.dimension.spawnEntity("minecraft:lightning_bolt", loc);
    }
});