package com.tcg.wavefunctioncollapse;

import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;
import com.badlogic.gdx.graphics.g2d.TextureRegion;
import com.badlogic.gdx.utils.Disposable;
import com.badlogic.gdx.utils.GdxRuntimeException;
import com.tcg.wavefunctioncollapse.tiledata.TileCoordinates;
import com.tcg.wavefunctioncollapse.tiledata.TileDefinition;
import org.yaml.snakeyaml.LoaderOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

public class Tileset implements Disposable {

    private final Texture tilesetTexture;
    private final TextureRegion[][] tilesetTileRegions;
    private final Map<String, TileDefinition> tiles;

    public final int tileWidth;
    public final int tileHeight;

    public Tileset(final String path) {
        final FileHandle tilesetFile = Gdx.files.absolute(path);
        if (!tilesetFile.exists()) {
            throw new GdxRuntimeException("Tileset file does not exist: " + path);
        }
        final String ymlText = Gdx.files.internal(Objects.requireNonNull(path)).readString();
        final TilesetDocument document = new Yaml(new Constructor(TilesetDocument.class, new LoaderOptions())).load(ymlText);
        this.tilesetTexture = new Texture(tilesetFile.sibling(document.source));
        this.tileWidth = document.tileWidth;
        this.tileHeight = document.tileHeight;
        this.tilesetTileRegions = TextureRegion.split(tilesetTexture, document.tileWidth, document.tileHeight);
        this.tiles = loadTileData(document);
    }

    private Map<String, TileDefinition> loadTileData(final TilesetDocument document) {
        if (document.tiles == null || document.tiles.isEmpty()) {
            throw new GdxRuntimeException("Tileset document must contain at least one tile");
        }
        final Map<String, TileDefinition> tiles = new HashMap<>();
        for (final String key : document.tiles.keySet()) {
            final TileDefinition tile = document.tiles.get(key);
            if (tile.draw == null || tile.draw.length == 0) {
                throw new GdxRuntimeException("Tile " + key + " does not contain any draw data");
            }
            final Set<String> references = tile.neighbors.references();
            for (final String reference : references) {
                if (!document.tiles.containsKey(reference)) {
                    throw new GdxRuntimeException("Tile " + key + " contains a reference to a tile that does not exist: " + reference);
                }
            }
            tiles.put(key, tile);
        }
        return tiles;
    }

    public TileDefinition getTile(final String key) {
        final TileDefinition tile = tiles.get(key);
        if (tile == null) {
            throw new GdxRuntimeException("Tileset does not contain a tile with key: " + key);
        }
        return tile;
    }

    public void renderTile(final SpriteBatch batch, final String key, final float x, final float y) {
        final TileDefinition tile = getTile(key);
        for (final TileCoordinates coordinate : tile.draw) {
            final TextureRegion region = tilesetTileRegions[coordinate.r][coordinate.c];
            batch.draw(region, x, y);
        }
    }

    public Map<String, TileDefinition> getPossibilities() {
        return new HashMap<>(this.tiles);
    }

    @Override
    public void dispose() {
        tilesetTexture.dispose();
    }

    public static class TilesetDocument {
        public String source;
        public int tileWidth;
        public int tileHeight;
        public Map<String, TileDefinition> tiles;

    }

}
