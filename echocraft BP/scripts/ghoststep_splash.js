import { world } from "@minecraft/server"

world.afterEvents.projectileHitEntity.subscribe((data) => {
    const projectile = data.projectile
    const entity = data.getEntityHit().entity

    if (projectile?.typeId === "echocraft:thrown_potion_bottle_splash_ghost") {
        entity.addEffect("invisibility", 300, { amplifier: 0 })
        entity.addEffect("regeneration", 300, { amplifier: 0 })
        entity.addEffect("speed", 300, { amplifier: 4 })
    }
})