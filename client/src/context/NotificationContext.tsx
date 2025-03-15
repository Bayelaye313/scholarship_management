"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export type NotificationType = {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: Date;
    read: boolean;
    link?: string;
};

type NotificationContextType = {
    notifications: NotificationType[];
    unreadCount: number;
    addNotification: (notification: Omit<NotificationType, 'id' | 'date' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications doit être utilisé à l\'intérieur d\'un NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Charger les notifications depuis le localStorage au démarrage
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            const userId = session.user.id;
            const savedNotifications = localStorage.getItem(`notifications_${userId}`);

            if (savedNotifications) {
                try {
                    const parsedNotifications = JSON.parse(savedNotifications).map((n: any) => ({
                        ...n,
                        date: new Date(n.date)
                    }));
                    setNotifications(parsedNotifications);
                    setUnreadCount(parsedNotifications.filter((n: NotificationType) => !n.read).length);
                } catch (error) {
                    console.error('Erreur lors du chargement des notifications:', error);
                }
            }
        }
    }, [status, session?.user?.id]);

    // Sauvegarder les notifications dans le localStorage à chaque changement
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id && notifications.length > 0) {
            const userId = session.user.id;
            localStorage.setItem(`notifications_${userId}`, JSON.stringify(notifications));
        }
    }, [notifications, status, session?.user?.id]);

    // Mettre à jour le compteur de notifications non lues
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Ajouter une nouvelle notification
    const addNotification = (notification: Omit<NotificationType, 'id' | 'date' | 'read'>) => {
        const newNotification: NotificationType = {
            ...notification,
            id: Date.now().toString(),
            date: new Date(),
            read: false
        };

        setNotifications(prev => [newNotification, ...prev]);
    };

    // Marquer une notification comme lue
    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    // Marquer toutes les notifications comme lues
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    // Supprimer toutes les notifications
    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                clearNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext; 