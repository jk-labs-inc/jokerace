import Jimp from 'jimp';

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

interface QueueMessage {
	key: string;
}

async function resizeImage(imageData: ArrayBuffer, width: number, height: number): Promise<ArrayBuffer> {
	const image = await Jimp.read(imageData);
	image.resize(width, height, Jimp.RESIZE_BEZIER);
	const quality = 80;
	return await image.quality(quality).getBufferAsync(Jimp.MIME_JPEG);
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'POST') {
			const { key } = (await request.json()) as QueueMessage;
			await env.IMAGE_QUEUE.send(JSON.stringify({ key }));
			return new Response('Image queued for processing', { status: 202 });
		}
		return new Response('Send a POST request with a key to process an image');
	},

	async queue(batch: MessageBatch<string>, env: Env, ctx: ExecutionContext): Promise<void> {
		for (const message of batch.messages) {
			const { key } = JSON.parse(message.body) as QueueMessage;

			try {
				const r2Object = await env.MY_BUCKET.get(key);
				if (!r2Object) {
					console.error('Object not found:', key);
					continue;
				}

				const imageData = await r2Object.arrayBuffer();

				for (const [size, dimensions] of Object.entries(SIZES)) {
					const { width, height } = dimensions;

					const resizedImageData = await resizeImage(imageData, width, height);

					await env.MY_BUCKET.put(`${key}-${size}`, resizedImageData, {
						httpMetadata: {
							contentType: 'image/jpeg',
						},
					});
				}

				console.log('Image processed successfully:', key);
			} catch (error) {
				console.error('Error processing message:', error);
			}
		}
	},
};
