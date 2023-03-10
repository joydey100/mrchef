// required dependencies
const express = require("express");
const cors = require("cors");

// creating server
const app = express();

// require middleware
require("dotenv").config();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/checkout", async (req, res) => {
  console.log(req.body);
  // create array, what the stripe acually wants price and quantity format
  let cartItem = [];
  const getCartItem = req.body;
  getCartItem.forEach((items) => {
    cartItem.push({
      price: items.appID,
      quantity: items.quantity,
    });
  });

  //   send to the stripe
  const session = await stripe.checkout.sessions.create({
    line_items: cartItem,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
  });

  // Calculate the total amount
  const shippingPrice = 500; // Replace with the actual shipping price in cents
  const totalAmount = session.amount_total + shippingPrice;

  // Update the checkout session with the total amount
  //   await stripe.checkout.sessions.update(session.id, {
  //     amount_total: totalAmount,
  //   });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

// run the server
app.listen(4000, () => {
  console.log(`server is running`);
});
