package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.math.MathUtils;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;

public class WaveFunctionCollapse extends ApplicationAdapter {

    private Viewport viewport;
    private SpriteBatch batch;

    private WaveFunctionCollapseAlgorithm algorithm;

    private boolean stepMode;

    private int iterationsPerStep = 1;

    @Override
    public void create() {
        batch = new SpriteBatch();
        final int tilesWidth = 120;
        final int tilesHeight = 67;
        viewport = new FitViewport(16 * tilesWidth, 16 * tilesHeight);
        algorithm = new WaveFunctionCollapseAlgorithm(tilesWidth, tilesHeight);
        this.stepMode = true;
    }

    @Override
    public void render() {
        ScreenUtils.clear(Color.BLACK);

        if (Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) {
            algorithm.reset();
        }
        if (Gdx.input.isKeyJustPressed(Input.Keys.ENTER) ) {
            this.stepMode = !this.stepMode;
        }
        if (Gdx.input.isKeyJustPressed(Input.Keys.UP) ) {
            this.iterationsPerStep++;
        }
        if (Gdx.input.isKeyJustPressed(Input.Keys.DOWN) ) {
            this.iterationsPerStep = Math.max(1, this.iterationsPerStep - 1);
        }
        if (!this.stepMode || Gdx.input.isKeyJustPressed(Input.Keys.SPACE) ) {
            boolean isDone = false;
            for (int i = 0; i < iterationsPerStep && !isDone; i++) {
                int result = algorithm.step();
                isDone = result == 0;
            }
        }

        Gdx.graphics.setTitle("Wave Function Collapse - Iterations per step: " + this.iterationsPerStep);

        batch.begin();
        batch.setProjectionMatrix(viewport.getCamera().combined);
        algorithm.draw(batch);
        batch.end();
    }

    @Override
    public void resize(int width, int height) {
        viewport.update(width, height, true);
    }

    @Override
    public void dispose() {
        batch.dispose();
        algorithm.dispose();
    }
}
