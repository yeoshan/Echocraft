import { world, system } from "@minecraft/server"

system.runInterval(() => {
    for (const player of
        world.getAllPlayers()) {
        const item
            = player.getComponent("inventory").container.getItem(player.selectedSlotIndex)
        if (item?.typeId === "echocraft:echo_pickaxe") {
            player.addEffect("night_vision", 600, { amplifier: 0, showParticles: false })
        }
    }
})