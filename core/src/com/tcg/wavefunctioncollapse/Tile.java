package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.Rectangle;
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

    public boolean isSet() {
        return this.tileKey != null;
    }

    public boolean isDeadlocked() {
        return !this.isSet() && this.possibilities.isEmpty();
    }

    public void reset() {
        this.possibilities.clear();
        this.tileKey = null;
        this.possibilities.putAll(tileset.getPossibilities());
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

    public void debugDraw(final ShapeRenderer shapeRenderer, final Color color) {
        final Color originalColor = new Color(shapeRenderer.getColor());
        shapeRenderer.setColor(color);

        final Rectangle rect = new Rectangle(col * tileset.tileWidth, row * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight);
        final float thickness = 2f;

        shapeRenderer.rect(rect.x, rect.y, rect.width, thickness);
        shapeRenderer.rect(rect.x, rect.y, thickness, rect.height);
        shapeRenderer.rect(rect.x, rect.y + rect.height - thickness, rect.width, thickness);
        shapeRenderer.rect(rect.x + rect.width - thickness, rect.y, thickness, rect.height);

        shapeRenderer.setColor(originalColor);
    }

    public boolean constrain() {
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

    public Tile cpy() {
        final Tile clone = new Tile(this.tileset, this.row, this.col);
        clone.possibilities.putAll(this.possibilities);
        clone.tileKey = this.tileKey;
        return clone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tile tile = (Tile) o;
        return row == tile.row && col == tile.col;
    }

    @Override
    public int hashCode() {
        return Objects.hash(row, col);
    }
}
