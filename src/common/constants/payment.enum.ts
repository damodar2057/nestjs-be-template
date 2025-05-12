// gateway/supertruck_sass/src/common/constants/payment.enum.ts

export enum PAYMENT_PROVIDER_DEFAULT_CODE {
    STRIPE='stripe',
    PAYPAL='paypal',
    ADYEN='adyen'
}


export enum CURRENCY_TYPE {
  USD = 'usd', // United States Dollar
  POUND = 'pound', // British Pound Sterling
  CANADIAN_DOLLAR = 'cad', // Canadian Dollar
  EURO = 'euro', // Euro
  YEN = 'yen', // Japanese Yen
  AUSTRALIAN_DOLLAR = 'aud', // Australian Dollar
  SWISS_FRANC = 'chf', // Swiss Franc
  INDIAN_RUPEE = 'inr', // Indian Rupee
  CHINESE_YUAN = 'cny', // Chinese Yuan Renminbi
  RUSSIAN_RUBLE = 'rub', // Russian Ruble
  SOUTH_AFRICAN_RAND = 'zar', // South African Rand
  BRAZILIAN_REAL = 'brl', // Brazilian Real
  MEXICAN_PESO = 'mxn', // Mexican Peso
  SINGAPORE_DOLLAR = 'sgd', // Singapore Dollar
  HONG_KONG_DOLLAR = 'hkd', // Hong Kong Dollar
  NEW_ZEALAND_DOLLAR = 'nzd', // New Zealand Dollar
  KOREAN_WON = 'krw', // South Korean Won
  TURKISH_LIRA = 'try', // Turkish Lira
  SAUDI_RIYAL = 'sar', // Saudi Riyal
}


export enum PAYMENT_TRANSACTION_STATE {
    DRAFT = 'draft',
    PENDING = 'pending',
    AUTHORIZED = 'authorized',
    CONFIRMED = 'confirmed',
    CANCEL = 'cancelled',
    ERROR = 'error',
  }

  export enum PaymentMethod {
    CREDIT_CARD='credit_card',
    PAYPAL='paypal',
    BANK_TRANSFER='bank_transfer',
    CRYPTO='crypto',
    CASH='cash'
  }