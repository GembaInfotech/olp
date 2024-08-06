

require("dotenv").config();
const express = require("express");

const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");
const vehcileRoutes = require('./routes/vehicle.route.js')
const parkingRoutes = require('./routes/parking.route.js')
const bookingRoutes = require("./routes/booking.route.js")
const vendorRoute = require('./routes/vendor.route.js')
const paymentRoute = require('./routes/paymentRoute.js')
const guardRoutes = require('./routes/guard.route.js')
const addressDetailRoute = require('./routes/AddressDetailRoute.js')
const resetPasswordRoute = require("./routes/forgetPasswordRoute.js")


const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const PORT = process.env.PORT || 4005;

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);

app.use(cors());
app.use(morgan("dev"));
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
);

app.use(express.json());
app.use(express.static("build"))
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.get("/search", decodeToken, search);

app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/resetpassword", resetPasswordRoute);

app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);
app.use("/vehicle", vehcileRoutes);
app.use("/parking", parkingRoutes)
app.use("/booking", bookingRoutes)
app.use("/vendor", vendorRoute)
app.use("/booking", paymentRoute)
app.use("/guard", guardRoutes)
app.use("/add", addressDetailRoute)




const shortid = require('shortid')
const Razorpay = require('razorpay')



const razorpay = new Razorpay({

	key_id: 'rzp_test_muLBb6gKqfrZA5',
	key_secret: 'Pr8ALVkn1EA6H7iDMqJY8yVL'
})

app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'logo.svg'))
})

app.post('/refund',  async (req,res)=>{

 const paymentId = "pay_OOUz4tZyb5bggb"; // change it to dynamically provided payment id 
 async function processRefund(paymentId) {
	try {
	  // Refund details
	  const refundDetails = {
		speed: 'normal',
		notes: {
		  notes_key_1: 'Your Refund is under processed.',
		},
		receipt: 'Receipt No. 765' // here generate a unique code such as combination of minute and date or anything else 
	  };
  
	  // Create a refund
	  const refund = await razorpay.payments.refund(paymentId, refundDetails);
	  console.log('Refund successful:', refund);
	  res.json(refund)
	} catch (error) {
	  console.error('Error processing refund:', error);
	  res.json(error)
	}
  }
  
  // Example payment ID to be refunded
  
  // Call the function to process the refund
  processRefund(paymentId);

})
app.get('/getrefund',  async (req,res)=>{

	try {
		// Fetch refunds with the given options
		const refunds = await razorpay.refunds.all();
		console.log('List of refunds:', refunds);
		res.json(refunds)
	  } catch (error) {
		console.error('Error fetching refunds:', error);
		res.json(error)
	  }

   
   })

   app.post('/payout', async (req,res)=>{
	async function createPayout() {
		try {
		  const payout = await razorpay.payouts.create({
			"account_number": "7878780080316316",
			"amount": 1000000,
			"currency": "INR",
			"mode": "NEFT",
			"purpose": "refund",
			"fund_account": {
				"account_type": "bank_account",
				"bank_account": {
					"name": "Gaurav Kumar",
					"ifsc": "HDFC0001234",
					"account_number": "1121431121541121"
				},
				"contact": {
					"name": "Gaurav Kumar",
					"email": "gaurav.kumar@example.com",
					"contact": "9876543210",
					"type": "vendor",
					"reference_id": "Acme Contact ID 12345",
					"notes": {
						"notes_key_1": "Tea, Earl Grey, Hot",
						"notes_key_2": "Tea, Earl Grey… decaf."
					}
				}
			},
			"queue_if_low_balance": true,
			"reference_id": "Acme Transaction ID 12345",
			"narration": "Acme Corp Fund Transfer",
			"notes": {
				"notes_key_1": "Beam me up Scotty",
				"notes_key_2": "Engage"
			}
		  });
		  console.log('Payout created:', payout);
		} catch (error) {
		  console.error('Error creating payout:', error);
		}
	  }

	  try {
		 const response = await createPayout();
		 res.json(response);
	  }
	  catch(err)
	  {
		res.json(err);
	  }
   })


app.post('/verification', (req, res) => {
	// do a validation
	const secret = 'Pr8ALVkn1EA6H7iDMqJY8yVL'


	const crypto = require('crypto')
  let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(body.toString())
	const digest = shasum.digest('hex')


	if (digest === req.body.response.razorpay_signature) {
		// process it
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = req.body.body
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})




process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));
