import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Database,
  FileText,
  Share2,
  Lock,
  UserCog,
  Globe,
  ScrollText,
  Mail,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/auth/register"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Registration
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Learn how we collect, use, and protect your personal information
          </p>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Section 1: Information We Collect */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Personal Information</h3>
                <p>Such as your name, email address, and profile information when you register or update your profile.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Usage Data</h3>
                <p>Details about how you use the Service, including interaction logs and device information.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Emotional Data</h3>
                <p>Data collected through our AI-based analysis (e.g., facial expressions, voice tone, and other physiological signals).</p>
              </div>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-2">
              <ul className="list-disc list-inside space-y-2">
                <li>Service Improvement: To enhance and personalize your experience with the Service.</li>
                <li>Communication: To send you updates, support messages, and important notifications.</li>
                <li>Analytics: To analyze usage trends and improve the overall functionality and performance of the Service.</li>
                <li>Legal Obligations: To comply with applicable laws and regulations.</li>
              </ul>
            </div>
          </div>

          {/* Section 3: Disclosure of Your Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Share2 className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">3. Disclosure of Your Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-2">
              <ul className="list-disc list-inside space-y-2">
                <li>Third-Party Service Providers: We may share your information with trusted third parties who assist in providing the Service.</li>
                <li>Legal Compliance: We may disclose your information if required by law or in response to a legal process.</li>
                <li>Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Data Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">4. Data Security</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no security measures are perfect or impenetrable.
            </p>
          </div>

          {/* Section 5: Your Rights and Choices */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <UserCog className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">5. Your Rights and Choices</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-2">
              <ul className="list-disc list-inside space-y-2">
                <li>Access and Correction: You have the right to access and correct your personal information.</li>
                <li>Opt-Out: You may opt-out of receiving marketing communications by following the unsubscribe instructions provided in those communications.</li>
                <li>Data Retention: We retain your information only as long as necessary to fulfill the purposes described in this Policy.</li>
              </ul>
            </div>
          </div>

          {/* Section 6: Third-Party Links */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ExternalLink className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">6. Third-Party Links</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              The Service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their policies independently.
            </p>
          </div>

          {/* Section 7: International Data Transfers */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <Globe className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">7. International Data Transfers</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              Your information may be transferred to and maintained on servers located outside of your state, province, or country. By using the Service, you consent to such transfers.
            </p>
          </div>

          {/* Section 8: Changes to This Privacy Policy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <ScrollText className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">8. Changes to This Privacy Policy</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. Your continued use of the Service after any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </div>

          {/* Section 9: Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">9. Contact Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11">
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <a 
                href="mailto:a.m.a.hareb2020@gmail.com"
                className="inline-block mt-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
              >
                a.m.a.hareb2020@gmail.com
              </a>
            </div>
          </div>

          {/* Important Note */}
          <div className="p-4 bg-amber-50 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-600">
              These documents are designed to cover the key aspects of using the AIMER app. Please ensure that you consult with a legal professional to adjust the language and ensure full compliance with relevant laws and regulations in your jurisdiction.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p>Last updated: April 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;