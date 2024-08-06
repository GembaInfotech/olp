const {viewBookingList} = require("../handlers/bookingHandler/viewBookingList");
const {createBooking} = require('../handlers/bookingHandler/createBooking');
// const {incomingBookingStatus} = require('../handlers/bookingHandler/incomingBookingStatus')
const {incomingBookingStatus} = require('../handlers/bookingHandler/incomingBookingStatus')
 const {confirmBooking} = require('../handlers/bookingHandler/confirmBookingHandler')
 const {bookingStatus} = require('../handlers/bookingHandler/bookingStatus')

exports.view_booking_list = async (req, res) => {
  try {
    await viewBookingList(req, res);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.create_new_booking = async (req, res) => {
    try {
      await createBooking(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.confirm_booking = async (req, res) => {
    try {
      await confirmBooking(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };  

exports.Incoming_booking_status= async (req, res) => {
    try {
      await incomingBookingStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  exports.booking_status= async (req, res) => {
    try {
      console.log("testing------34");
      await bookingStatus(req, res);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
