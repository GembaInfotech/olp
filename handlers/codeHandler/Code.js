const Code = require('../../models/codes')
exports.generateBookingCode  = async()=>{
    const code  = await Code.findOneAndUpdate(
        {},  // Empty filter to match any document
        { $inc: { booking: 1 } },  // Increment the currentCode by 1
        { new: true}    // Create the document if it doesn't exist
      ).select('booking');
    
      // Format the code and assign it to the booking
      
      const codeNumber = code.booking;
     const  bookingCode = `B${String(codeNumber).padStart(9, '0')}`;
return bookingCode;
}
exports.generateUserCode  = async()=>{
    const code  = await Code.findOneAndUpdate(
        {},  // Empty filter to match any document
        { $inc: { user: 1 } },  // Increment the currentCode by 1
        { new: true}    // Create the document if it doesn't exist
      ).select('user');
    
      // Format the code and assign it to the booking
      
      const codeNumber = code.user;
     const  codeUser = `U${String(codeNumber).padStart(9, '0')}`;
return codeUser;
}
