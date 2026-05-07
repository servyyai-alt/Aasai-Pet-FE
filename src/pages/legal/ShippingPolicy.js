import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-6">
    <h2 className="font-display text-xl font-black text-ocean-900 mb-3">{title}</h2>
    <div className="text-ocean-700 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

const ShippingPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-aqua-600 font-bold text-xs uppercase tracking-widest mb-1">Legal</p>
          <h1 className="font-display text-3xl font-black text-ocean-900">Shipping &amp; Delivery Policy</h1>
          <p className="text-ocean-500 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors">
          Back to Home
        </Link>
      </div>

      <div className="space-y-5">
        <Section title="Delivery Coverage">
          <p>We deliver to supported locations in India based on courier serviceability for your PIN code.</p>
        </Section>

        <Section title="Order Processing">
          <p>Orders are typically processed within 1–2 business days (excluding Sundays and public holidays), subject to stock availability.</p>
        </Section>

        <Section title="Estimated Delivery Timelines">
          <ul className="list-disc pl-5 space-y-1">
            <li>Within city/local: typically 1–3 business days.</li>
            <li>Other regions: typically 3–7 business days.</li>
          </ul>
          <p className="text-ocean-500">
            Delivery timelines are estimates and may vary due to courier delays, weather, or operational constraints.
          </p>
        </Section>

        <Section title="Shipping Charges">
          <p>Shipping charges (if any) will be shown at checkout before you complete payment.</p>
        </Section>

        <Section title="Tracking">
          <p>When available, we will share tracking details via email/SMS/WhatsApp after dispatch.</p>
        </Section>

        <Section title="Support">
          <p>
            If you have delivery issues, please contact us via the <Link to="/contact" className="text-violet-600 font-semibold hover:text-violet-400">Contact</Link> page with your order ID.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default ShippingPolicy;

