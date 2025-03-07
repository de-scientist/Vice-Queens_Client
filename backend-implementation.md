# Backend Implementation Guide - Fastify & Prisma

## Project Setup

```bash
# Initialize project
npm init -y
npm install fastify @prisma/client @fastify/cors nodemailer

# Development dependencies
npm install -D prisma typescript @types/node
```

## Database Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Order {
  id              String    @id @default(cuid())
  transactionId   String    @unique
  status          String
  amount          Float
  paymentMethod   String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  billingAddress  BillingAddress?
  deliveryDetails DeliveryDetails?
  orderItems      OrderItem[]
}

model BillingAddress {
  id        String  @id @default(cuid())
  firstname String
  lastname  String
  email     String
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String  @unique
}

model DeliveryDetails {
  id        String  @id @default(cuid())
  region    String
  town      String
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String  @unique
}

model OrderItem {
  id          String  @id @default(cuid())
  name        String
  quantity    Int
  price       Float
  order       Order   @relation(fields: [orderId], references: [id])
  orderId     String
}
```

## Project Structure

```
src/
├── plugins/
│   ├── cors.ts
│   └── prisma.ts
├── routes/
│   ├── payment.ts
│   └── email.ts
├── services/
│   ├── payment.service.ts
│   └── email.service.ts
├── config/
│   └── email.config.ts
└── app.ts
```

## Fastify Server Setup

```typescript
// src/app.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { paymentRoutes } from "./routes/payment";
import { emailRoutes } from "./routes/email";

const app = Fastify({
  logger: true,
});

// Register plugins
app.register(cors, {
  origin: process.env.FRONTEND_URL,
  credentials: true,
});

// Register routes
app.register(paymentRoutes, { prefix: "/api/payments" });
app.register(emailRoutes, { prefix: "/api/email" });

export default app;
```

## Payment Implementation

```typescript
// src/routes/payment.ts
import { FastifyPlugin } from "fastify";
import { PaymentService } from "../services/payment.service";

export const paymentRoutes: FastifyPlugin = async (fastify) => {
  const paymentService = new PaymentService(fastify.prisma);

  fastify.post("/initialize", async (request, reply) => {
    const payload = request.body as PaymentRequestBody;
    const result = await paymentService.initiatePayment(payload);
    return reply.code(200).send(result);
  });

  fastify.post("/confirm", async (request, reply) => {
    const { transactionId, status } = request.body as ConfirmationRequest;
    const result = await paymentService.confirmPayment(transactionId, status);
    return reply.code(200).send(result);
  });
};
```

## Email Service Implementation

```typescript
// src/services/email.service.ts
import nodemailer from "nodemailer";
import { emailConfig } from "../config/email.config";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
  }

  async sendTransactionEmail(emailData: EmailData): Promise<void> {
    const { to, subject, transactionDetails } = emailData;

    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: this.generateEmailTemplate(transactionDetails),
    });
  }

  private generateEmailTemplate(details: TransactionDetails): string {
    // Implementation of email template generation
    return `...email template...`;
  }
}
```

## Payment Service Implementation

```typescript
// src/services/payment.service.ts
import { PrismaClient } from "@prisma/client";
import { EmailService } from "./email.service";

export class PaymentService {
  private emailService: EmailService;

  constructor(private prisma: PrismaClient) {
    this.emailService = new EmailService();
  }

  async initiatePayment(payload: PaymentRequestBody) {
    const order = await this.prisma.order.create({
      data: {
        amount: payload.amount,
        paymentMethod: payload.paymentMethod,
        status: "PENDING",
        billingAddress: {
          create: payload.billingAddress,
        },
        deliveryDetails: {
          create: payload.deliveryDetails,
        },
        orderItems: {
          create: payload.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        billingAddress: true,
        deliveryDetails: true,
        orderItems: true,
      },
    });

    return order;
  }

  async confirmPayment(transactionId: string, status: string) {
    const order = await this.prisma.order.update({
      where: { transactionId },
      data: { status },
      include: {
        billingAddress: true,
        deliveryDetails: true,
        orderItems: true,
      },
    });

    if (status === "SUCCESS") {
      await this.emailService.sendTransactionEmail({
        to: order.billingAddress.email,
        subject: "Order Confirmation",
        transactionDetails: order,
      });
    }

    return order;
  }
}
```

## Environment Configuration

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
FRONTEND_URL="http://localhost:3000"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-specific-password"
EMAIL_FROM="noreply@yourcompany.com"
```

## Error Handling

```typescript
// src/utils/errors.ts
export class PaymentError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

// Usage in routes
fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof PaymentError) {
    reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    });
    return;
  }

  reply.status(500).send({
    error: "InternalServerError",
    message: "An internal server error occurred",
  });
});
```

## Testing Setup

```typescript
// tests/payment.test.ts
import { test } from "tap";
import buildApp from "../src/app";

test("payment flow", async (t) => {
  const app = buildApp();

  t.test("initiates payment", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/payments/initialize",
      payload: {
        // test payload
      },
    });

    t.equal(response.statusCode, 200);
    t.ok(response.json().transactionId);
  });
});
```

## API Documentation

For API documentation, you can use Swagger/OpenAPI with Fastify:

```typescript
import swagger from "@fastify/swagger";

app.register(swagger, {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Payment API",
      version: "1.0.0",
    },
  },
  exposeRoute: true,
});
```

## Security Considerations

1. Input Validation

```typescript
import { Type } from "@sinclair/typebox";

const PaymentSchema = Type.Object({
  amount: Type.Number(),
  paymentMethod: Type.String(),
  phoneNo: Type.Optional(Type.String()),
});

fastify.post(
  "/initialize",
  {
    schema: {
      body: PaymentSchema,
    },
  },
  handler,
);
```

2. Rate Limiting

```typescript
import rateLimit from "@fastify/rate-limit";

app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});
```
