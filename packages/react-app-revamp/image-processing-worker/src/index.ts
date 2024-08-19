import * as _Jimp from 'jimp';

// @ts-ignore
const Jimp = typeof self !== 'undefined' ? self.Jimp || _Jimp : _Jimp;

interface Sizes {
	[key: string]: { width: number; height: number };
}

const SIZES: Sizes = {
	medium: { width: 600, height: 400 },
	thumbnail: { width: 200, height: 200 },
};

export interface Env {
	MY_BUCKET: R2Bucket;
	IMAGE_QUEUE: Queue;
}

interface R2ObjectInfo {
	key: string;
	size: number;
	eTag: string;
}

interface R2Event {
	account: string;
	bucket: string;
	object: R2ObjectInfo;
	action: string;
	eventTime: string;
}

async function resizeImage(imageData: ArrayBuffer, maxWidth: number, maxHeight: number): Promise<ArrayBuffer> {
	try {
		const image = await Jimp.read(imageData);
		const originalWidth = image.getWidth();
		const originalHeight = image.getHeight();

		// Calculate aspect ratio
		const aspectRatio = originalWidth / originalHeight;

		// Calculate new dimensions
		let newWidth = maxWidth;
		let newHeight = maxHeight;

		if (aspectRatio > 1) {
			// Image is wider than it is tall
			newHeight = Math.round(newWidth / aspectRatio);
			if (newHeight > maxHeight) {
				newHeight = maxHeight;
				newWidth = Math.round(newHeight * aspectRatio);
			}
		} else {
			// Image is taller than it is wide
			newWidth = Math.round(newHeight * aspectRatio);
			if (newWidth > maxWidth) {
				newWidth = maxWidth;
				newHeight = Math.round(newWidth / aspectRatio);
			}
		}

		image.resize(newWidth, newHeight, Jimp.RESIZE_BEZIER);
		const quality = 80;
		return await image.quality(quality).getBufferAsync(Jimp.MIME_JPEG);
	} catch (error) {
		console.error('Error resizing image:', error);
		throw error;
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'POST') {
			try {
				const body = await request.json();
				await env.IMAGE_QUEUE.send(body);
				return new Response('Event queued for processing', { status: 202 });
			} catch (error) {
				return new Response('Error processing request', { status: 500 });
			}
		}
		return new Response('Send a POST request with R2 event data to process an image');
	},

	async queue(batch: MessageBatch<R2Event>, env: Env, ctx: ExecutionContext): Promise<void> {
		for (const message of batch.messages) {
			const event: R2Event = message.body;
			const key = event.object.key;

			if (Object.keys(SIZES).some((size) => key.includes(`-${size}`))) {
				continue;
			}

			try {
				const r2Object = await env.MY_BUCKET.get(key);
				if (!r2Object) {
					console.error('Object not found:', key);
					continue;
				}

				const imageData = await r2Object.arrayBuffer();

				await Promise.all(
					Object.entries(SIZES).map(async ([size, dimensions]) => {
						const { height, width } = dimensions;
						const resizedImageData = await resizeImage(imageData, width, height);
						const newKey = `${key.replace(/\.[^/.]+$/, '')}-${size}`;
						await env.MY_BUCKET.put(newKey, resizedImageData, {
							httpMetadata: {
								contentType: 'image/jpeg',
							},
						});
					}),
				);
			} catch (error) {
				console.error('Error processing image:', error);
			}
		}
	},
};
