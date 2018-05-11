import * as filestack from 'filestack-js'

import { Image, Picture, PictureSet } from '@truesparrow/content-sdk-js'


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
        // TODO: figure out a nicer interface than this callback. Perhaps return Promise<{count: number}, Promise<Picture[]>>?
        TRUESPARROW_SELECT_IMAGE: (key: string, position: number, onImagesSelected?: (count: number) => void) => Promise<Picture[]>;
    }
}

window.TRUESPARROW_SELECT_IMAGE = window.TRUESPARROW_SELECT_IMAGE || ((key: string, basePosition: number, onImagesSelected?: (count: number) => void) => {
    return new Promise(
        (resolve, reject) => {
            const client = (filestack as any).default.init(key);
            client
                .pick({
                    fromSources: ["local_file_system", "facebook", "instagram", "picasa", "flickr", "dropbox", "googledrive", "box"],
                    accept: ["image/*"],
                    lang: 'en',
                    maxFiles: PictureSet.MAX_NUMBER_OF_PICTURES,
                    transformations: {
                        crop: {
                            force: true,
                            aspectRatio: 1.778
                        },
                        rotate: true
                    },
                    maxSize: 10485760
                })
                .then((res: any) => {
                    if (onImagesSelected != undefined) {
                        onImagesSelected(res.filesUploaded.length);
                    }

                    Promise
                        .all<Picture>(res.filesUploaded.map((fi: any, index: number) => processOneImage(client, fi.url, basePosition + index)))
                        .then(pictures => resolve(pictures))
                        .catch((err: any) => reject(err));
                })
                .catch((err: any) => reject(err));
        });

    function processOneImage(client: any, url: string, newPosition: number): Promise<Picture> {
        return new Promise(
            (resolve, reject) => {
                const mainSizeUri = client.transform(url, {
                    resize: {
                        width: Picture.MAIN_WIDTH,
                        height: Picture.MAIN_HEIGHT,
                        fit: 'scale',
                    },
                    output: {
                        format: Picture.FORMAT,
                        compress: true,
                        quality: 90
                    }
                });

                client
                    .storeURL(mainSizeUri)
                    .then((mainRes: any) => {
                        const thumbnailSizeUri = client.transform(url, {
                            resize: {
                                width: Picture.THUMBNAIL_WIDTH,
                                height: Picture.THUMBNAIL_HEIGHT,
                                fit: 'scale',
                            },
                            output: {
                                format: Picture.FORMAT,
                                compress: true,
                                quality: 90
                            }
                        });

                        client
                            .storeURL(thumbnailSizeUri)
                            .then((thumbnailRes: any) => {
                                const mainImage = new Image();
                                mainImage.uri = mainRes.url;
                                mainImage.format = Picture.FORMAT;
                                mainImage.width = Picture.MAIN_WIDTH;
                                mainImage.height = Picture.MAIN_HEIGHT;
                                const thumbnailImage = new Image();
                                thumbnailImage.uri = thumbnailRes.url;
                                thumbnailImage.format = Picture.FORMAT;
                                thumbnailImage.width = Picture.THUMBNAIL_WIDTH;
                                thumbnailImage.height = Picture.THUMBNAIL_HEIGHT;
                                const picture = new Picture();
                                picture.position = newPosition;
                                picture.mainImage = mainImage;
                                picture.thumbnailImage = thumbnailImage;

                                resolve(picture);
                            })
                            .catch((err: any) => reject(err));
                    })
                    .catch((err: any) => reject(err));
            });
    }
});


export class FileStackPicker {

    private readonly _key: string;

    constructor(key: string) {
        this._key = key;
    }

    selectImageWithWidget(basePosition: number, onImagesSelected?: (count: number) => void): Promise<Picture[]> {
        return window.TRUESPARROW_SELECT_IMAGE(this._key, basePosition, onImagesSelected);
    }
}
