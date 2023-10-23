package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.tcg.wavefunctioncollapse.tiledata.TileDefinition;

import java.util.*;

public class Tile {

    private final Tileset tileset;
    private final int row;
    private final int col;
    private final Map<Direction, Tile> neighbors;
    private final Map<String, TileDefinition> possibilities;

    private String tileKey;

    public Tile(final Tileset tileset, final int row, final int col) {
        this.tileset = tileset;
        this.row = row;
        this.col = col;
        this.neighbors = new EnumMap<>(Direction.class);
        this.possibilities = tileset.getPossibilities();
        this.tileKey = null;
    }

    public void addNeighbor(final Direction direction, final Tile tile) {
        neighbors.put(direction, tile);
    }

    public Tile getNeighbor(final Direction direction) {
        return neighbors.get(direction);
    }

    public Set<Direction> getDirections() {
        return this.neighbors.keySet();
    }

    public int entropy() {
        if (this.tileKey == null) return possibilities.size();
        return 0;
    }

    public Set<String> getPossibilities() {
        return possibilities.keySet();
    }

    public void collapse() {
        final WeightedChoiceSelector<String> selector = new WeightedChoiceSelector<>(key -> possibilities.get(key).weight);
        for (final String possibleKey : possibilities.keySet()) {
            selector.addItem(possibleKey);
        }
        this.tileKey = selector.select();
        final TileDefinition tile = possibilities.get(this.tileKey);
        this.possibilities.clear();
        this.possibilities.put(this.tileKey, tile);
    }

    public void draw(final SpriteBatch batch) {
        if (tileKey == null) return;
        tileset.renderTile(batch, tileKey, col * tileset.tileWidth, row * tileset.tileHeight);
    }

    public boolean constrain(Set<String> neighborPossibilities, Direction direction) {
        if (this.entropy() <= 0) return false;
        boolean constrained = false;
        final Set<String> possibleConnectors = new HashSet<>();
        for (final String possibility : this.possibilities.keySet()) {
            final TileDefinition tile = this.tileset.getTile(possibility);
            possibleConnectors.addAll(tile.neighbors.directionNeighbors(direction.opposite()));
        }
        final Set<String> allowedConnectors = new HashSet<>();
        for (final String neighborPossibility : neighborPossibilities) {
            final TileDefinition tile = this.tileset.getTile(neighborPossibility);
            allowedConnectors.addAll(tile.neighbors.directionNeighbors(direction));
        }
        possibleConnectors.retainAll(allowedConnectors);
        final Set<String> keysToRemove = new HashSet<>();
        for (final String possibleKey : this.possibilities.keySet()) {
            if (!possibleConnectors.contains(possibleKey)) {
                keysToRemove.add(possibleKey);
                constrained = true;
            }
        }
        final Map<String, TileDefinition> allPosibilities = this.tileset.getPossibilities();
//        final Set<String> connectors = new HashSet<>();
//        for (final String neighborPossibility : neighborPossibilities) {
//            connectors.addAll(this.tileset.getTile(neighborPossibility).neighbors.directionNeighbors(direction));
//        }
//        final Direction opposite = direction.opposite();
//        final Set<String> previousPossibleKeys = this.possibilities.keySet();
//        final Set<String> keysToRemove = new HashSet<>();
//        for (final String possibleKey : previousPossibleKeys) {
//            final TileDefinition tile = this.tileset.getTile(possibleKey);
//            final Set<String> possibleConnectors = tile.neighbors.directionNeighbors(opposite);
//            if (Collections.disjoint(possibleConnectors, connectors)) {
//                keysToRemove.add(possibleKey);
//                constrained = true;
//            }
//
//        }
        for (final String keyToRemove : keysToRemove) {
            this.possibilities.remove(keyToRemove);
        }
        return constrained;
    }

}
