import { world } from "@minecraft/server";

world.afterEvents.playerBreakBlock.subscribe((event) => {
    const block = event.block;
    const player = event.player;
    const item = event.itemStackBeforeBreak;

    const brokenBlock = event.brokenBlockPermutation;
    if (player.getGameMode() === "Creative") {
        return;
    }

    if (brokenBlock.type.id !== ("minecraft:soul_sand")) {
        return;
    }

    const itemEnchantComp = item.getComponent("minecraft:enchantable");

    if (brokenBlock.type.id === "minecraft:soul_sand" && !itemEnchantComp?.hasEnchantment("silk_touch") && item.typeId.startsWith("echocraft") && item.typeId.endsWith("echo_shovel")) {
        player.runCommand(`loot spawn ${block.x} ${block.y} ${block.z} loot "blocks/soul_dust"`);
        return;
    }

});