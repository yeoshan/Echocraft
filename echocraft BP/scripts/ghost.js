import { world } from "@minecraft/server";

const ItemFoodEffectsComponent = {
    onConsume({ itemStack, source }) {
        if (itemStack.typeId === "echocraft:potion_bottle_ghost") {
            source.addEffect("minecraft:speed", 300, {
                amplifier: 4,
                showParticle: true,
            });
            source.addEffect("minecraft:invisibility", 300, {
                amplifier: 0,
                showParticle: true,
            });
            source.addEffect("minecraft:regeneration", 300, {
                amplifier: 0,
                showParticle: true,
            });
        }
    },
};

world.beforeEvents.worldInitialize.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("echocraft:ghost", ItemFoodEffectsComponent);
});