import { world, system } from "@minecraft/server";

const WALL_TAG = "block:wall";

const STATES = {
  connectionNorth: "minecraft:connection_north",
  connectionSouth: "minecraft:connection_south",
  connectionEast: "minecraft:connection_east",
  connectionWest: "minecraft:connection_west",

  center: "echocraft:wall_center_above",
  north: "echocraft:wall_north_above",
  south: "echocraft:wall_south_above",
  east: "echocraft:wall_east_above",
  west: "echocraft:wall_west_above"
};

const CARDINALS = [
  { name: "north", state: STATES.connectionNorth, x: 0, y: 0, z: -1 },
  { name: "south", state: STATES.connectionSouth, x: 0, y: 0, z: 1 },
  { name: "east", state: STATES.connectionEast, x: 1, y: 0, z: 0 },
  { name: "west", state: STATES.connectionWest, x: -1, y: 0, z: 0 }
];

function getBlockSafe(dimension, x, y, z) {
  try {
    return dimension.getBlock({ x, y, z });
  } catch {
    return undefined;
  }
}

function getId(block) {
  try {
    return String(block?.typeId ?? "").toLowerCase();
  } catch {
    return "";
  }
}

function isCustomWall(block) {
  try {
    return block?.hasTag?.(WALL_TAG) ?? false;
  } catch {
    return false;
  }
}

function isAir(block) {
  try {
    return !block || block.isAir;
  } catch {
    return true;
  }
}

function isLiquid(block) {
  try {
    return !!block?.isLiquid;
  } catch {
    return false;
  }
}

function isNonAir(block) {
  return !!block && !isAir(block);
}

function isFence(block) {
  const id = getId(block);
  return id.includes("fence");
}

function isWallOrStairs(block) {
  const id = getId(block);
  return id.includes("wall") || id.includes("stairs");
}

function isClearlyNonFullBlock(block) {
  const id = getId(block);

  if (!id) return true;

  return (
    id.includes("slab") ||
    id.includes("pane") ||
    id.includes("glass_pane") ||
    id.includes("door") ||
    id.includes("trapdoor") ||
    id.includes("button") ||
    id.includes("pressure_plate") ||
    id.includes("torch") ||
    id.includes("lantern") ||
    id.includes("chain") ||
    id.includes("ladder") ||
    id.includes("vine") ||
    id.includes("rail") ||
    id.includes("carpet") ||
    id.includes("sapling") ||
    id.includes("flower") ||
    id.includes("tallgrass") ||
    id.includes("grass") ||
    id.includes("fern") ||
    id.includes("deadbush") ||
    id.includes("crop") ||
    id.includes("seagrass") ||
    id.includes("kelp") ||
    id.includes("candle") ||
    id.includes("skull") ||
    id.includes("head") ||
    id.includes("banner") ||
    id.includes("sign") ||
    id.includes("cake") ||
    id.includes("bed") ||
    id.includes("scaffolding") ||
    id.includes("pointed_dripstone") ||
    id.includes("amethyst_cluster") ||
    id.includes("rod") ||
    id.includes("lever")
  );
}

function isConnectable(block) {
  try {
    if (!block) return false;
    if (isAir(block)) return false;
    if (isLiquid(block)) return false;

    // blacklist prioritaire
    if (isFence(block)) return false;

    // whitelist prioritaire
    if (isWallOrStairs(block)) return true;

    // blocks "pas pleins" connus
    if (isClearlyNonFullBlock(block)) return false;

    // si Bedrock le considère solide, on accepte
    try {
      if (block.isSolid) return true;
    } catch { }

    // fallback permissif : non-air + non-liquid + pas blacklisté + pas non-full connu
    return true;
  } catch {
    return false;
  }
}

function computeConnectionStates(block) {
  const result = {
    north: false,
    south: false,
    east: false,
    west: false
  };

  if (!isCustomWall(block)) return result;

  const { x, y, z } = block.location;
  const dimension = block.dimension;

  for (const dir of CARDINALS) {
    const neighbor = getBlockSafe(
      dimension,
      x + dir.x,
      y + dir.y,
      z + dir.z
    );

    result[dir.name] = isConnectable(neighbor);
  }

  return result;
}

