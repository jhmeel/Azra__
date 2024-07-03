import util from 'util';
import logger from './logger.js';

const asyncRetry = (maxRetry: number) => {
  return function retryDecorator(asyncFunc: Function) {
    return async function wrapper(...args) {
      let errorCount = 0;
      while (errorCount <= maxRetry) {
        try {
          const result = await asyncFunc(...args);
          return result;
        } catch (e) {
          errorCount += 1; 
          logger.error(`Error occurred: ${e}. Retrying ${errorCount} of ${maxRetry}...`);
          await util.promisify(setTimeout)(3000); // wait for 3 second before retrying
        }
      }
      throw new Error(`Failed after ${maxRetry} retries`); // raise error if all retries failed
    };
  };
}

export {asyncRetry}