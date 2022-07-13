export function isUrlToImage(str: string) {
  return str.match(/^https[^\?]*.(jpg|jpeg|gif|avif|webp|png|tiff|bmp)(\?(.*))?$/gim) !== null;
}

export default isUrlToImage;
