package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Stack;

public class World {

    private final Tileset tileset;
    private final Tile[][] tiles;
    private final int width;
    private final int height;

    public World(final Tileset tileset, final int width, final int height) {
        this.tileset = tileset;
        this.tiles = new Tile[height][width];
        this.width = width;
        this.height = height;
        reset();
    }

    public void reset() {
        for (int row = 0; row < height; row++) {
            for (int col = 0; col < width; col++) {
                tiles[row][col] = new Tile(tileset, row, col);
            }
        }
        for (int row = 0; row < height; row++) {
            for (int col = 0; col < width; col++) {
                if (row > 0) tiles[row][col].addNeighbor(Direction.SOUTH, tiles[row - 1][col]);
                if (row < height - 1) tiles[row][col].addNeighbor(Direction.NORTH, tiles[row + 1][col]);
                if (col > 0) tiles[row][col].addNeighbor(Direction.WEST, tiles[row][col - 1]);
                if (col < width - 1) tiles[row][col].addNeighbor(Direction.EAST, tiles[row][col + 1]);
            }
        }
    }

    public void draw(final SpriteBatch batch) {
        for (final Tile[] row : tiles) {
            for (final Tile tile : row) {
                tile.draw(batch);
            }
        }
    }

    private int getLowestEntropy() {
        int lowestEntropy = Integer.MAX_VALUE;
        for (final Tile[] row : tiles) {
            for (final Tile tile : row) {
                final int entropy = tile.entropy();
                if (entropy > 0) lowestEntropy = Math.min(lowestEntropy, entropy);
            }
        }
        return lowestEntropy;
    }

    public List<Tile> getTilesLowestEntropy() {
        int lowestEntropy = Integer.MAX_VALUE;
        final List<Tile> lowestEntropyTiles = new ArrayList<>();
        for (final Tile[] row : tiles) {
            for (final Tile tile : row) {
                final int entropy = tile.entropy();
                if (entropy > 0) {
                    if (entropy < lowestEntropy) {
                        lowestEntropy = entropy;
                        lowestEntropyTiles.clear();
                    }
                    if (entropy == lowestEntropy) {
                        lowestEntropyTiles.add(tile);
                    }
                }
            }
        }
        return lowestEntropyTiles;
    }

    public int waveFunctionCollapse() {
        final List<Tile> tilesLowestEntropy = this.getTilesLowestEntropy();
        if (tilesLowestEntropy.isEmpty()) return 0;

        final Tile tileToCollapse = tilesLowestEntropy.get(MathUtils.random(tilesLowestEntropy.size() - 1));
        tileToCollapse.collapse();

        final Stack<Tile> stack = new Stack<>();
        stack.push(tileToCollapse);

        while (!stack.isEmpty()) {
            final Tile tile = stack.pop();
            final Set<String> tilePossibilities = tile.getPossibilities();
            final Set<Direction> directions = tile.getDirections();
            for (final Direction direction : directions) {
                final Tile neighbor = tile.getNeighbor(direction);
                if (neighbor.entropy() != 0) {
                    boolean constrained = neighbor.constrain(tilePossibilities, direction);
                    if (constrained) stack.push(neighbor);
                }
            }
        }
        return 1;
    }

}
