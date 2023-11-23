export function isUrlToImage(str: string) {
  const hasImgTag = /<img\s+[^>]*src="[^"]*"[^>]*>/i.test(str);
  return hasImgTag;
}

export default isUrlToImage;
