import { world } from "@minecraft/server";

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    if (event.player.getGameMode() === "creative") {
        return;
    }
    if (event.block.typeId !== "minecraft:sculk_vein") {
        return;
    }
    const itemEnchantComp = event.itemStack.getComponent("minecraft:enchantable");
    if (itemEnchantComp?.hasEnchantment("silk_touch")) {
        return;
    }
    const item = event.itemStack.typeId;
    if (item.startsWith("echocraft") && !item.endsWith("echo_hoe")) {
        return;
    }

    event.player.runCommandAsync(`loot spawn ${event.block.x} ${event.block.y} ${event.block.z} loot "blocks/broken_soul"`);
    event.player.runCommandAsync(`execute as @s positioned ${event.block.x} ${event.block.y} ${event.block.z} run tag @e[type=item, name="echocraft:broken_soul", c=1] add silk_cancel`);
});