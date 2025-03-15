"use client";

import React from 'react';
import { NotificationProvider as NotificationContextProvider } from '../context/NotificationContext';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    return (
        <NotificationContextProvider>
            {children}
        </NotificationContextProvider>
    );
} 