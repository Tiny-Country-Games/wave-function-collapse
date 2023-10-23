package com.tcg.wavefunctioncollapse.tiledata;

import com.tcg.wavefunctioncollapse.Direction;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class TileNeighbors {
    public String[] north;
    public String[] south;
    public String[] east;
    public String[] west;

    public Set<String> references() {
        Set<String> refs = new HashSet<>();
        refs.addAll(Arrays.asList(north));
        refs.addAll(Arrays.asList(south));
        refs.addAll(Arrays.asList(east));
        refs.addAll(Arrays.asList(west));
        return refs;
    }

    public final Set<String> directionNeighbors(final Direction direction) {
        switch (direction) {
            case NORTH:
                return new HashSet<>(Arrays.asList(this.north));
            case SOUTH:
                return new HashSet<>(Arrays.asList(this.south));
            case EAST:
                return new HashSet<>(Arrays.asList(this.east));
            case WEST:
                return new HashSet<>(Arrays.asList(this.west));
            default:
                throw new IllegalStateException("Unknown direction: " + this);
        }
    }

    public boolean isAllowed(final Direction direction, final String tileKey) {
        return this.directionNeighbors(direction).contains(Objects.requireNonNull(tileKey));
    }

}
