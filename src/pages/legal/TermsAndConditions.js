import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-6">
    <h2 className="font-display text-xl font-black text-ocean-900 mb-3">{title}</h2>
    <div className="text-ocean-700 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-aqua-600 font-bold text-xs uppercase tracking-widest mb-1">Legal</p>
          <h1 className="font-display text-3xl font-black text-ocean-900">Terms &amp; Conditions</h1>
          <p className="text-ocean-500 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors">
          Back to Home
        </Link>
      </div>

      <div className="space-y-5">
        <Section title="Use of Website">
          <p>
            By accessing and using this website, you agree to follow these Terms &amp; Conditions and all applicable laws.
            If you do not agree, please do not use the website.
          </p>
        </Section>

        <Section title="Orders &amp; Pricing">
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are shown in INR unless stated otherwise.</li>
            <li>We may update prices, product availability, and content at any time.</li>
            <li>An order is confirmed only after successful payment (where applicable) and order confirmation.</li>
          </ul>
        </Section>

        <Section title="Payments (Razorpay)">
          <p>
            Payments are processed through Razorpay. Transaction status depends on bank and payment network responses.
            If a payment fails but money is debited, please contact support with your payment reference.
          </p>
        </Section>

        <Section title="User Accounts">
          <ul className="list-disc pl-5 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your login details.</li>
            <li>We may suspend accounts involved in suspected fraud or misuse.</li>
          </ul>
        </Section>

        <Section title="Returns, Refunds &amp; Cancellations">
          <p>
            Please review our <Link to="/refund-policy" className="text-violet-600 font-semibold hover:text-violet-400">Refund Policy</Link> for details.
          </p>
        </Section>

        <Section title="Shipping &amp; Delivery">
          <p>
            Please review our <Link to="/shipping-policy" className="text-violet-600 font-semibold hover:text-violet-400">Shipping Policy</Link> for timelines and conditions.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            To the maximum extent permitted by law, AasaiPet shall not be liable for indirect or consequential damages arising out of the use of the website or products.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            For any questions regarding these Terms, contact us via the <Link to="/contact" className="text-violet-600 font-semibold hover:text-violet-400">Contact</Link> page.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default TermsAndConditions;

