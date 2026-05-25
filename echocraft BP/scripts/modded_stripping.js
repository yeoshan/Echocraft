import { world, system } from "@minecraft/server";

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("echocraft:rightclick", {
        onUseOn: data => {
            const block = data.block;
            const item = data.itemStack;

            if (block.typeId.endsWith("log") && item.typeId === "echocraft:echo_axe") {
                    block.setType(`stripped_${block.typeId.slice(9)}`);
                    block.dimension.playSound("use.wood", block.location);
            }
        }
    });
});