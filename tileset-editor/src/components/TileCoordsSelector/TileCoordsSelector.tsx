import {Image, Table} from "react-bootstrap";

import styles from './TileCoordsSelector.module.scss';

declare global {
    namespace TileCoordsSelector {
        type TileCoordsSelectorProps = {
            tiles: string[][];
            value: RowCol | null;
            onChange?: (value: RowCol | null) => void;
            onDoubleClickTile?: (value: RowCol) => void;
            isTileAllowed?: (value: RowCol) => boolean;
        }
    }
}

const TileCoordsSelector = (props: TileCoordsSelector.TileCoordsSelectorProps) => {
    const {
        value,
        tiles,
        onChange,
        onDoubleClickTile,
        isTileAllowed,
    } = props;

    const isTileSelected = (r: number, c: number) => value?.r === r && value?.c === c;

    const allowTile = (r: number, c: number) => {
        if (isTileAllowed) return isTileAllowed({r, c});
        return true;
    }

    const onTileClick = (r: number, c: number) => {
        if (!allowTile(r, c)) return;
        if (isTileSelected(r, c)) {
            onDoubleClickTile?.({r, c});
        } else {
            onChange?.({r, c});
        }
    }

    return (
        <Table bordered>
            <tbody>
            {tiles.map((row, r) => (
                <tr key={r}>
                    {row.map((tile, c) => {
                        const tdClasses = [
                            'p-0',
                            'checkerboard-bg',
                            ...(isTileSelected(r, c) ? [
                                styles.SelectedTile,
                            ] : []),
                        ];
                        const imageClasses = [
                            'w-100',
                            'h-100',
                            styles.TileCoordsSelectorTile,
                            ...(allowTile(r, c) ? [] : [styles.TileCoordsSelectorTileNotAllowed]),
                        ];
                        return (
                            <td
                                key={c}
                                className={tdClasses.join(' ')}
                                onClick={() => onTileClick(r, c)}
                            >
                                <Image
                                    src={tile}
                                    alt={`Tile in row ${r}, column ${c}`}
                                    className={imageClasses.join(' ')}
                                />
                            </td>
                        );
                    })}
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default TileCoordsSelector;
