"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications, NotificationType } from '../../context/NotificationContext';
import { BellIcon, BellAlertIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleNotificationClick = (notification: NotificationType) => {
        markAsRead(notification.id);
    };

    // Formater la date relative (aujourd'hui, hier, etc.)
    const formatRelativeDate = (date: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffDays = Math.floor((today.getTime() - notifDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Aujourd'hui à ${format(date, 'HH:mm')}`;
        } else if (diffDays === 1) {
            return `Hier à ${format(date, 'HH:mm')}`;
        } else if (diffDays < 7) {
            return date.toLocaleDateString('fr-FR', { weekday: 'long' });
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };

    // Obtenir l'icône en fonction du type de notification
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <div className="bg-green-100 p-2 rounded-full"><CheckCircleIcon className="h-5 w-5 text-green-600" /></div>;
            case 'warning':
                return <div className="bg-yellow-100 p-2 rounded-full"><BellAlertIcon className="h-5 w-5 text-yellow-600" /></div>;
            case 'error':
                return <div className="bg-red-100 p-2 rounded-full"><XMarkIcon className="h-5 w-5 text-red-600" /></div>;
            case 'info':
            default:
                return <div className="bg-blue-100 p-2 rounded-full"><BellIcon className="h-5 w-5 text-blue-600" /></div>;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Notifications"
            >
                <BellIcon className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 max-h-[80vh] overflow-y-auto">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Notifications</h3>
                            <div className="flex space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Tout marquer comme lu
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearNotifications}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Effacer tout
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                Aucune notification
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                                >
                                    {notification.link ? (
                                        <Link
                                            href={notification.link}
                                            onClick={() => handleNotificationClick(notification)}
                                            className="block"
                                        >
                                            <NotificationItem notification={notification} />
                                        </Link>
                                    ) : (
                                        <div onClick={() => handleNotificationClick(notification)}>
                                            <NotificationItem notification={notification} />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Composant pour un élément de notification individuel
function NotificationItem({ notification }: { notification: NotificationType }) {
    // Obtenir l'icône en fonction du type de notification
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <div className="bg-green-100 p-2 rounded-full"><CheckCircleIcon className="h-5 w-5 text-green-600" /></div>;
            case 'warning':
                return <div className="bg-yellow-100 p-2 rounded-full"><BellAlertIcon className="h-5 w-5 text-yellow-600" /></div>;
            case 'error':
                return <div className="bg-red-100 p-2 rounded-full"><XMarkIcon className="h-5 w-5 text-red-600" /></div>;
            case 'info':
            default:
                return <div className="bg-blue-100 p-2 rounded-full"><BellIcon className="h-5 w-5 text-blue-600" /></div>;
        }
    };

    // Formater la date relative (aujourd'hui, hier, etc.)
    const formatRelativeDate = (date: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffDays = Math.floor((today.getTime() - notifDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return `Aujourd'hui à ${format(date, 'HH:mm')}`;
        } else if (diffDays === 1) {
            return `Hier à ${format(date, 'HH:mm')}`;
        } else if (diffDays < 7) {
            return date.toLocaleDateString('fr-FR', { weekday: 'long' });
        } else {
            return format(date, 'dd/MM/yyyy');
        }
    };

    return (
        <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
                <p className="font-medium">{notification.title}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeDate(notification.date)}
                </p>
            </div>
            {!notification.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
        </div>
    );
} 