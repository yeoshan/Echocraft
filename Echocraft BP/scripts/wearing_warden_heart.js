import { system, world } from "@minecraft/server";

system.runInterval(() => {
    for (const player of
        world.getPlayers()) {
        const eq =
            player.getComponent("minecraft:equippable");
        if (!eq) continue;

        const chest = eq.getEquipment("Chest")

        if (chest?.typeId === "echocraft:warden_heart" && !player.hasTag("wearing_warden_heart")) {
            player.addTag("wearing_warden_heart");
        } else if (chest?.typeId !== "echocraft:warden_heart" && player.hasTag("wearing_warden_heart")) {
            player.removeTag("wearing_warden_heart");
        }
    }
}, 5);