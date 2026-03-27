import { system, world } from "@minecraft/server"
world.beforeEvents.worldInitialize.subscribe((data) => {
    data.itemComponentRegistry.registerCustomComponent("echocraft:break", {
        onMineBlock: data => {
            const item = data.itemStack
            const player = data.source
            const inv = player.getComponent("inventory").container
            const durability = item.getComponent("durability")
            const remaingDurability = durability.damage - durability.maxDurability
            try {
                if (remaingDurability !== 0) {
                    durability.damage += 1
                    inv.setItem(player.selectedSlotIndex, item)
                }

            } catch (error) {

            }
            if (remaingDurability == 0) {
                player.playSound("random.break", player.location)
                inv.setItem(player.selectedSlotIndex, undefined)
            }
        }
    })
})