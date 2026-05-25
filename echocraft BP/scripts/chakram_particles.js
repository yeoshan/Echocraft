import { world, system } from "@minecraft/server";

world.afterEvents.projectileHitEntity.subscribe((event) => {
	const player = event.source
	const entityHit = event.getEntityHit();
	const projectile = event.projectile

	if (projectile?.typeId !== "echocraft:thrown_chakram") return;

	if (!entityHit) return;

	const hitEntity = entityHit.entity;
	if (!hitEntity) return;

	const dimension = hitEntity.dimension;
	if (!dimension) return;

	let lastKnownPos = { ...entityHit.hitVector };

	let width = 0.6;
	let height = 1.6;
	try {
		const box = hitEntity.getComponent("minecraft:bounding_box");
		if (box) {
			width = box.width ?? width;
			height = box.height ?? height;
		}
	} catch {
		// fallback to defaults
	}

	const durationTicks = 40;
	let ticks = 0;

	player.runCommand('playsound mob.warden.death @a[r=30]');
	entityHit.entity.addEffect("blindness", 300, { amplifier: 0 });

	const interval = system.runInterval(() => {
		if (ticks >= durationTicks) {
			system.clearRun(interval);
			return;
		}

		let basePos;
		try {
			if (hitEntity && hitEntity.location && typeof hitEntity.location.x === "number") {
				basePos = hitEntity.location;
				lastKnownPos = { ...basePos };
			} else {
				basePos = lastKnownPos;
			}
		} catch {
			basePos = lastKnownPos;
		}

		if (!basePos) {
			system.clearRun(interval);
			return;
		}

		const particlesPerTick = 3;
		for (let i = 0; i < particlesPerTick; i++) {
			const offsetX = (Math.random() - 0.5) * width * 2;
			const offsetY = Math.random() * height; // random height along hitbox
			const offsetZ = (Math.random() - 0.5) * width * 2;

			const spawnPos = {
				x: basePos.x + offsetX,
				y: basePos.y + offsetY,
				z: basePos.z + offsetZ
			};

			try {
				dimension.spawnParticle("echocraft:chakram_hit", spawnPos);
			} catch {
				system.clearRun(interval);
				return;
			}
		}

		ticks++;
	}, 1);
});