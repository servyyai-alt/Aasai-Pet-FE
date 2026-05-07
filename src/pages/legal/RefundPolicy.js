import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-6">
    <h2 className="font-display text-xl font-black text-ocean-900 mb-3">{title}</h2>
    <div className="text-ocean-700 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

const RefundPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-aqua-600 font-bold text-xs uppercase tracking-widest mb-1">Legal</p>
          <h1 className="font-display text-3xl font-black text-ocean-900">Cancellation &amp; Refund Policy</h1>
          <p className="text-ocean-500 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors">
          Back to Home
        </Link>
      </div>

      <div className="space-y-5">
        <Section title="Cancellations">
          <ul className="list-disc pl-5 space-y-1">
            <li>You can request cancellation before the order is shipped/processed for dispatch.</li>
            <li>Once shipped, cancellation may not be possible; you may request return/refund as per eligibility.</li>
          </ul>
        </Section>

        <Section title="Returns &amp; Refund Eligibility">
          <p>
            If you receive a damaged, defective, or incorrect item, please contact support within 48 hours of delivery with photos/videos for verification.
          </p>
          <p>
            Certain products may be non-returnable for hygiene/safety reasons (e.g., opened consumables). Eligibility will be confirmed by support.
          </p>
        </Section>

        <Section title="Refund Timelines (Razorpay)">
          <p>
            If a refund is approved, it will be processed back to the original payment method. Refund timelines may vary depending on your bank/payment method.
          </p>
        </Section>

        <Section title="Need Help?">
          <p>
            Please reach us via the <Link to="/contact" className="text-violet-600 font-semibold hover:text-violet-400">Contact</Link> page with your order ID and payment reference.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default RefundPolicy;

