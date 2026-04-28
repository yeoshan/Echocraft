import { system, world } from "@minecraft/server";

system.runInterval(() => {
	for (const player of
		world.getPlayers()) {
		const eq =
			player.getComponent("minecraft:equippable");
		if (!eq) continue;

		const holdingLeft = eq.getEquipment("Offhand")
		const holdingRight = eq.getEquipment("Mainhand")

		if (holdingLeft?.typeId === "echocraft:echo_shield" && !player.hasTag("has_echo_shield_left")) {
			player.addTag("has_echo_shield_left");
		} else if (holdingLeft?.typeId !== "echocraft:echo_shield" && player.hasTag("has_echo_shield_left")) {
			player.removeTag("has_echo_shield_left");
		}

		if (holdingRight?.typeId === "echocraft:echo_shield" && !player.hasTag("has_echo_shield_right")) {
			player.addTag("has_echo_shield_right");
		} else if (holdingRight?.typeId !== "echocraft:echo_shield" && player.hasTag("has_echo_shield_right")) {
			player.removeTag("has_echo_shield_right");
		}
	}
}, 5);