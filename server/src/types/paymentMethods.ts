export type PaymentMethod = "cash" | "ecash" | "card";

export interface PaymentRequest {
    orderId: string;
    amountCents: number;
}

export type PaymentResult =
    | {
          status: "success";
          method: PaymentMethod;
          reference?: string;
          changeCents?: number;
      }
    | {
          status: "pending";
          checkoutUrl: string;
          method: PaymentMethod;
          reference: string;
      }
    | {
          status: "failed";
          method: PaymentMethod;
          reason: string;
      };

export interface PaymentHandler {
    pay(req: PaymentRequest): Promise<PaymentResult>;
}
