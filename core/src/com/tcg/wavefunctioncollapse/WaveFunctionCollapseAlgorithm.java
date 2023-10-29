package com.tcg.wavefunctioncollapse;


import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.utils.Disposable;

public class WaveFunctionCollapseAlgorithm implements Disposable {

    private final Tileset tileset;
    private final World world;


    public WaveFunctionCollapseAlgorithm(int tilesWidth, int tilesHeight, String tilesetPath) {
        this.tileset = new Tileset(tilesetPath);
        this.world = new World(tileset, tilesWidth, tilesHeight);
    }

    public int step() {
        return this.world.waveFunctionCollapse();
    }

    public void reset() {
        this.world.reset();
    }

    public void draw(final SpriteBatch batch) {
        world.draw(batch);
    }

    public void debug(final ShapeRenderer shapeRenderer) {
        world.debug(shapeRenderer);
    }

    @Override
    public void dispose() {
        tileset.dispose();
    }
}
