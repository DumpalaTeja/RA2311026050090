import { Request, Response, NextFunction } from 'express';
import { Log } from '../middleware/logger';

/**
 * notificationHandler wraps the controller with error handling and entry-point logging.
 */
export function notificationHandlerWrapper(
  handler: (req: Request, res: Response) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await Log('backend', 'debug', 'handler', `Entering handler for ${req.method} ${req.path}`);
      await handler(req, res);
    } catch (err: any) {
      await Log('backend', 'fatal', 'handler', `Unhandled error in handler: ${err.message}`);
      next(err);
    }
  };
}
