// The MIT License (MIT)

// Copyright (c) 2016 Joshua Harms

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

declare module "filepicker-js" {
    export type ValidService = (
        "BOX" |
        "COMPUTER" |
        "DROPBOX" |
        "EVERNOTE" |
        "FACEBOOK" |
        "GMAIL" |
        "IMAGE_SEARCH" |
        "FLICKR" |
        "FTP" |
        "GITHUB" |
        "GOOGLE_DRIVE" |
        "SKYDRIVE" |
        "PICASA" |
        "URL" |
        "WEBCAM" |
        "INSTAGRAM" |
        "VIDEO" |
        "AUDIO" |
        "ALFRESCO" |
        "CUSTOMSOURCE" |
        "CLOUDDRIVE" |
        "IMGUR" |
        "CLOUDAPP" |
        "CONVERT"
    );

    export type Conversion = (
        'crop' |
        'rotate' |
        'filter'
    )

    export interface IWebcam {
        videoRes: string;
        audioLen: string;
        videoLen: string;
    }

    // Documentation: https://www.filestack.com/docs/file-ingestion/javascript-api/pick
    export interface IPickOptions {
        mimetype?: string;
        mimetypes?: string[];
        extension?: string;
        extensions?: string[];
        /**
         * Limit uploads to be at most maxSize, specified in bytes. By default file size is not limited. For example, to make sure files are all less than 10MB, use "10485760" (10*1024*1024).
         */
        maxSize?: number;
        container?: "modal" | "window" | string;
        language?: string;
        service?: ValidService;
        services?: ValidService[];
        openTo?: ValidService;

        webcamDim?: number[];

        webcam?: IWebcam;

        customSourceContainer?: string;

        customSourcePath?: string;


        /**
         * Useful when developing, makes it so the onSuccess callback is fired immediately with dummy data.
         */
        debug?: boolean;

        //policy: string;

        //signature: string;

        /**
         * Background uploads are available in multiple mode. Uploads will start immediately after the user selects a file. By default this is set to true.
         */
        backgroundUpload?: boolean;

        /**
         * Hides the modal immediately after file is selected. The upload will continue in the background and progress callbacks will continue to be fired as the upload happens. By default this is set to false. Works only for modal mode.
         */
        hide?: boolean;
        /**
         * Allow to set custom css file url per dialog instance. You can set this option also in developer portal for all application integrations. CustomCss is a Filestack add-on and is not included in basic plans by default.
         */
        customCss?: string;
        /**
         * Allows a user to provide their own text for the Filestack dialog. Url should use https protocol.
         */
        customText?: string;
        /**
         * Specify the image quality/compression ratio. Range 0 - 100. 100% quality = 0 compression. By default there is no compression. Works only for jpeg images.
         */
        imageQuality?: number;
        /**
         * Specify image dimenions. e.g. : {imageDim: [800, 600]}. Local images will be resized (upscaled or downscaled) to the specified dimensions before uploading. The original height to width ratio is maintained. To resize all images based on the width, set [width, null], eg. [800, null]. For the height set [null, height], eg [null, 600].
         */
        imageDim?: number[];
        /**
         * Specify maximum image dimenions. e.g. : {imageMax: [800, 600]}. Images bigger than the specified dimensions will be resized to the max size.
         */
        imageMax?: number[];
        /**
         * Specify minimum image dimenions. e.g. : {imageMin: [800, 600]}. Images smaller than the specified dimensions will be upscaled to the minimum size.
         */
        imageMin?: number[];
        /**
         * When used in conjunction with the 'CONVERT' service, the conversions array allows you to specify what functions are available in the UI for the user. Include 'crop' to allow the user to crop an image, include 'rotate' to allow a user to rotate the uploaded image left or right, include filter to allow user to blur or sharpen the uploaded image. You can include all the services or a selection of the three. If 'CONVERT' is specified, but no conversions are set, the default behavior is to display the cropping tool only.
         */
        conversions?: Conversion[];
        /**
         * Specify the crop area height to width ratio. This can be a float, an integer or a ratio like 4/3 or 16/9. By default it is not specifed.
         */
        cropRatio?: number;
        /**
         * Specify a crop area with fixed dimenions. e.g. : {cropDim: [800, 600]}. The user will only be allowed to move the crop area. If the image is smaller than the specified dimensions the crop area will fill the image.
         */
        cropDim?: number[];
        /**
         * Specify the maximum dimensions of the crop area. e.g. : {cropMax: [800, 600]}. If the image is smaller than the specified dimensions it won't be applied. Can be used in conjunction with cropRatio and cropMin.
         */
        cropMax?: number[];
        /**
         * Specify crop area minimum dimensions. e.g. : {cropMin: [400, 300]}. Can be used together with cropMax and cropRatio
         */
        cropMin?: number[];
        /**
         * If set to true, the user will have to crop all images before uploading them. This works for both single and multiple files mode but no if 'hide' option is set to true. By default set to false.
         */
        cropForce?: boolean;
    }

    export interface IMultiPickOptions extends IPickOptions {
        /**
         * Specify the maximum number of files that the user can upload at a time. If the user tries to upload more than this, they will be presented with an error message. By default, there is no cap on the number of files.
         */
        maxFiles?: number;
        /**
         * Indicate that users should be able to drop entires folders worth of files at a time. Due to browser support, this is currently only available in recent versions of Chrome. This parameter only applies when multiple is set to be true. By default, folders are not allowed (false). Only available for premium accounts.
         */
        folders?: boolean;
    }

    export interface IPickAndStoreOptions extends IMultiPickOptions {

