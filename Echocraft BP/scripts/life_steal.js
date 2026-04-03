import { world } from "@minecraft/server";

world.afterEvents.entityHitEntity.subscribe(({ damagingEntity: player }) => {
    const item = player.getComponent("equippable")?.getEquipment("Mainhand");
    if (item?.typeId === "echocraft:echo_spear") {
        player?.addEffect("instant_health", 5, { amplifier: 0, showParticles: false });
    }
});