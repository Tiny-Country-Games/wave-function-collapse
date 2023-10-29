import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type RootState = {
    tileset: TileSet | null;
    tileData: string[][] | null;
    selectedTile: string | null;
};

const initialState: RootState = {
    tileset: null,
    tileData: null,
    selectedTile: null,
};

export const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        clearTileset: (state) => {
            state.tileset = null;
        },
        clearTileData: (state) => {
            state.tileData = null;
        },
        clearAllData: (state) => {
            state.tileset = null;
            state.tileData = null;
        },
        setTileset: (state, action: PayloadAction<TileSet>) => {
            state.tileset = JSON.parse(JSON.stringify(action.payload));
        },
        setTileData: (state, action: PayloadAction<string[][]>) => {
            state.tileData = action.payload.map(row => [...row]);
        },
        setSelectedTile: (state, action: PayloadAction<string | null>) => {
            state.selectedTile = action.payload;
        },
    },
});

export const rootStateActions = rootSlice.actions;

export default rootSlice.reducer;
