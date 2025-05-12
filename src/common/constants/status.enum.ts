export enum Status {
    PAID = 'paid',
    DUE = 'due',
    OVER_DUE = 'overDue',
    PENDING = "PENDING",
  }
  
  
  export enum InvoiceState {
    DRAFT = 'draft',
    SENT = 'sent',
    PAID = 'paid',
    CANCELLED = 'cancelled',
    OVERDUE = 'overdue',
    PARTIALLY_PAID = 'partially_paid'
  }
  
  export enum InvoiceType {
    FREIGHT = 'freight',
    ACCESSORIES = 'accessories',
    DETENTION = 'detention',
    FUEL_SURCHARGE = 'fuel_surcharge',
    PARKING='parking',
    OTHER = 'other'
  }
  
  export enum PaymentTerms {
    NET_30 = 'net_30',
    NET_15 = 'net_15',
    NET_7 = 'net_7',
    DUE_ON_RECEIPT = 'due_on_receipt',
    CUSTOM = 'custom',
    ALREADY_PAID='already_paid'
  }
  
  export enum InvoiceReceiver {
    BROKER = 'broker',
    SHIPPER = 'shipper',
    CONSIGNEE = 'consignee',
    CARRIER = 'carrier',
    PARKING_CUSTOMER='parking_customer',
    PARKING_OWNER='parking_owner'
  }
  
  export enum StopsActivityType {
    PICKUP ='pickup',
    DELIVERY = 'delivery'
  }
  export enum LoadRequestShiftType {
    MORNING='morning',
    AFTERNOON='afternoon',
    EVENING='evening',
  
  }
  export enum FREE_PARKING_REQUEST_STATUS {
    APPROVED='approved',
    PENDING='pending',
    REJECTED='rejected',
    CANCELLED='cancelled'
  }
  