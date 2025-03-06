const User = require('../user.js');

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { name, phone } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.name = name || user.name;
        user.phone = phone || user.phone;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
