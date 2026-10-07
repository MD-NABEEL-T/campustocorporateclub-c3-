import express from 'express';
import { ADMIN_PASSWORD } from './config.js';
import { verifyRollNumber, register, manualTrigger } from './controller.js';
import { EventState, EventMember } from './models.js';

const router = express.Router();

const checkAdmin = (req, res, next) => {
    const { password } = req.body;
    if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

router.get('/verify/:rollNumber', verifyRollNumber);
router.post('/register', register);

// Admin stats
router.post('/admin/stats', checkAdmin, async (req, res) => {
    const members = await EventMember.find({});
    const state = await EventState.findOne({ configId: 'main' });

    const domains = ['Frontend', 'Backend', 'UI/UX', 'AI/ML', 'Data Analytics'];
    const breakdown = {};
    domains.forEach(d => breakdown[d] = { boy: 0, girl: 0 });

    members.forEach(m => {
        if (m.allocatedDomain) breakdown[m.allocatedDomain][m.gender]++;
    });

    res.json({
        totalRegistered: members.length,
        assignedTeamsAt: state ? state.assignedTeamsAt : null,
        distribution: breakdown
    });
});

router.post('/admin/assign', checkAdmin, manualTrigger);

router.post('/admin/reset', checkAdmin, async (req, res) => {
    await EventState.deleteMany({});
    await EventMember.deleteMany({});
    res.json({ message: 'Reset successful' });
});

export default router;
