import { world } from "@minecraft/server";

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    if (event.player.getGameMode() === "creative") {
        return;
    }
    if (event.block.typeId !== "minecraft:soul_sand") {
        return;
    }
    if (event.block.typeId !== "minecraft:soul_soil") {
        return;
    }
    const item = event.itemStack.typeId;
    if (item.startsWith("echocraft") && !item.endsWith("echo_shovel")) {
        return;
    }

    event.player.runCommandAsync(`loot spawn ${event.block.x} ${event.block.y} ${event.block.z} loot "blocks/soul_dust"`);
});