//

export enum ParkingEvents {
  GENERATE_AUDIT_TRAIL = 'generate.audit.trail',
  GENERATE_PARKING_INVOICE = 'generate_parking_invoice',
  BOOKING_PAYMENT_TIMEOUT = 'booking_payment_timeout',
}

export enum NotificationEvents {
  SEND_NOTIFICATION = 'send_notification',
  GENERATE_PUSH = 'generate_push',
}
