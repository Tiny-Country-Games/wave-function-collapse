package com.tcg.wavefunctioncollapse;

import com.tcg.wavefunctioncollapse.tiledata.TileDefinition;

public enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST;

    final Direction opposite() {
        switch (this) {
            case NORTH: return SOUTH;
            case SOUTH: return NORTH;
            case EAST: return WEST;
            case WEST: return EAST;
            default: throw new IllegalStateException("Unknown direction: " + this);
        }
    }

    final String[] neighbors(final TileDefinition tile) {
        switch (this) {
            case NORTH: return tile.neighbors.north;
            case SOUTH: return tile.neighbors.south;
            case EAST: return tile.neighbors.east;
            case WEST: return tile.neighbors.west;
            default: throw new IllegalStateException("Unknown direction: " + this);
        }
    }

}
