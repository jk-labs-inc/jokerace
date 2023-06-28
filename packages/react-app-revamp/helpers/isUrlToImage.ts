export function isUrlToImage(str: string) {
  return /(https[^\?]*\.(jpg|jpeg|gif|avif|webp|png|tiff|bmp)(\?(.*))?)|(https[^\?]*\?(.*)(jpg|jpeg|gif|avif|webp|png|tiff|bmp)(.*))/gim.test(
    str,
  );
}

export default isUrlToImage;
