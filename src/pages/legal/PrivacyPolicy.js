import React from 'react';
import { Link } from 'react-router-dom';

const Section = ({ title, children }) => (
  <section className="bg-white rounded-2xl border border-ocean-100 shadow-sm p-6">
    <h2 className="font-display text-xl font-black text-ocean-900 mb-3">{title}</h2>
    <div className="text-ocean-700 text-sm leading-relaxed space-y-2">{children}</div>
  </section>
);

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-aqua-600 font-bold text-xs uppercase tracking-widest mb-1">Legal</p>
          <h1 className="font-display text-3xl font-black text-ocean-900">Privacy Policy</h1>
          <p className="text-ocean-500 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <Link to="/" className="text-sm font-semibold text-violet-600 hover:text-violet-400 transition-colors">
          Back to Home
        </Link>
      </div>

      <div className="space-y-5">
        <Section title="Overview">
          <p>
            This Privacy Policy explains how AasaiPet collects, uses, and protects your information when you use our website and services.
            By using the website, you agree to the practices described in this policy.
          </p>
        </Section>

        <Section title="Information We Collect">
          <ul className="list-disc pl-5 space-y-1">
            <li>Account details such as name, email, phone number, and delivery address.</li>
            <li>Order information, including items purchased and transaction references.</li>
            <li>Device and usage data (e.g., pages visited, basic analytics) to improve the website.</li>
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To process orders, provide delivery updates, and offer customer support.</li>
            <li>To prevent fraud, maintain security, and comply with legal obligations.</li>
            <li>To improve products, services, and user experience.</li>
          </ul>
        </Section>

        <Section title="Payments (Razorpay)">
          <p>
            Payments are processed by Razorpay. We do not store your complete card or bank details on our servers.
            Razorpay may collect payment-related information as required to process your transaction securely.
          </p>
        </Section>

        <Section title="Sharing of Information">
          <p>
            We may share information with trusted service providers (e.g., payment processors, shipping partners) only as needed to fulfill your order.
            We do not sell your personal data to third parties.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use reasonable safeguards to protect your information. However, no online service can guarantee absolute security.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions about this Privacy Policy, please contact us via the details in the{' '}
            <Link to="/contact" className="text-violet-600 font-semibold hover:text-violet-400">Contact</Link> page.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

