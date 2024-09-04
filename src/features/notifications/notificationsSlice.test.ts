import notificationsReducer, { addNotification, removeNotification, type NotificationsState, type Notification } from './notificationsSlice';

describe('notificationsSlice', () => {
    const initialState: NotificationsState = { notifications: [] };

    it('should handle addNotification', () => {
        const notification: Notification = {
            id: '1',
            message: 'New notification!',
            timestamp: new Date().toISOString(),
        };

        const newState = notificationsReducer(initialState, addNotification(notification));

        expect(newState.notifications).toContain(notification);
        expect(newState.notifications).toHaveLength(1);
    });

    it('should handle removeNotification', () => {
        const initialStateWithNotification: NotificationsState = {
            notifications: [
                {
                    id: '1',
                    message: 'New notification!',
                    timestamp: new Date().toISOString(),
                }
            ]
        };

        const newState = notificationsReducer(initialStateWithNotification, removeNotification('1'));

        expect(newState.notifications).toHaveLength(0);
    });
});
