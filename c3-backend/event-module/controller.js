import { EventMember, EventState } from './models.js';
import { isValidRoll, REGISTRATION_DEADLINE } from './config.js';
import { runAllocation } from './allocationLogic.js';

async function checkAndRunAllocation() {
    const membersCount = await EventMember.estimatedDocumentCount();
    const deadlinePassed = new Date() > new Date(REGISTRATION_DEADLINE);

    if (deadlinePassed || membersCount >= 120) {
        const lock = await EventState.findOneAndUpdate(
            { configId: 'main', assignedTeamsAt: null },
            { assignedTeamsAt: new Date(), allocationSeed: Date.now() },
            { new: true, upsert: true }
        );
        if (lock) {
            // First one to grab the lock
            const members = await EventMember.find({});
            await runAllocation(members, lock.allocationSeed);
        }
    }
}

export const verifyRollNumber = async (req, res) => {
    try {
        const { rollNumber } = req.params;
        if (!isValidRoll(rollNumber)) return res.status(404).json({ error: 'Roll number not found.' });

        // Background trigger check
        await checkAndRunAllocation();

        const existing = await EventMember.findOne({ rollNumber });
        if (existing) {
            return res.status(200).json({
                alreadyRegistered: true,
                allocatedDomain: existing.allocatedDomain
            });
        }

        return res.status(200).json({ alreadyRegistered: false });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const register = async (req, res) => {
    try {
        const { rollNumber } = req.body;
        if (!isValidRoll(rollNumber)) return res.status(403).json({ error: 'Roll number not found.' });

        // Background trigger check
        const state = await EventState.findOne({ configId: 'main' });
        if (state && state.assignedTeamsAt) {
            return res.status(403).json({ error: 'Teams already assigned.' });
        }

        const newMember = new EventMember(req.body);
        await newMember.save();

        // Check after save
        await checkAndRunAllocation();

        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        if (err.code === 11000) {
            const existing = await EventMember.findOne({ rollNumber: req.body.rollNumber });
            res.status(200).json({
                alreadyRegistered: true,
                allocatedDomain: existing ? existing.allocatedDomain : null
            });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
};

export const manualTrigger = async (req, res) => {
    try {
        const lock = await EventState.findOneAndUpdate(
            { configId: 'main', assignedTeamsAt: null },
            { assignedTeamsAt: new Date(), allocationSeed: Date.now() },
            { new: true, upsert: true }
        );
        if (lock) {
            const members = await EventMember.find({});
            await runAllocation(members, lock.allocationSeed);
            return res.status(200).json({ message: 'Teams allocated!' });
        } else {
            return res.status(400).json({ error: 'Teams already assigned.' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Server error' });
    }
};
