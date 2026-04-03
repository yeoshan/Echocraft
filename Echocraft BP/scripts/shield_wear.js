import { system, world } from "@minecraft/server";

system.runInterval(() => {
	for (const player of
		world.getPlayers()) {
		const eq =
			player.getComponent("minecraft:equippable");
		if (!eq) continue;

		const holding = eq.getEquipment("Offhand")

		if (holding?.typeId === "echocraft:echo_shield" && !player.hasTag("has_echo_shield")) {
			player.addTag("has_echo_shield");
		} else if (holding?.typeId !== "echocraft:echo_shield" && player.hasTag("has_echo_shield")) {
			player.removeTag("has_echo_shield");
		}
	}
}, 5);