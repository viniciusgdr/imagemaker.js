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
export async function adjustForImage(uploadResult: UploadResult, thumbWidth: number, thumbHeight: number): Promise<ImageDimensions> {
  const [imageRequest, thumbRequest] = await Promise.all([
    got.get(BASE_URL + uploadResult.uploaded_file, { responseType: 'buffer' }),
    got.get(BASE_URL + uploadResult.thumb_file, { responseType: 'buffer' })
  ]);
  const image = sharp(imageRequest.body);
  const thumb = sharp(thumbRequest.body);

  const metadata = await image.metadata();
  const thumbMetadata = await thumb.metadata();

  // O corte será feito da parte esquerda da imagem (x=0)
  const xOffset = 0;
  const yOffset = 0; // O corte começa do topo da imagem (sem deslocamento vertical)

  // A altura da miniatura é fixada no valor de thumbHeight (300px)
  const finalHeight = thumbMetadata.height;

  // A proporção da imagem original
  const aspectRatio = metadata.width / metadata.height;  // Proporção original da imagem

  // Calcular a largura proporcional com base na altura fixada
  const scaledWidth = Math.round(finalHeight * aspectRatio);

  // Se a largura calculada exceder o valor de thumbWidth (400px), ajusta para thumbWidth
  const finalWidth = scaledWidth > thumbWidth ? thumbWidth : scaledWidth;

  return {
    x: xOffset,
    y: yOffset,
    width: finalWidth,  // Largura da miniatura
    height: thumbMetadata.height,  // Altura da miniatura
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    thumb_width: thumbMetadata.width || metadata.width || 0
  };
}