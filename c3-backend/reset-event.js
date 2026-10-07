import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { EventState, EventMember } from './event-module/models.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to DB. Resetting event states...');
        await EventState.deleteMany({});
        await EventMember.deleteMany({});
        console.log('Everything has been reset! Registrations are open again.');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
