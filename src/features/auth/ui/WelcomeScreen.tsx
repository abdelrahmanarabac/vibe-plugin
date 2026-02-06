/**
 * @module WelcomeScreen
 * @description Document-style Terms & Privacy screen with scroll-to-accept pattern.
 * @version 2.0.0
 * 
 * UX Pattern: Users must scroll to bottom of document before "Continue" button enables.
 * This ensures they've actually seen the legal content.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, ScrollText, ChevronDown, Check } from 'lucide-react';
import { Button } from '../../../components/shared/base/Button';
import { fadeTransition } from '../../../shared/animations/MicroAnimations';
import { useOnboarding } from '../OnboardingStore';

interface WelcomeScreenProps {
    onAccept: () => void;
}

type DocumentTab = 'terms' | 'privacy';

/**
 * Document-Style Welcome Screen
 * Forces users to read legal documents by requiring scroll to bottom
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAccept }) => {
    const { acceptTerms } = useOnboarding();
    const [isAccepting, setIsAccepting] = useState(false);
    const [activeTab, setActiveTab] = useState<DocumentTab>('terms');
    const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
    const [hasScrolledPrivacy, setHasScrolledPrivacy] = useState(false);

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Check if user has scrolled to bottom
    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

        if (isBottom) {
            if (activeTab === 'terms') {
                setHasScrolledTerms(true);
            } else {
                setHasScrolledPrivacy(true);
            }
        }
    };

    // Reset scroll position when switching tabs
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const canProceed = hasScrolledTerms && hasScrolledPrivacy;

    const handleAccept = async () => {
        console.log('[WelcomeScreen] Button clicked!', {
            canProceed,
            hasScrolledTerms,
            hasScrolledPrivacy,
            isAccepting
        });

        if (!canProceed) {
            console.warn('[WelcomeScreen] Cannot proceed - documents not scrolled');
            return;
        }

        setIsAccepting(true);
        try {
            console.log('[WelcomeScreen] Calling acceptTerms()...');
            await acceptTerms();
            console.log('[WelcomeScreen] Terms accepted successfully!');

            console.log('[WelcomeScreen] Calling onAccept callback...');
            onAccept();
            console.log('[WelcomeScreen] onAccept callback completed!');
        } catch (error) {
            console.error('[WelcomeScreen] Failed to accept terms:', error);
            setIsAccepting(false);
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeTransition}
            className="flex flex-col h-screen bg-void text-text-primary"
        >
            {/* Header */}
            <div className="flex-none border-b border-white/5 bg-surface-1/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20">
                            <Shield className="w-6 h-6 text-primary" strokeWidth={2.5} />
                        </div>

                        {/* Title */}
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-white font-display tracking-tight">
                                Welcome to Vibe Tokens
                            </h1>
                            <p className="text-xs text-text-dim mt-0.5">
                                Please review our legal documents before continuing
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex-none border-b border-white/5 bg-surface-1/40">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex gap-1">
                        {/* Terms Tab */}
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`
                                relative px-5 py-3 text-sm font-semibold transition-all
                                ${activeTab === 'terms'
                                    ? 'text-primary'
                                    : 'text-text-dim hover:text-text-primary'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>Terms of Use</span>
                                {hasScrolledTerms && (
                                    <Check className="w-3.5 h-3.5 text-success" strokeWidth={3} />
                                )}
                            </div>
                            {activeTab === 'terms' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>

                        {/* Privacy Tab */}
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`
                                relative px-5 py-3 text-sm font-semibold transition-all
                                ${activeTab === 'privacy'
                                    ? 'text-primary'
                                    : 'text-text-dim hover:text-text-primary'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <ScrollText className="w-4 h-4" />
                                <span>Privacy Policy</span>
                                {hasScrolledPrivacy && (
                                    <Check className="w-3.5 h-3.5 text-success" strokeWidth={3} />
                                )}
                            </div>
                            {activeTab === 'privacy' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Document Content (Scrollable) */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto scroll-smooth"
            >
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'terms' ? (
                            <motion.div
                                key="terms"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="prose prose-invert prose-sm max-w-none"
                            >
                                <TermsOfUseDocument />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="privacy"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="prose prose-invert prose-sm max-w-none"
                            >
                                <PrivacyPolicyDocument />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Scroll Indicator (when not at bottom) */}
                <AnimatePresence>
                    {((activeTab === 'terms' && !hasScrolledTerms) ||
                        (activeTab === 'privacy' && !hasScrolledPrivacy)) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="sticky bottom-24 left-0 right-0 flex justify-center pointer-events-none"
                            >
                                <div className="bg-warning/10 border border-warning/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-xs font-medium text-warning">
                                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                                    <span>Scroll to continue reading</span>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>

            {/* Footer with CTA */}
            <div className="flex-none border-t border-white/5 bg-surface-1/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between gap-4">
                        {/* Status Indicator */}
                        <div className="flex items-center gap-3 text-xs">
                            <div className={`flex items-center gap-1.5 ${hasScrolledTerms ? 'text-success' : 'text-text-dim'}`}>
                                {hasScrolledTerms ? (
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                                )}
                                <span>Terms reviewed</span>
                            </div>
                            <div className={`flex items-center gap-1.5 ${hasScrolledPrivacy ? 'text-success' : 'text-text-dim'}`}>
                                {hasScrolledPrivacy ? (
                                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                ) : (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-current" />
                                )}
                                <span>Privacy reviewed</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                            onClick={handleAccept}
                            loading={isAccepting}
                            disabled={!canProceed || isAccepting}
                            variant="primary"
                            size="lg"
                            className="shadow-glow disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {canProceed ? 'I Agree & Continue' : 'Read Documents to Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// 📄 DOCUMENT CONTENT COMPONENTS
// ============================================================================

const TermsOfUseDocument: React.FC = () => (
    <div className="space-y-6 text-text-primary leading-relaxed">
        <div>
            <h2 className="text-2xl font-bold text-white mb-3">Terms of Use</h2>
            <p className="text-xs text-text-dim italic">Last Updated: February 6, 2026</p>
        </div>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h3>
            <p>
                By using Vibe Tokens ("the Plugin"), you agree to be bound by these Terms of Use.
                If you do not agree to these terms, please do not use the Plugin.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Description of Service</h3>
            <p>
                Vibe Tokens is a Figma plugin that helps designers manage design tokens,
                create and sync variables, and export tokens in multiple formats. The Plugin
                integrates with your Figma workspace and may store data in external services.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. User Account</h3>
            <p>
                To use certain features, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">4. Acceptable Use</h3>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the Plugin for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the Plugin's functionality</li>
                <li>Attempt to gain unauthorized access to any systems</li>
                <li>Reverse engineer or decompile the Plugin</li>
                <li>Use the Plugin to transmit malicious code or content</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">5. Intellectual Property</h3>
            <p>
                The Plugin and all related content, features, and functionality are owned by
                the Plugin developers and are protected by international copyright, trademark,
                and other intellectual property laws.
            </p>
            <p className="mt-2">
                Your design tokens and Figma files remain your intellectual property.
                We claim no ownership rights over your content.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">6. Data Storage & Syncing</h3>
            <p>
                The Plugin may sync your design tokens to cloud storage (Supabase) to enable
                cross-device access and team collaboration. You can delete your data at any time
                from the Plugin settings.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">7. Limitation of Liability</h3>
            <p>
                THE PLUGIN IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.
                We shall not be liable for any indirect, incidental, or consequential damages
                arising from your use of the Plugin.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">8. Modifications to Terms</h3>
            <p>
                We reserve the right to modify these terms at any time. We will notify users
                of significant changes via the Plugin interface. Continued use after changes
                constitutes acceptance of the new terms.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">9. Termination</h3>
            <p>
                We may terminate or suspend your access to the Plugin immediately, without
                prior notice, for any breach of these Terms.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">10. Contact</h3>
            <p>
                For questions about these Terms, please contact us through our GitHub repository
                or Figma Community page.
            </p>
        </section>

        <div className="pt-8 border-t border-white/10">
            <p className="text-center text-xs text-text-dim">
                End of Terms of Use Document
            </p>
        </div>
    </div>
);

const PrivacyPolicyDocument: React.FC = () => (
    <div className="space-y-6 text-text-primary leading-relaxed">
        <div>
            <h2 className="text-2xl font-bold text-white mb-3">Privacy Policy</h2>
            <p className="text-xs text-text-dim italic">Last Updated: February 6, 2026</p>
        </div>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">1. Introduction</h3>
            <p>
                This Privacy Policy explains how Vibe Tokens ("we," "us," or "the Plugin")
                collects, uses, and protects your personal information.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">2. Information We Collect</h3>

            <h4 className="font-semibold text-white mt-3 mb-1">2.1 Personal Information</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li><strong>Email Address:</strong> Used for account creation and recovery</li>
                <li><strong>Authentication Data:</strong> Securely managed by Supabase Auth</li>
            </ul>

            <h4 className="font-semibold text-white mt-3 mb-1">2.2 Usage Data</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li>Plugin interaction signals (feature usage, errors)</li>
                <li>Session duration and frequency</li>
                <li>Plugin version and environment information</li>
            </ul>

            <h4 className="font-semibold text-white mt-3 mb-1">2.3 Design Token Data</h4>
            <ul className="list-disc pl-6 space-y-1">
                <li>Token names, types, and values</li>
                <li>Collection metadata (names, descriptions)</li>
                <li>Variable mode configurations</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">3. What We DON'T Collect</h3>
            <p className="font-semibold text-success mb-2">We explicitly do NOT collect:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li>Your Figma design files or screenshots</li>
                <li>Proprietary design content or assets</li>
                <li>Personal information beyond email address</li>
                <li>Payment or financial information</li>
                <li>Location data or device identifiers</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">4. How We Use Your Data</h3>
            <ul className="list-disc pl-6 space-y-1">
                <li>To provide and maintain the Plugin functionality</li>
                <li>To sync your tokens across devices and team members</li>
                <li>To improve the Plugin based on usage patterns</li>
                <li>To communicate important updates or security issues</li>
                <li>To provide customer support when requested</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">5. Data Storage & Security</h3>
            <p>
                Your data is stored securely using Supabase, a database built on PostgreSQL
                with enterprise-grade security:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Encryption:</strong> Data is encrypted in transit (TLS) and at rest</li>
                <li><strong>Access Control:</strong> Row-level security policies protect your data</li>
                <li><strong>Backups:</strong> Regular automated backups with point-in-time recovery</li>
                <li><strong>Compliance:</strong> SOC 2 Type II certified infrastructure</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">6. Third-Party Services</h3>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Supabase:</strong> Database and authentication (see their privacy policy)</li>
                <li><strong>Figma:</strong> The Plugin operates within Figma's environment</li>
            </ul>
            <p className="mt-2">
                We do NOT share your data with advertising networks, analytics trackers,
                or any other third parties beyond these essential services.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">7. Your Rights</h3>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate data</li>
                <li><strong>Deletion:</strong> Delete your account and all associated data</li>
                <li><strong>Export:</strong> Download your tokens in various formats</li>
                <li><strong>Opt-Out:</strong> Disable usage analytics at any time</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">8. Data Retention</h3>
            <p>
                We retain your data only as long as necessary to provide the service.
                When you delete your account:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>All personal data is permanently deleted within 30 days</li>
                <li>Backups are purged according to our retention schedule (90 days)</li>
                <li>Anonymized usage statistics may be retained for analytics</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">9. Children's Privacy</h3>
            <p>
                The Plugin is not intended for users under 13 years of age.
                We do not knowingly collect data from children.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">10. Changes to This Policy</h3>
            <p>
                We may update this Privacy Policy from time to time. We will notify you
                of any significant changes via the Plugin interface or email.
            </p>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">11. Figma Plugin Policy Compliance</h3>
            <p>
                This Plugin fully complies with Figma's Plugin Privacy and Security policies:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>We only access data necessary for Plugin functionality</li>
                <li>We do not access user files without explicit permission</li>
                <li>All data access is clearly communicated to users</li>
                <li>We follow Figma's security best practices</li>
            </ul>
        </section>

        <section>
            <h3 className="text-lg font-semibold text-white mb-2">12. Contact Us</h3>
            <p>
                For privacy-related questions or to exercise your rights, contact us through:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>GitHub: <span className="text-primary font-mono">github.com/abdelrahmanarabac/vibe-plugin</span></li>
                <li>Figma Community: Vibe Tokens Plugin Page</li>
            </ul>
        </section>

        <div className="pt-8 border-t border-white/10">
            <p className="text-center text-xs text-text-dim">
                End of Privacy Policy Document
            </p>
        </div>
    </div>
);
