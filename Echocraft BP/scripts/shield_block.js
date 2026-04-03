import { system, world } from '@minecraft/server'

system.runInterval(() => {
	for (const player of world.getPlayers()) {
		if (!player.isSneaking) continue;

		const tags = player.getTags();
		const hasShield = tags.includes("has_echo_shield");

		if (!hasShield) continue;

		player.addEffect("resistance", 20, { amplifier: 4, showParticles: false });
	}
}, 5);