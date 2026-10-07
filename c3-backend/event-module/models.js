import mongoose from 'mongoose';

const eventMemberSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['boy', 'girl'], required: true },
    ranking: { type: [String], required: true }, // [1st choice, 2nd, 3rd, 4th, 5th]
    allocatedDomain: { type: String, default: null }
}, { timestamps: true });

export const EventMember = mongoose.model('event_member', eventMemberSchema);

const eventStateSchema = new mongoose.Schema({
    configId: { type: String, default: 'main', unique: true },
    assignedTeamsAt: { type: Date, default: null }, // Null means not locked yet
    allocationSeed: { type: Number, default: null }
});

export const EventState = mongoose.model('event_state', eventStateSchema);
