package com.tcg.wavefunctioncollapse;

public enum Direction {
    NORTH,
    SOUTH,
    EAST,
    WEST;

    final Direction opposite() {
        switch (this) {
            case NORTH:
                return SOUTH;
            case SOUTH:
                return NORTH;
            case EAST:
                return WEST;
            case WEST:
                return EAST;
            default:
                throw new IllegalStateException("Unknown direction: " + this);
        }
    }

}
