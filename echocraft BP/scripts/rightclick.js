import { system, world } from "@minecraft/server";

world.beforeEvents.worldInitialize.subscribe((data) => {
    data.itemComponentRegistry.registerCustomComponent("echocraft:rightclick", {
        onUseOn: data => {
            const block = data.block;
            const item = data.itemStack;
            const player = data.source;
            const inv = player.getComponent("inventory").container;
            const durability = item.getComponent("durability");
            const remainingDurability = durability.maxDurability - durability.damage;

            const shovelBlocks = ["minecraft:grass_block", "minecraft:dirt", "minecraft:podzol", "minecraft:mycelium"];
            const hoeBlocks = ["minecraft:grass_path", "minecraft:grass_block", "minecraft:dirt", "minecraft:podzol", "minecraft:mycelium"];

            // ECHO AXE - STRIP LOGS
            if (block.hasTag("log") && item.typeId === "echocraft:echo_axe") {
                if (remainingDurability > 0) {
                    block.setType(`stripped_${block.typeId.slice(10)}`);
                    block.dimension.playSound("use.wood", block.location);
                    durability.damage += 1;
                    inv.setItem(player.selectedSlotIndex, item);
                } else {
                    player.playSound("random.break", player.location);
                    inv.setItem(player.selectedSlotIndex, undefined);
                }
            }

            // ECHO SHOVEL - CREATE GRASS PATH
            if (item.typeId === "echocraft:echo_shovel" && shovelBlocks.includes(block.typeId)) {
                if (remainingDurability > 0) {
                    block.setType("minecraft:grass_path");
                    block.dimension.playSound("use.grass", block.location);
                    durability.damage += 1;
                    inv.setItem(player.selectedSlotIndex, item);
                } else {
                    player.playSound("random.break", player.location);
                    inv.setItem(player.selectedSlotIndex, undefined);
                }
            }

            // ECHO HOE - CREATE FARMLAND
            if (item.typeId === "echocraft:echo_hoe" && hoeBlocks.includes(block.typeId)) {
                if (remainingDurability > 0) {
                    block.setType("minecraft:farmland");
                    block.dimension.playSound("use.grass", block.location);
                    durability.damage += 1;
                    inv.setItem(player.selectedSlotIndex, item);
                } else {
                    player.playSound("random.break", player.location);
                    inv.setItem(player.selectedSlotIndex, undefined);
                }
            }
        }
    });
});