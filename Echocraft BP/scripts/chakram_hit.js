import { world } from "@minecraft/server"

world.afterEvents.projectileHitEntity.subscribe((data) => {
    const projectile = data.projectile
    const entity = data.getEntityHit().entity

    if (projectile?.typeId === "echocraft:thrown_chakram") {
        entity.addEffect("blindness", 300, { amplifier: 0 })
    }
})