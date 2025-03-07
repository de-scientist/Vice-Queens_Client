export const createTransactionEmailTemplate = (data: {
  orderId: string;
  customerName: string;
  items: any[];
  total: number;
  deliveryDetails: {
    region: string;
    town: string;
  };
}) => {
  return `
    <h1>Order Confirmation</h1>
    <p>Dear ${data.customerName},</p>
    <p>Thank you for your order! Here are your order details:</p>
    
    <h2>Order ID: ${data.orderId}</h2>
    
    <h3>Items:</h3>
    <ul>
      ${data.items
        .map(
          (item) => `
        <li>${item.name} - Quantity: ${item.quantity} - Price: $${item.currentPrice}</li>
      `,
        )
        .join("")}
    </ul>
    
    <h3>Delivery Details:</h3>
    <p>Region: ${data.deliveryDetails.region}</p>
    <p>Town: ${data.deliveryDetails.town}</p>
    
    <h3>Total Amount: $${data.total.toFixed(2)}</h3>
    
    <p>We'll notify you when your order ships.</p>
    
    <p>Best regards,<br>Vice Queen Industries</p>
  `;
};
