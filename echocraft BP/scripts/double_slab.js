import { system, GameMode, ItemStack } from "@minecraft/server";

function isCreativeMode(player) {
    const gameMode = player.getGameMode();
    return gameMode === GameMode.Creative;
}

function getStateSlab(block) {
    try {
        return block.permutation.getState("minecraft:vertical_half");
    } catch {
        return null;
    }
}

function isDoubleSlab(block) {
    try {
        return block.permutation.getState("echocraft:double_slab") === true;
    } catch {
        return false;
    }
}

function isSlab(block) {
    try {
        return block.permutation.getState("echocraft:double_slab") !== undefined;
    } catch {
        return false;
    }
}

function getItemId(player) {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return null;
    const item = inventory.getItem(player.selectedSlotIndex);
    return item?.typeId ?? null;
}

function reducedItem(player) {
    const inventory = player.getComponent("minecraft:inventory")?.container;
    if (!inventory) return;
    const slot = player.selectedSlotIndex;
    const item = inventory.getItem(slot);
    if (!item) return;
    if (item.amount > 1) {
        item.amount -= 1;
        inventory.setItem(slot, item);
    } else {
        inventory.setItem(slot, undefined);
    }
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
    blockComponentRegistry.registerCustomComponent(
        "echocraft:double_slab",
        {
            beforeOnPlayerPlace(e, params) {
                const { block, face, player, dimension } = e;

                if (face !== "Up" && face !== "Down") return;

                const placedSlab = face === "Up" ? block.below() : block.above();
                if (!placedSlab) return;
                if (!isSlab(placedSlab)) return;
                if (isDoubleSlab(placedSlab)) return;

                const heldItemId = getItemId(player);
                if (!heldItemId) return;
                if (placedSlab.typeId !== heldItemId) return;

                const existingHalf = getStateSlab(placedSlab);
                if (!existingHalf) return;

                const isValid =
                    (face === "Up" && existingHalf === "bottom") ||
                    (face === "Down" && existingHalf === "top");

                if (!isValid) return;

                const sound = params.params?.sound_id;
                if (!sound) return;

                e.cancel = true;

                const slabLocation = { ...placedSlab.location };
                const slabPermutation = placedSlab.permutation;
                const isCreative = isCreativeMode(player);

                system.run(() => {
                    if (!isCreative) reducedItem(player);
                    dimension.playSound(sound, slabLocation, { volume: 1.0, pitch: 0.8 });
                    dimension.setBlockPermutation(
                        slabLocation,
                        slabPermutation.withState("echocraft:double_slab", true)
                    );
                    dimension.getBlock(slabLocation)?.setWaterlogged(false);
                });
            },

            onPlayerBreak(e, params) {
                const { player, dimension, brokenBlockPermutation } = e;

                if (brokenBlockPermutation.getState("echocraft:double_slab") !== true) return;
                if (!player) return;
                if (isCreativeMode(player)) return;

                const itemId = params.params?.item_id;
                if (!itemId) return;

                const blockLocation = { ...e.block.location };

                system.run(() => {
                    dimension.spawnItem(
                        new ItemStack(itemId, 1),
                        {
                            x: blockLocation.x + 0.5,
                            y: blockLocation.y + 0.5,
                            z: blockLocation.z + 0.5,
                        }
                    );
                });
            },
        }
    );
});