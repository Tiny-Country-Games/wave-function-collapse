package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.tcg.wavefunctioncollapse.tiledata.TileDefinition;

import java.util.*;
import java.util.stream.Collectors;

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
        final Set<String> allPossibilities = new HashSet<>(this.tileset.getPossibilities().keySet());
        for (final Direction dir : this.getDirections()) {
            final Tile neighbor = this.getNeighbor(dir);
            final Set<String> neighborConnectors = new HashSet<>();
            for (final String neighborPossibility : neighbor.getPossibilities()) {
                final TileDefinition possibility = this.tileset.getTile(neighborPossibility);
                neighborConnectors.addAll(possibility.neighbors.directionNeighbors(dir.opposite()));
            }
            allPossibilities.retainAll(neighborConnectors);
        }
        final Set<String> possibilitiesToRemove = this.possibilities.keySet()
                .stream()
                .filter(key -> !allPossibilities.contains(key))
                .collect(Collectors.toSet());
        possibilitiesToRemove.forEach(this.possibilities::remove);
        return !possibilitiesToRemove.isEmpty();
    }

}
