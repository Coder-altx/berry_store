const LTC_API_KEY = "1BMHTGF-2RVM5EF-KNP118R-8ZHYRQ9";

function payWithRazorpay() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Please enter your email before proceeding.");

  const options = {
    "key": "rzp_test_1234567890abcdef", // Replace with your real Razorpay key
    "amount": 20000, // ₹200 in paise
    "currency": "INR",
    "name": "Berry Store",
    "description": "Netflix Premium",
    "handler": function (response) {
      alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);
    },
    "prefill": {
      "email": email
    },
    "method": {
      upi: true,        // ✅ Show UPI option
      card: false,
      netbanking: false,
      wallet: false
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
  if (!email) return alert("Please enter your email before proceeding.");

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
      alert("❌ Error: " + (json.message || "Failed to create invoice"));
    }
  } catch (err) {
    alert("❌ Failed to create Litecoin invoice. Please try again later.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("upiPayBtn").addEventListener("click", payWithRazorpay);
  document.getElementById("ltcPayBtn").addEventListener("click", payWithLTC);
});
