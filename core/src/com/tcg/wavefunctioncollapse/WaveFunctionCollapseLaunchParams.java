package com.tcg.wavefunctioncollapse;

public class WaveFunctionCollapseLaunchParams {

    public int tilesWidth;

    public int tilesHeight;

    public String tilesetPath;

    public int tileSizeWidth;

    public int tileSizeHeight;

    @Override
    public String toString() {
        return "WaveFunctionCollapseLaunchParams{" +
                "tilesWidth=" + tilesWidth +
                ", tilesHeight=" + tilesHeight +
                ", tilesetPath='" + tilesetPath + '\'' +
                ", tileSizeWidth=" + tileSizeWidth +
                ", tileSizeHeight=" + tileSizeHeight +
                '}';
    }
}
