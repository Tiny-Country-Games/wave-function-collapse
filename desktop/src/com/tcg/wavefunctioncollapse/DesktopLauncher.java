package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application;
import com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration;

// Please note that on macOS your application needs to be started with the -XstartOnFirstThread JVM argument
public class DesktopLauncher {
    public static void main(String[] arg) {
        ProgramSettings settings = new ProgramSettings();
        settings.setLaunchCallback(params -> {
            settings.dispose();
            Lwjgl3ApplicationConfiguration config = new Lwjgl3ApplicationConfiguration();
            config.setTitle("Wave Function Collapse");
            config.setWindowedMode(params.tilesWidth * params.tileSizeWidth, params.tilesHeight * params.tileSizeHeight);
            new Lwjgl3Application(new WaveFunctionCollapse(params), config);
        });
        settings.setVisible(true);
    }
}
