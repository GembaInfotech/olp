
const Booking = require('../../models/booking.model')

exports.viewBookingList = async (req, res) => {
  try {
    const user = req.code
    console.log(req.userId)

    const bookings = await Booking.find({user});
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking data',
      error: error.message
    });
  }
};
