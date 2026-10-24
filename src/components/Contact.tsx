import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Clock 
} from 'lucide-react';
import { ProfileData, ContactSettings } from '../types';

interface ContactProps {
  profile: ProfileData;
  contactSettings?: ContactSettings;
  prefilledSubject?: string;
  onSendMessage: (data: { name: string; email: string; subject: string; message: string }) => Promise<void>;
}

export const Contact: React.FC<ContactProps> = ({ 
  profile, 
  contactSettings,
  prefilledSubject = '', 
  onSendMessage 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(prefilledSubject || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const activeContactSettings = contactSettings || {
    badge: "Let's Build Together",
    title: "Get In Touch",
    subtitle: "Have a project in mind, need technical leadership, or want to discuss cloud architecture? Send a direct message below."
  };

  React.useEffect(() => {
    if (prefilledSubject) {
      setSubject(prefilledSubject);
    }
  }, [prefilledSubject]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await onSendMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || 'General Inquiry',
        message: message.trim()
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 md:py-14 relative bg-[#FFF9F2] border-t border-[#010736]/10 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#010736]">
            {activeContactSettings.title || "Do You Hire me?"}
          </h2>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-white border border-[#010736]/15 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#010736]/60 font-semibold">Direct Contact</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#010736] mt-2 mb-4">
                Let's discuss your next engineering milestone.
              </h3>
              <p className="text-sm text-[#010736]/75 leading-relaxed mb-8">
                I am currently open for full-time engineering appointments, distributed contracts, and technical consulting.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                
                {/* Email Box */}
                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#010736]/15 flex items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-mono text-[#010736]/60 uppercase">Direct Email</p>
                      <a 
                        href={`mailto:${profile.email}`}
                        className="text-sm font-bold text-[#010736] hover:underline truncate block"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg bg-white border border-[#010736]/15 text-[#010736] hover:bg-gray-50 shrink-0 transition-colors"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone Box */}
                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#010736]/15 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-[#010736]/60 uppercase">Phone / WhatsApp</p>
                    <a 
                      href={`tel:${profile.phone}`}
                      className="text-sm font-bold text-[#010736] hover:underline"
                    >
                      {profile.phone}
                    </a>
                  </div>
                </div>

                {/* Location Box */}
                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#010736]/15 flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-[#010736]/60 uppercase">Primary Location</p>
                    <p className="text-sm font-bold text-[#010736]">
                      {profile.location}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="mt-8 pt-6 border-t border-[#010736]/10 flex items-center gap-3 text-xs text-[#010736]/70">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Messages stored securely in Firebase Firestore. Typical reply within 24 hours.</span>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-[#010736]/15 shadow-sm flex flex-col justify-between">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 my-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-700 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-[#010736] mb-2">
                  Message Sent Successfully!
                </h4>
                <p className="text-sm text-[#010736]/80 max-w-md leading-relaxed mb-6">
                  Thank you for reaching out. Your message has been saved to Firebase Firestore and will be reviewed shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 transition-colors shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
                <div>
                  <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#010736] mb-2">
                    Send a Message
                  </h4>
                  <p className="text-xs sm:text-sm text-[#010736]/70 mb-6">
                    Fill out the form below and it will be routed directly to the dashboard inbox.
                  </p>

                  {errorMsg && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-semibold">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] placeholder-[#010736]/40 focus:outline-none focus:border-[#010736]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-semibold">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] placeholder-[#010736]/40 focus:outline-none focus:border-[#010736]"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-semibold">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Project Inquiry / Job Opportunity"
                      className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] placeholder-[#010736]/40 focus:outline-none focus:border-[#010736]"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-semibold">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell me about your project goals, timeline, and requirements..."
                      className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] placeholder-[#010736]/40 focus:outline-none focus:border-[#010736] resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm sm:text-base hover:bg-[#010736]/90 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <span>Send Message to Firebase</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
