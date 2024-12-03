import { UploadResult } from './typings';
import sharp from 'sharp';
import got from 'got';

type ImageDimensions = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  thumb_width: number;
}

const BASE_URL = 'https://e1.yotools.net';
export async function adjustForImage(uploadResult: UploadResult): Promise<ImageDimensions> {
  const imageRequest = await got.get(BASE_URL + uploadResult.uploaded_file, {
    responseType: 'buffer'
  });
  const image = sharp(imageRequest.body);
  const metadata = await image.metadata();

  const thumbRequest = await got.get(BASE_URL + uploadResult.thumb_file, {
    responseType: 'buffer'
  });
  const thumb = sharp(thumbRequest.body);

  const thumbMetadata = await thumb.metadata();
  return {
    x: thumbMetadata.width / 24,
    y: 0,
    width: (thumbMetadata.width + 33.3) || (metadata.width / 2) || 0,
    height: thumbMetadata.height || metadata.height || 0,
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    thumb_width: thumbMetadata.width || metadata.width || 0
  };
}