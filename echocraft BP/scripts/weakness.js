import { world } from "@minecraft/server";

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: player, hitEntity }) => {
    const item = player.getComponent("equippable")?.getEquipment("Mainhand");
    if (item?.typeId == "echocraft:echo_axe") {
        hitEntity?.addEffect("weakness", 300, { amplifier: 0, showParticles: true });
    }
}, { entityTypes: ["minecraft:player"] });