// components/PaystackInline.tsx
import { useEffect } from 'react'

declare global {
  interface Window {
    PaystackPop: any
  }
}

type Props = {
  email: string
  amount: number // kobo
  reference: string
  onSuccess: (ref: string) => void
  onClose?: () => void
}

export default function PaystackInline({ email, amount, reference, onSuccess, onClose }: Props) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  const pay = () => {
    const handler = window.PaystackPop.setup({
      key: 'pk_test_5ff3a56850dc08f3e340cd4c7c8060ba417c6fa5',
      email,
      amount,
      currency: 'NGN',
      reference,
      callback: (response: any) => {
        onSuccess(response.reference)
      },
      onClose,
    })

    handler.openIframe()
  }

  return <button onClick={pay}>Pay Now</button>
}
