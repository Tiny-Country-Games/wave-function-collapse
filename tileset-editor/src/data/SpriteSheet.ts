export default class SpriteSheet {
    static splitImage(imageDataURL: string, tileWidth: number, tileHeight: number): Promise<string[][]> {
        return new Promise<string[][]>((resolve) => {
            const cutImage = (image: HTMLImageElement) => {
                const tilesWidth = Math.floor(image.width / tileWidth);
                const tilesHeight = Math.floor(image.height / tileHeight);
                const tiles: string[][] = new Array(tilesHeight);
                for (let row = 0; row < tilesHeight; row++) {
                    tiles[row] = new Array(tilesWidth);
                    for (let col = 0; col < tilesWidth; col++) {
                        const canvas = document.createElement('canvas');
                        canvas.width = tileWidth;
                        canvas.height = tileHeight;
                        const context = canvas.getContext('2d');
                        context?.drawImage(image, col * tileWidth, row * tileHeight, tileWidth, tileHeight, 0, 0, canvas.width, canvas.height);
                        tiles[row][col] = canvas.toDataURL();
                    }
                }
                resolve(tiles);
            };
            const image = new Image();
            image.onload = () => cutImage(image);
            image.src = imageDataURL;
        });
    }
}
