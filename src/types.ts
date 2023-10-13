export interface ContactFormValues {
  name: string;
  company: string;
  phone: string;
  email: string;
  found: string;
  foundOtherDesc?: string;
  message: string;
  token: string;
}

export interface RequestAccountFormValues {
  companyName: string;
  contact: string;
  billingAddress: string;
  shippingAddress: string;
  phone: string;
  email: string;
  apEmail: string;
  paymentMethod: string;
  token: string;
}
