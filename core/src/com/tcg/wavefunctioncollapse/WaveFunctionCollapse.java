package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.ApplicationAdapter;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.Input;
import com.badlogic.gdx.graphics.Color;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.glutils.ShapeRenderer;
import com.badlogic.gdx.utils.ScreenUtils;
import com.badlogic.gdx.utils.viewport.FitViewport;
import com.badlogic.gdx.utils.viewport.Viewport;

public class WaveFunctionCollapse extends ApplicationAdapter {

    private Viewport viewport;
    private SpriteBatch batch;
    private ShapeRenderer shapeRenderer;

    private WaveFunctionCollapseAlgorithm algorithm;

    private boolean stepMode;

    private int iterationsPerStep = 1;

    private Recorder recorder;

    private boolean debug = false;

    private final WaveFunctionCollapseLaunchParams params;

    public WaveFunctionCollapse(WaveFunctionCollapseLaunchParams params) {
        super();
        this.params = params;
    }

    @Override
    public void create() {
        batch = new SpriteBatch();
        shapeRenderer = new ShapeRenderer();
        viewport = new FitViewport(params.tilesWidth * params.tileSizeWidth, params.tilesHeight * params.tileSizeHeight);
        algorithm = new WaveFunctionCollapseAlgorithm(params.tilesWidth, params.tilesHeight, params.tilesetPath);
        this.stepMode = true;
        this.recorder = new Recorder();
    }

    @Override
    public void render() {
        ScreenUtils.clear(Color.BLACK);

        if (Gdx.input.isKeyJustPressed(Input.Keys.ESCAPE)) {
            algorithm.reset();
        }
        if (Gdx.input.isKeyJustPressed(Input.Keys.ENTER)) {
            this.stepMode = !this.stepMode;
        }
        if (Gdx.input.isKeyJustPressed(Input.Keys.UP)) {
            this.iterationsPerStep++;
        }
        if (Gdx.input.isKeyJustPressed(Input.Keys.DOWN)) {
            this.iterationsPerStep = Math.max(1, this.iterationsPerStep - 1);
        }
        if (!this.stepMode || Gdx.input.isKeyJustPressed(Input.Keys.SPACE)) {
            boolean isDone = false;
            for (int i = 0; i < iterationsPerStep && !isDone; i++) {
                int result = algorithm.step();
                isDone = result == 0;
            }
            if (isDone && !this.recorder.isScheduledToStop()) {
                this.recorder.scheduleStop(25);
            }
        }

        if (Gdx.input.isKeyJustPressed(Input.Keys.R)) {
            if (recorder.isRecording()) {
                recorder.stop();
            } else {
                this.stepMode = false;
                algorithm.reset();
                recorder.start();
            }
        }

        if (Gdx.input.isKeyJustPressed(Input.Keys.F1)) {
            this.debug = !this.debug;
        }

        Gdx.graphics.setTitle("Wave Function Collapse - Iterations per step: " + this.iterationsPerStep + (this.recorder.isRecording() ? " - Recording" : ""));

        batch.begin();
        batch.setProjectionMatrix(viewport.getCamera().combined);
        algorithm.draw(batch);
        batch.end();
        recorder.record();

        if (this.debug) {
            shapeRenderer.begin(ShapeRenderer.ShapeType.Filled);
            shapeRenderer.setProjectionMatrix(viewport.getCamera().combined);
            algorithm.debug(shapeRenderer);
            shapeRenderer.end();
        }

    }

    @Override
    public void resize(int width, int height) {
        viewport.update(width, height, true);
    }

    @Override
    public void dispose() {
        batch.dispose();
        shapeRenderer.dispose();
        algorithm.dispose();
    }
}
