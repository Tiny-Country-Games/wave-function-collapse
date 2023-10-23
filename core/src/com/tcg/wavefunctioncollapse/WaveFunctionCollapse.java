package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;

public class WaveFunctionCollapse extends ApplicationAdapter {

    private Viewport viewport;
    private SpriteBatch batch;

    private WaveFunctionCollapseAlgorithm algorithm;

    @Override
    public void create() {
        batch = new SpriteBatch();
        viewport = new FitViewport(320, 320);
        algorithm = new WaveFunctionCollapseAlgorithm();
    }

    @Override
    public void render() {
        ScreenUtils.clear(Color.BLACK);

        if (Gdx.input.isKeyJustPressed(Input.Keys.SPACE) ) {
            algorithm.step();
        }

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
