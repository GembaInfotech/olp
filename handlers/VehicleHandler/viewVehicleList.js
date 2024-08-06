const User = require('../../models/user.model');

exports.viewVehicleList = async (req, res) => {
    const userId = req.userId
    try {
        const user = await User.findOne({_id:userId })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                data: null,
            });
        }
        const vehicleList = user.vehicle;

        res.status(200).json( vehicleList,
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null,
        });
    }
};
