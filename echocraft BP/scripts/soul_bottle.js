import { world, ItemStack } from "@minecraft/server";

world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    const block = player.getBlockFromViewDirection()?.block;
    const item = event.itemStack;
    const inventory = player.getComponent("inventory").container;

    if (item?.typeId === "minecraft:glass_bottle" && block?.typeId === "minecraft:sculk_shrieker") {
        if (item.amount === 1) {
            inventory.setItem(player.selectedSlotIndex, new ItemStack("echocraft:soul_bottle", 1));
        } else {
            player.runCommand("clear @s glass_bottle 0 1");
            inventory.addItem(new ItemStack("echocraft:soul_bottle", 1));
        }

        player.playSound("bottle.dragonbreath", player.location);
        player.playSound("bloom.sculk_catalyst", player.location);
    }
});