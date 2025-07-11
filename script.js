
const LTC_API_KEY = "1BMHTGF-2RVM5EF-KNP118R-8ZHYRQ9";

function payWithRazorpay() {
  const email = document.getElementById("email").value;
  const options = {
    "key": "rzp_test_1234567890abcdef", // Replace with your Razorpay public key
    "amount": 20000, // 200 INR in paise
    "currency": "INR",
    "name": "Berry Store",
    "description": "Netflix Premium",
    "handler": function (response){
      alert("Payment successful! Razorpay ID: " + response.razorpay_payment_id);
    },
    "prefill": {
      "email": email
    },
    "theme": {
      "color": "#F37254"
    }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

async function payWithLTC() {
  const email = document.getElementById("email").value;
  const data = {
    price_amount: 200,
    price_currency: "inr",
    pay_currency: "ltc",
    order_id: "berry_" + Math.floor(Math.random() * 999999),
    order_description: "Netflix Premium - " + email,
    success_url: "https://thankyou.page"
  };

  try {
    const res = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": LTC_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (json.invoice_url) {
      window.location.href = json.invoice_url;
    } else {
      alert("Error: " + json.message);
    }
  } catch (err) {
    alert("Failed to create Litecoin invoice.");
  }
}
