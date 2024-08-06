const { differenceInHours, format } = require('date-fns');
const BookingModel = require('../../models/booking.model');
const Razorpay = require('razorpay');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: 'rzp_test_muLBb6gKqfrZA5',
  key_secret: 'Pr8ALVkn1EA6H7iDMqJY8yVL'
});

exports.bookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const now = new Date();
    const inTime = new Date(booking.inTime);

    // Calculate the difference in hours
    const hoursDifference = differenceInHours(inTime, now);

    if (hoursDifference >= 3) {
      try {
        booking.status = 'Cancelled';
        booking.cancelledAt = format(now, "yyyy-MM-dd'T'HH:mm");
        await booking.save();

        // Process refund
        const refundResult = await processRefund(booking);
        if (refundResult.error) {
          return res.status(500).json({ error: "Failed to process refund", details: refundResult.error });
        }

        res.status(200).json({
          message: "Booking status updated and refund processed successfully",
          data: booking,
          refund: refundResult
        });
      } catch (err) {
        res.status(500).json({ error: "Failed to update booking status or process refund", details: err });
      }
    } else {
      res.status(400).json({ message: "You can cancel your booking only before 3 hours of your inTime" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const processRefund = async (booking) => {
  try {
    // Refund details
    const refundDetails = {
      speed: 'normal',
      notes: {
        notes_key_1: 'Your Refund is under processed.',
      },
      receipt: `Receipt No. ${format(new Date(), "mmssddMMyyyy")}` // unique receipt code
    };

    // Create a refund
    const refund = await razorpay.payments.refund(booking.transaction_id, refundDetails);
    booking.refundId = refund.id;
    await booking.save();
    console.log('Refund successful:', refund);
    return refund;
  } catch (error) {
    console.error('Error processing refund:', error);
    return { error };
  }
};
