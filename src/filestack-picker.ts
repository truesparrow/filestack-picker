import * as filepicker from 'filepicker-js'

import { Image, Picture } from '@truesparrow/content-sdk-js'


/**
 Some deep lore happening here.
 We declare a global function TRUESPARROW_SELECT_IMAGE, which does the whole logic of
 invoking the filepicker API and massaging the whole flow to fit what truesparrow needs.
 For end-to-end testing purposes it's hard to rely on filepicker though. So we need
 to stub it out. Turns out the best way in cypress is to mock the actual selection
 function - that is TRUESPARROW_SELECT_IMAGE needs to be replaced with something which
 _does not_ invoke filepicker, but instead returns some ready made data.
 Given the way webpack bundles things, having everything in {@link FileStackPicker}
 would not work. We need to add something at the global/window level, which {@link FileStackPicker}
 will invoke, but which can be replaced by something else by running code.
 */

declare global {
    interface Window {
        TRUESPARROW_SELECT_IMAGE: (key: string, position: number) => Promise<Picture>;
    }
}

window.TRUESPARROW_SELECT_IMAGE = (key: string, position: number) => {
    return new Promise(
        (resolve, reject) => {
            (filepicker as any).setKey(key);
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
};


export class FileStackPicker {

    private readonly _key: string;

    constructor(key: string) {
        this._key = key;
    }

    selectImageWithWidget(position: number): Promise<Picture> {
        return window.TRUESPARROW_SELECT_IMAGE(this._key, position);
    }
}
