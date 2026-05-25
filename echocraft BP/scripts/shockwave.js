import { world } from '@minecraft/server'

world.afterEvents.entityHitEntity.subscribe(({ hitEntity, damagingEntity }) => {
    for (const player of world.getPlayers()) {
        if (!player.isSneaking) continue;

        const tags = player.getTags();
        const hasShieldLeft = tags.includes("has_echo_shield_left");
        const hasShieldRight = tags.includes("has_echo_shield_right")

        if (!(hasShieldLeft || hasShieldRight)) continue;

        if (hitEntity.typeId === "minecraft:player") {
            const dimension = hitEntity.dimension;
            const location = hitEntity.location
            const view = hitEntity.getViewDirection();

            hitEntity.runCommand('playsound item.shield.block @a[r=15]');
            damagingEntity.applyKnockback({ x: view.x + 0.5, z: view.z }, 1);
            hitEntity.clearVelocity();

            dimension.spawnParticle("echocraft:shockwave", location);
        }
    }
});