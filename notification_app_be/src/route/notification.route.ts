import { Router } from 'express';
import { getNotifications } from '../controller/notification.controller';
import { notificationHandlerWrapper } from '../handler/notification.handler';

const router = Router();

// GET /api/notifications?notification_type=Placement&page=1&limit=10
router.get('/', notificationHandlerWrapper(getNotifications));

export default router;
