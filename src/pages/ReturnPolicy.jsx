import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-surface-900 mb-6">Return Policy</h1>
      <div className="prose prose-primary max-w-none text-surface-600">
        <p>
          Thank you for shopping at ShopVerse.
        </p>
        <p>
          If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns.
        </p>
        <h2 className="text-xl font-bold mt-8 mb-4">Conditions for Returns</h2>
        <p>
          In order for the Goods to be eligible for a return, please make sure that:
        </p>
        <ul className="list-disc pl-5 mt-4 space-y-2">
          <li>The Goods were purchased in the last 30 days</li>
          <li>The Goods are in the original packaging</li>
          <li>The Goods were not used or damaged</li>
          <li>You have the receipt or proof of purchase</li>
        </ul>
        <h2 className="text-xl font-bold mt-8 mb-4">Returning Goods</h2>
        <p>
          You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods to the address provided by our support team once your return request is approved.
        </p>
        <p>
          We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
