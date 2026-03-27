import { system } from "@minecraft/server";

const ItemFoodEffectsComponent = {
    onConsume({ source }, { params }) {
        for (const { name, duration, amplifier } of params) {
            source.addEffect(name, duration, { amplifier });
        }
    },
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("echocraft:ghost", ItemFoodEffectsComponent);
});