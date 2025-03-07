# Billing API Endpoints

## Payment Endpoints

### Initialize Payment

```http
POST /api/payments/initialize
Content-Type: application/json

{
  "paymentMethod": "mpesa|card|paypal",
  "amount": number,
  "phoneNo": string,
  "deliveryDetails": object,
  "billingAddress": object
}
```

### Confirm Payment

```http
POST /api/payments/confirm
Content-Type: application/json

{
  "transactionId": string,
  "status": string
}
```

### Email Notification

```http
POST /api/email/transaction
Content-Type: application/json

{
  "to": string,
  "subject": string,
  "transactionDetails": object
}
```
