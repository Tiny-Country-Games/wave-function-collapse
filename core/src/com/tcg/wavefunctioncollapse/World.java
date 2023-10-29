package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.math.MathUtils;

import java.util.*;

public class World {

    private final Tileset tileset;
    private final Tile[][] tiles;
    private final int width;
    private final int height;

    private final Stack<Tile> tilesSelected;

    public World(final Tileset tileset, final int width, final int height) {
        this.tileset = tileset;
        this.tiles = new Tile[height][width];
        this.width = width;
        this.height = height;
        this.tilesSelected = new Stack<>();
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
        this.tilesSelected.clear();
    }

    public void draw(final SpriteBatch batch) {
        for (final Tile[] row : tiles) {
            for (final Tile tile : row) {
                tile.draw(batch);
            }
        }
    }

    public void debug(final ShapeRenderer shapeRenderer) {
        final int lowestEntropy = getLowestEntropy();
        for (final Tile[] row : tiles) {
            for (final Tile tile : row) {
                if (tile.entropy() == lowestEntropy) {
                    tile.debugDraw(shapeRenderer, Color.GREEN);
                } else if (tile.isDeadlocked()) {
                    tile.debugDraw(shapeRenderer, Color.RED);
                } else if (tile.isSet()) {
                    boolean isEdge = false;
                    for (final Direction direction : tile.getDirections()) {
                        final Tile neighbor = tile.getNeighbor(direction);
                        if (!neighbor.isSet()) {
                            isEdge = true;
                            break;
                        }
                    }
                    if (isEdge) tile.debugDraw(shapeRenderer, Color.YELLOW);
                } else {
                    tile.debugDraw(shapeRenderer, Color.GREEN.cpy().lerp(Color.BLUE.cpy(), 1f - ((float) lowestEntropy / tile.entropy())));
                }
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

        final int MAX_DEADLOCKS = 10;

        int consecutivePicksWithDeadlocks = -1;
        int deadLocks;

        do {
            final Tile tileToCollapse = tilesLowestEntropy.get(MathUtils.random(tilesLowestEntropy.size() - 1));
            tileToCollapse.collapse();
            deadLocks = constrainAllAndGetDeadlockCount(tileToCollapse);
            if (deadLocks > 0) {
                int deadLocksAfterResetting = resetTile(tileToCollapse);
                if (deadLocksAfterResetting > 0) {
                    if (this.tilesSelected.isEmpty()) {
                        this.reset();
                        return 1;
                    }
                    final Tile tileToReset = this.tilesSelected.pop();
                    resetTile(tileToReset);
                    return this.waveFunctionCollapse();
                } else {
                    consecutivePicksWithDeadlocks++;
                }
            } else {
                consecutivePicksWithDeadlocks = 0;
                this.tilesSelected.push(tileToCollapse);
            }
        } while (deadLocks > 0 && consecutivePicksWithDeadlocks < MAX_DEADLOCKS);

        if (consecutivePicksWithDeadlocks == MAX_DEADLOCKS) {
            this.reset();
            return 1;
        }

        return 1;
    }

    private int constrainAllAndGetDeadlockCount(Tile... tiles) {
        return this.constrainAllAndGetDeadlockCount(Arrays.asList(tiles));
    }

    private int constrainAllAndGetDeadlockCount(List<Tile> tiles) {
        final Stack<Tile> stack = new Stack<>();
        tiles.forEach(stack::push);
        int deadLockCount = 0;
        while (!stack.isEmpty()) {
            final Tile tile = stack.pop();
            final Set<Direction> directions = tile.getDirections();
            for (final Direction direction : directions) {
                final Tile neighbor = tile.getNeighbor(direction);
                if (neighbor.entropy() != 0) {
                    boolean constrained = neighbor.constrain();
                    if (constrained) {
                        if (neighbor.isDeadlocked()) deadLockCount++;
                        stack.push(neighbor);
                    }
                }
            }
        }
        return deadLockCount;
    }

    private int resetTile(Tile tile) {
        tile.reset();
        for (Tile[] row : tiles) {
            for (Tile t : row) {
                if (!t.isSet()) t.reset();
            }
        }
        if (this.tilesSelected.isEmpty()) return 0;
        return constrainAllAndGetDeadlockCount(this.tilesSelected.peek());
    }

}
