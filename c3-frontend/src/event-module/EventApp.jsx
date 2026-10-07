import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EventRegister from './pages/EventRegister';
import EventAdmin from './pages/EventAdmin';

const EventApp = () => {
    return (
        <Routes>
            <Route path="register" element={<EventRegister />} />
            <Route path="admin" element={<EventAdmin />} />
            <Route path="*" element={<Navigate to="register" replace />} />
        </Routes>
    );
};

export default EventApp;
