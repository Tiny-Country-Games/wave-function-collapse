package com.tcg.wavefunctioncollapse;


import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.utils.Disposable;

public class WaveFunctionCollapseAlgorithm implements Disposable {

    private final Tileset tileset;
    private final World world;

    public WaveFunctionCollapseAlgorithm() {
        this.tileset = new Tileset("punyworld-overworld-tileset.yml");
        this.world = new World(tileset, 3, 3);
    }

    public void step() {
        this.world.waveFunctionCollapse();
    }

    public void draw(final SpriteBatch batch) {
        world.draw(batch);
    }

    @Override
    public void dispose() {
        tileset.dispose();
    }
}
