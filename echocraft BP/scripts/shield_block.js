import { system, world } from '@minecraft/server'

system.runInterval(() => {
	for (const player of world.getPlayers()) {
		if (!player.isSneaking) continue;

		const tags = player.getTags();
		const hasShieldLeft = tags.includes("has_echo_shield_left");
		const hasShieldRight = tags.includes("has_echo_shield_right")

		if (!(hasShieldLeft || hasShieldRight)) continue;

		player.addEffect("resistance", 20, { amplifier: 4, showParticles: false });
	}
}, 5);