function computeAboveStates(block) {
  const result = {
    center: false,
    north: false,
    south: false,
    east: false,
    west: false
  };

  if (!isCustomWall(block)) return result;

  const { x, y, z } = block.location;
  const dimension = block.dimension;

  const above = getBlockSafe(dimension, x, y + 1, z);

  if (!isNonAir(above)) {
    return result;
  }

  result.center = true;

  for (const dir of CARDINALS) {
    const sideOfAbove = getBlockSafe(
      dimension,
      x + dir.x,
      y + 1,
      z + dir.z
    );

    if (isNonAir(sideOfAbove)) {
      result[dir.name] = true;
    }
  }

  return result;
}

function updateWallStates(block) {
  if (!isCustomWall(block)) return;

  try {
    const connectionValues = computeConnectionStates(block);
    const aboveValues = computeAboveStates(block);

    let perm = block.permutation;
    let changed = false;

    for (const dir of CARDINALS) {
      const current = perm.getState(dir.state);
      const next = connectionValues[dir.name];

      if (current !== next) {
        perm = perm.withState(dir.state, next);
        changed = true;
      }
    }

    const currentCenter = perm.getState(STATES.center);
    const nextCenter = aboveValues.center;

    if (currentCenter !== nextCenter) {
      perm = perm.withState(STATES.center, nextCenter);
      changed = true;
    }

    for (const dir of CARDINALS) {
      const stateId = STATES[dir.name];
      const current = perm.getState(stateId);
      const next = aboveValues[dir.name];

      if (current !== next) {
        perm = perm.withState(stateId, next);
        changed = true;
      }
    }

    if (changed) {
      block.setPermutation(perm);
    }
  } catch { }
}

function updateRelevantWalls(block) {
  if (!block) return;

  const { dimension } = block;
  const { x, y, z } = block.location;

  const targets = [
    getBlockSafe(dimension, x, y, z),

    getBlockSafe(dimension, x, y - 1, z),
    getBlockSafe(dimension, x, y + 1, z),

    getBlockSafe(dimension, x, y, z - 1),
    getBlockSafe(dimension, x, y, z + 1),
    getBlockSafe(dimension, x - 1, y, z),
    getBlockSafe(dimension, x + 1, y, z),

    getBlockSafe(dimension, x, y - 1, z - 1),
    getBlockSafe(dimension, x, y - 1, z + 1),
    getBlockSafe(dimension, x - 1, y - 1, z),
    getBlockSafe(dimension, x + 1, y - 1, z),

    getBlockSafe(dimension, x, y + 1, z - 1),
    getBlockSafe(dimension, x, y + 1, z + 1),
    getBlockSafe(dimension, x - 1, y + 1, z),
    getBlockSafe(dimension, x + 1, y + 1, z)
  ];

  for (const b of targets) {
    if (isCustomWall(b)) {
      updateWallStates(b);
    }
  }
}

world.afterEvents.playerPlaceBlock.subscribe((ev) => {
  system.run(() => {
    try {
      updateRelevantWalls(ev.block);
    } catch { }
  });
});

world.afterEvents.playerBreakBlock.subscribe((ev) => {
  system.run(() => {
    try {
      const { dimension, block } = ev;
      const { x, y, z } = block.location;

      const targets = [
        getBlockSafe(dimension, x, y - 1, z),
        getBlockSafe(dimension, x, y + 1, z),

        getBlockSafe(dimension, x, y, z - 1),
        getBlockSafe(dimension, x, y, z + 1),
        getBlockSafe(dimension, x - 1, y, z),
        getBlockSafe(dimension, x + 1, y, z),

        getBlockSafe(dimension, x, y - 1, z - 1),
        getBlockSafe(dimension, x, y - 1, z + 1),
        getBlockSafe(dimension, x - 1, y - 1, z),
        getBlockSafe(dimension, x + 1, y - 1, z),

        getBlockSafe(dimension, x, y + 1, z - 1),
        getBlockSafe(dimension, x, y + 1, z + 1),
        getBlockSafe(dimension, x - 1, y + 1, z),
        getBlockSafe(dimension, x + 1, y + 1, z)
      ];

      for (const b of targets) {
        if (isCustomWall(b)) {
          updateWallStates(b);
        }
      }
    } catch { }
  });
});