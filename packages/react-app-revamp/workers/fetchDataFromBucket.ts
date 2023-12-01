import { loadFileFromBucket } from "lib/buckets";

self.onmessage = async event => {
  const { fileId } = event.data;

  try {
    const data = await loadFileFromBucket({ fileId });
    postMessage({ data });
  } catch (error) {
    postMessage({ error });
  }
};
