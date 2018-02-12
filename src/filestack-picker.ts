import * as filepicker from 'filepicker-js'

import { Picture } from '@truesparrow/content-sdk-js'


export class FileStackClient {

    private readonly _key: string;

    constructor(key: string) {
        this._key = key;
    }

    selectImageWithWidget(position: number): Promise<Picture> {
        var _this = this;

        // Build the Promise flow by hand, rather using async here.
        return new Promise(
            (resolve, reject) => {
                (filepicker as any).setKey(_this._key);
                (filepicker as any).pick({
                    mimetype: 'image/*',
                    services: ['CONVERT', 'COMPUTER', 'FACEBOOK', 'DROPBOX', 'FLICKR'],
                    conversions: ['crop', 'rotate', 'filter'],
                    imageDim: [Picture.DEFAULT_WIDTH, Picture.DEFAULT_HEIGHT],
                    cropRatio: 16 / 9,
                    cropForce: true,
                    maxSize: '10485760'
                }, (blob: any) => {
                    (filepicker as any).convert(blob, {
                        width: 1600,
                        height: 900,
                        fit: 'scale',
                        format: 'jpg',
                        compress: true,
                        quality: 90,
                    }, (newBlob: any) => {
                        resolve({
                            position: position,
                            uri: newBlob.url,
                            width: Picture.DEFAULT_WIDTH,
                            height: Picture.DEFAULT_HEIGHT
                        });
                    }, (error: Error) => {
                        reject(error);
                    });
                }, (error: Error) => {
                    reject(error);
                });
            });
    }
}
