interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  image: string
  order_id: string
  handler: (response: any) => void
  prefill: {
    name: string
    email: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void
      close: () => void
    }
  }
}

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to paise
        currency,
      }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    throw error
  }
}

export const processPayment = async (
  orderData: any,
  customerInfo: {
    name: string
    email: string
    contact: string
  }
) => {
  const res = await initializeRazorpay()

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?')
    return
  }

  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'अलंकारिका',
    description: 'Traditional Jewelry Purchase',
    image: '/logo.png',
    order_id: orderData.id,
    handler: function (response: any) {
      // Handle successful payment
      console.log('Payment successful:', response)
      // You can call your API to verify payment here
      verifyPayment(response)
    },
    prefill: {
      name: customerInfo.name,
      email: customerInfo.email,
      contact: customerInfo.contact,
    },
    theme: {
      color: '#D97706', // Amber color to match the brand
    },
    modal: {
      ondismiss: function() {
        console.log('Payment cancelled')
      },
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.open()
}

const verifyPayment = async (paymentData: any) => {
  try {
    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    })

    const data = await response.json()
    
    if (data.verified) {
      // Payment verified successfully
      window.location.href = '/payment-success'
    } else {
      // Payment verification failed
      alert('Payment verification failed')
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    alert('Payment verification error')
  }
}