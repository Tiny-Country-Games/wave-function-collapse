package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.graphics.Pixmap;
import com.badlogic.gdx.graphics.PixmapIO;

import java.nio.ByteBuffer;
import java.util.zip.Deflater;

public class Recorder {

    private String folder;

    private int frame;

    private int maxFrames;

    public Recorder() {
        this.folder = null;
    }

    public boolean isRecording() {
        return this.folder != null;
    }

    public void start() {
        this.frame = 0;
        this.folder = "captures/" + System.currentTimeMillis() + "/";
        this.maxFrames = Integer.MAX_VALUE;
    }

    public void scheduleStop(int frames) {
        this.maxFrames = this.frame + frames;
    }

    public boolean isScheduledToStop() {
        return this.maxFrames < Integer.MAX_VALUE;
    }

    public void stop() {
        this.folder = null;
    }

    public void record() {
        if (this.folder == null) return;
        Pixmap pixmap = Pixmap.createFromFrameBuffer(0, 0, Gdx.graphics.getBackBufferWidth(), Gdx.graphics.getBackBufferHeight());
        ByteBuffer pixels = pixmap.getPixels();

        // This loop makes sure the whole screenshot is opaque and looks exactly like what the user is seeing
        int size = Gdx.graphics.getBackBufferWidth() * Gdx.graphics.getBackBufferHeight() * 4;
        for (int i = 3; i < size; i += 4) {
            pixels.put(i, (byte) 255);
        }

        PixmapIO.writePNG(Gdx.files.local(String.format("%s/frame_%05d.png", this.folder, this.frame)), pixmap, Deflater.DEFAULT_COMPRESSION, true);
        pixmap.dispose();
        this.frame++;
        System.out.println("Recorded frame " + this.frame + " of " + this.maxFrames);
        if (this.frame >= this.maxFrames) {
            this.stop();
        }
    }

}
