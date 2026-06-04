import React from 'react';

const FAQ = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-surface-900 mb-8">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
          <h3 className="text-lg font-bold text-surface-900 mb-2">How long does delivery take?</h3>
          <p className="text-surface-600">
            Standard delivery typically takes 3-5 business days within major cities, and 5-7 business days for regional areas. Express shipping options are available at checkout.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
          <h3 className="text-lg font-bold text-surface-900 mb-2">What payment methods do you accept?</h3>
          <p className="text-surface-600">
            We accept all major credit and debit cards (Visa, Mastercard) via our secure Paystack gateway. We also support direct bank transfers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
          <h3 className="text-lg font-bold text-surface-900 mb-2">Can I track my order?</h3>
          <p className="text-surface-600">
            Yes! Once your order has been dispatched, you can track it via the 'Order History' section in your dashboard. You will also receive email updates as the status changes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
          <h3 className="text-lg font-bold text-surface-900 mb-2">Do you offer international shipping?</h3>
          <p className="text-surface-600">
            Currently, ShopVerse only operates within Nigeria. We are looking to expand to other countries in the near future.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
