import { world, system, EquipmentSlot } from "@minecraft/server";

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!player.isSneaking) continue;

        const tags = player.getTags();
        const hasHeart = tags.includes("wearing_warden_heart");
        const hasSoul = tags.includes("soul");
        const onCooldown = tags.includes("boomed_recently");

        if (!hasHeart || !hasSoul || onCooldown) continue;

        player.addTag("boomed_recently");

        player.runCommand(`playsound mob.warden.sonic_charge @a[r=50]`);
        player.runCommand(`execute as @s at @s positioned ^ ^1 ^6 run tag @e[tag=!soul,tag=!wearing_warden_heart,c=1,r=4] add charged`);

        system.runTimeout(() => {
            // Sonic boom effects
            player.runCommand(`particle minecraft:sonic_explosion ^ ^1 ^`);
            player.runCommand(`playsound mob.warden.sonic_boom @a[r=50]`);
            player.runCommand(`execute as @e[tag=charged] at @s run tp @s ^ ^ ^-2 facing @s`);
            player.runCommand(`damage @e[tag=charged] 15 sonic_boom`);
            player.runCommand(`tag @e[tag=charged] remove charged`);
            player.removeTag("soul");

            // Access the player's equipped chestplate (Warden Heart)
            const equip = player.getComponent("equippable");
            const chestItem = equip?.getEquipment(EquipmentSlot.Chest);

            if (chestItem?.typeId === "echocraft:warden_heart") {
                const durability = chestItem.getComponent("durability");

                if (durability) {
                    const remainingDurability = durability.maxDurability - durability.damage;

                    try {
                        if (remainingDurability > 1) {
                            durability.damage += 1;
                            equip.setEquipment(EquipmentSlot.Chest, chestItem);
                        } else {
                            player.playSound("random.break", player.location);
                            equip.setEquipment(EquipmentSlot.Chest, undefined);
                        }
                    } catch (err) {
                        console.warn("Failed to apply durability to Warden Heart", err);
                    }
                }
            }
        }, 20); // Boom happens after 1 second (20 ticks)

        system.runTimeout(() => {
            player.removeTag("boomed_recently");
        }, 200);
    }
}, 5);