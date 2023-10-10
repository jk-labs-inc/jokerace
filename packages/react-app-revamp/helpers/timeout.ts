export const MAX_TIME_TO_WAIT_FOR_RPC = 30000;

export async function executeWithTimeout<T>(timeoutDuration: number, targetPromise: Promise<T>): Promise<T> {
  let timeoutPromise = new Promise<T>((_, reject) => {
    let timerId = setTimeout(() => {
      clearTimeout(timerId);
      reject(new Error(`Promise timed out after ${timeoutDuration}ms.`));
    }, timeoutDuration);
  });

  return Promise.race([targetPromise, timeoutPromise]);
}
