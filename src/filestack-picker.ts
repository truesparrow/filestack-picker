import * as filepicker from 'filepicker-js'

import { Image, Picture } from '@truesparrow/content-sdk-js'


export class FileStackPicker {

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
                    imageDim: [Picture.MAIN_WIDTH, Picture.MAIN_HEIGHT],
                    cropRatio: 16 / 9,
                    cropForce: true,
                    maxSize: '10485760'
                }, (blob: any) => {
                    (filepicker as any).convert(blob, {
                        width: Picture.MAIN_WIDTH,
                        height: Picture.MAIN_HEIGHT,
                        fit: 'scale',
                        format: Picture.FORMAT,
                        compress: true,
                        quality: 90,
                    }, (mainBlob: any) => {
                        (filepicker as any).convert(blob, {
                            width: Picture.THUMBNAIL_WIDTH,
                            height: Picture.THUMBNAIL_HEIGHT,
                            fit: 'scale',
                            format: Picture.FORMAT,
                            compress: true,
                            quality: 90
                        }, (thumbnailBlob: any) => {
                            const mainImage = new Image();
                            mainImage.uri = mainBlob.url;
                            mainImage.format = Picture.FORMAT;
                            mainImage.width = Picture.MAIN_WIDTH;
                            mainImage.height = Picture.MAIN_HEIGHT;
                            const thumbnailImage = new Image();
                            thumbnailImage.uri = thumbnailBlob.url;
                            thumbnailImage.format = Picture.FORMAT;
                            thumbnailImage.width = Picture.THUMBNAIL_WIDTH;
                            thumbnailImage.height = Picture.THUMBNAIL_HEIGHT;
                            const picture = new Picture();
                            picture.position = position;
                            picture.mainImage = mainImage;
                            picture.thumbnailImage = thumbnailImage;

                            resolve(picture);
                        }, (error: Error) => {
                            reject(error);
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
