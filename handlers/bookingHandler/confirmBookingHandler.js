const Booking = require('../../models/booking.model');

exports.confirmBooking = async (req, res) => {
  try {
  

    // Set status as "Incoming" and actualInTime as Date.now()
    const updateData = {
      status: "Confirmed"

    };
    const {id}  = req.params;


    // Find the booking by ID and update it with the provided data
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ success:true });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

