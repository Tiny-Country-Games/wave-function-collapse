import {useAppSelector} from "../../hooks/redux";
import {useEffect, useState} from "react";
import {Image as Img, ImageProps} from "react-bootstrap";
import styles from './TilePreview.module.scss';

type TilePreviewProps = Omit<ImageProps, 'src'> &  {
    tile: string;
};
const TilePreview = (props: TilePreviewProps) => {
    const {tile, ...imageProps} = props;
    const tileset = useAppSelector(state => state.root.tileset!);
    const tilesData = useAppSelector(state => state.root.tileData!);

    const [imageData, setImageData] = useState<string | null>(null);

    const loadTile = async () => {
        const tileData = tileset.tiles[tile];
        if (!tileData) return;
        const images = await Promise.all<HTMLImageElement>(tileData.draw.map(({r, c}) => new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.src = tilesData[r][c];
        })));
        const canvas = document.createElement('canvas');
        canvas.width = tileset.tileWidth;
        canvas.height = tileset.tileHeight;
        const context = canvas.getContext('2d')!;
        images.forEach(image => context.drawImage(image, 0, 0));
        setImageData(canvas.toDataURL());
    };

    useEffect(() => {
        loadTile().then();
    }, [tile, tileset])

    if (!tileset.tiles[tile]) return null;

    if (imageData === null) return null;

    return (
        <Img
            src={imageData}
            {...imageProps}
            className={`${styles.TilePreview}${imageProps.className ? ` ${imageProps.className}` : ''}`}
        />
    );

};

export default TilePreview;
