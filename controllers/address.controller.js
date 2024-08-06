
 const  Address =require( '../models/address.model')
const getCity = async (req, res) => {
    const {state} = req.params;
    try {
        const city = await Address.find({state: state}).select('city')
        res.status(200).json( city,
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
const getState = async (req, res) => {
    
    try {
        const state = await Address.find().select('state')
       
      

        res.status(200).json( state,
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

module.exports = {
    getCity,
    getState
  };
  