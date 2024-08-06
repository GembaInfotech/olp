const Booking = require('../../models/booking.model');
const format = require('date-fns');
const { generateBookingCode } = require('../codeHandler/Code');
exports.createBooking = async (req, res) => {
  try {
    const user = req?.code;
    console.log(user)
    console.log(req.body.bookingData)
   
    const {
      
      parking,
      parkingName,
      inTime,
      outTime,
      price,
      totalPrice,
      sgst,
      cgst,
      vehicle_name,
      vehicle_number,
      vehicle_type,
      transaction_id,
      order_id,
      parkingCode
     
    
    
    } = req.body.bookingData;


    const newBooking = new Booking({
      user,
      parking,
    parkingName,
    parkingCode,
      inTime ,
      outTime,
      price,
      totalPrice,
      sgst,
      cgst,
      vehicle_name,
      vehicle_number,
      vehicle_type,
      transaction_id,
      order_id
    
   
    });

    // Save the booking
    try{
      const savedBooking = await newBooking.save();
      const code = await generateBookingCode();
      savedBooking.code = code;
      await savedBooking.save();
      console.log(savedBooking)
    }
    catch (err)
    {
       console.log(err)
    }

    // Send response
    res.status(201).json({"message":true});
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