        /**
         * Where to store the file. The default is S3. Other options are 'azure', 'dropbox', 'rackspace' and 'gcs'. You must have configured your storage in the developer portal to enable this feature. Rackspace, Azure, Dropbox and Google Cloud are only available on the Grow and higher plans.
         */
        location?: "S3" | "azure" | "dropbox" | "rackspace" | "gcs";

        /**
         * The path to store the file at within the specified file store. For S3, this is the key where the file will be stored at. By default, Filestack stores the file at the root at a unique id, followed by an underscore, followed by the filename, for example "3AB239102DB_myphoto.png".
         *
         * If the provided path ends in a '/', it will be treated as a folder, so if the provided path is "myfiles/" and the uploaded file is named "myphoto.png", the file will be stored at "myfiles/909DFAC9CB12_myphoto.png", for example.
         *
         * If the multiple option is set to be true, only paths that end in '/' are allowed.
         */
        path?: string;

        /**
         * The bucket or container in the specified file store where the file should end up. This is especially useful if you have different containers for testing and production and you want to use them both on the same Filestack app. If this parameter is omitted, the file is stored in the default container specified in your developer portal.
         */
        storeContainer?: string;

        /**
         * The region where your storage container is located. This setting currently applies only to S3 buckets.
         */
        storeRegion?: string;

        /**
         * Specify that the user can upload multiple files, akin to pickMultiple.
         */
        multiple?: boolean;
        /**
         * Indicates that the file should be stored in a way that allows public access going directly to the underlying file store. For instance, if the file is stored on S3, this will allow the S3 url to be used directly. This has no impact on the ability of users to read from the Filestack file URL. Defaults to 'private'.
         */
        access?: "public" | "private";
    }

    export interface FileBlob {
        /**
         * The core Filestack url on which all other operations are based.
         */
        url: string;
        /**
         * The filename of the uploaded file.
         */
        filename: string;
        /**
         * The mimetype of the uploaded file.
         */
        mimetype: string;
        /**
         * The size fo the uploaded file in bytes, if available.
         */
        size: number;
        /**
         * The s3 key where we have stored the file.
         */
        key?: string;
        /**
         * Whether the file can be written to using filpicker.write
         */
        isWriteable: boolean;
    }

    export interface ProgressData {
        progress: number;
        filename: string;
        mimetype: string;
        size: number;
    }

    export interface IStatOptions {
        size?: boolean,
        mimetype?: boolean,
        filename?: boolean,
        width?: boolean,
        height?: boolean,
        uploaded?: boolean,
        writeable?: boolean,
        md5?: boolean,
        location?: boolean,
        path?: boolean,
        container?: boolean,
        security?: Object;
    }

    export interface IMetadata {
        size?: number,
        mimetype?: string,
        filename?: string,
        width?: number,
        height?: number,
        uploaded?: boolean,
        writeable?: boolean,
        md5?: string,
        location?: string,
        path?: string,
        container?: string,
        security?: Object;
    }

    export interface IStoreOptions {
        filename?: string;
        mimetype?: string;
        location?: "S3" | "azure" | "dropbox" | "rackspace" | "gcs";
        path?: string;
        container?: string;
        storeRegion?: string;
        access?: string;
        base64decode?: boolean;
        security?: Object;
    }

    //TODO: add security object

    export interface IFilepicker {

        /**
         * Sets the API Key
         */
        setKey(key: string): void;

        /**
         * Gets file metadata
         */
        stat(blob: FileBlob, options: IStatOptions, onSuccess: (metadata: IMetadata) => void, onError: (error: Error) => void): void;
        /**
         *
         * @param input The data to store, or an object that holds the data. Can be raw data, a Blob, a DOM File Object, or an <input type="file"/>
         * @param options
         * @param onSuccess
         * @returns void
         */
        store(input: Object, options: IStoreOptions, onSuccess: (blob: FileBlob) => void, onError: (error: Error) => void, onProgress: (data: ProgressData) => void): void;

        /**
         * Select and upload a file.
         */
        pick(options: IPickOptions, onSuccess: (blob: FileBlob) => void, onError: (error: Error) => void, onProgress: (data: ProgressData) => void): void;

        /**
         * Select and upload multiple files at the same time.
         */
        pickMultiple(options: IMultiPickOptions, onSuccess: (blobs: FileBlob[]) => void, onError: (error: Error) => void, onProgress: (data: ProgressData) => void): void;

        /**
         * Select and upload multiple files straight to your chosen service.
         */
        pickAndStore(pickOptions: IPickAndStoreOptions, storeOptions: IStoreOptions, onSuccess: (blobs: FileBlob[]) => void, onError: (error: Error) => void, onProgress: (data: ProgressData) => void): void;

        /**
         *
         * @param blob A Blob pointing to the file you'd like to remove.
         * @param security_options An optional dictionary of key-value pairs that configure the remove
         * @param onSuccess The function to call if the remove is successful. There are no parameters passed to the callback.
         * @param onError The function to call if there is an error when removing the file.
         * @returns {}
         */
        remove(blob: FileBlob, security_options: Object, onSuccess: (blobs: FileBlob) => void, onError: (error: Error) => void): void;

        /**
         *
         * @param blob A Blob pointing to the file you'd like to write to.
         * @param security_options An optional dictionary of key-value pairs that configure the remove
         * @param onSuccess The function to call if the remove is successful. There are no parameters passed to the callback.
         * @param onError The function to call if there is an error when removing the file.
         * @param onProgress The progress of the write operation.
         * @returns {}
         */
        write(target: FileBlob, data: Object, security_options: Object, onSuccess: (blob: FileBlob) => void, onError: (error: Error) => void, onProgress: (data: ProgressData) => void): void;
    }
}
