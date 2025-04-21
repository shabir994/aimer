import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Scale, 
  UserCheck, 
  FileCheck, 
  AlertTriangle, 
  FileWarning, 
  HelpCircle, 
  ScrollText,
  Gavel,
  MessageSquare,
  Mail,
  Building
} from 'lucide-react';

const TermsOfService = () => {
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <ScrollText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Please read these terms carefully before using our service
          </p>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              By downloading, accessing, or using the AIMER app ("Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileCheck className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">2. Changes to Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We reserve the right to update or modify these Terms at any time. Continued use of the Service will be considered acceptance of any changes.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">3. Eligibility</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              You must be at least 13 years old (or the applicable minimum age in your jurisdiction) to use this Service. By using the Service, you confirm that you meet the age requirement.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Scale className="w-6 h-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">4. License to Use</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              We grant you a non-exclusive, non-transferable, revocable license to access and use the Service solely for personal and non-commercial purposes, subject to these Terms.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <HelpCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">5. User Obligations</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-2">
              <p>You agree to use the Service in a manner that complies with all applicable laws and regulations.</p>
              <p>You are responsible for maintaining the confidentiality of your account and password.</p>
              <p>You agree to provide accurate, current, and complete information during registration and update it as necessary.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">6. Prohibited Conduct</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-2">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Use the Service for any unlawful or harmful activities.</li>
                <li>Attempt to interfere with or disrupt the integrity or performance of the Service.</li>
                <li>Reverse-engineer or attempt to extract the source code of the Service.</li>
              </ul>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileWarning className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">7. Disclaimer of Warranties</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              The Service is provided "as is" without any warranties of any kind, either expressed or implied. We do not guarantee that the Service will be error-free or uninterrupted. All content and features are provided without warranty.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Shield className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">8. Limitation of Liability</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service. You agree that any claims or disputes arising from your use of the Service shall be resolved as described below, and you hereby waive any rights to pursue legal action in a court of law regarding such issues.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Building className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">9. Indemnification</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              You agree to indemnify, defend, and hold harmless the Service, its affiliates, officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of the Service or your violation of these Terms.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">10. Dispute Resolution</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11 space-y-2">
              <p>In the event of any dispute or claim relating to the Service, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>Attempt to resolve the dispute informally by contacting our support team.</li>
                <li>If informal resolution fails, you agree that any disputes shall be resolved exclusively through binding arbitration under the applicable rules, and you waive your right to bring any claims in a court of law or participate in a class action.</li>
              </ul>
              <p className="text-sm italic mt-4">
                Note: While this clause is designed to limit the ability to report issues through litigation or class actions, it does not prevent you from providing feedback or reporting issues through our designated support channels.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Gavel className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">11. Governing Law</h2>
            </div>
            <p className="text-gray-600 leading-relaxed pl-11">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our company is registered, without regard to conflict of law principles.
            </p>
          </div>

          {/* Section 12 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">12. Contact Information</h2>
            </div>
            <div className="text-gray-600 leading-relaxed pl-11">
              <p>For any questions regarding these Terms, please contact us at:</p>
              <a 
                href="mailto:a.m.a.hareb2020@gmail.com"
                className="inline-block mt-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
              >
                a.m.a.hareb2020@gmail.com
              </a>
            </div>
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

export default TermsOfService;