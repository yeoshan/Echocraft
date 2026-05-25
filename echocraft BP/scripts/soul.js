import { world } from "@minecraft/server";

world.afterEvents.itemCompleteUse.subscribe((event) => {
    const { itemStack, source } = event;

    if (!source || !itemStack) return;

    if (itemStack.typeId === "echocraft:soul_bottle") {
        source.addTag("soul");
    }
});