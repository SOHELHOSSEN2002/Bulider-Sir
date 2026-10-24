import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  LogOut, 
  Lock, 
  Layers, 
  Code2, 
  Flame, 
  BookOpen, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Settings, 
  KeyRound,
  Send,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Sliders,
  FolderPlus,
  HelpCircle,
  Upload,
  Check
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { defaultSiteSettings } from '../lib/defaultData';
import { 
  ProfileData, 
  ProjectItem, 
  SkillItem, 
  ServiceItem, 
  BlogPostItem, 
  ContactMessageItem,
  SiteSettings,
  HeroSlideItem,
  TimelineItem
} from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  siteSettings: SiteSettings;
  projects: ProjectItem[];
  skills: SkillItem[];
  services: ServiceItem[];
  blogs: BlogPostItem[];
  messages: ContactMessageItem[];
  onSaveProfile: (profile: ProfileData) => Promise<void>;
  onSaveSiteSettings: (settings: SiteSettings) => Promise<void>;
  onSaveProject: (project: Partial<ProjectItem>) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onSaveSkill: (skill: Partial<SkillItem>) => Promise<void>;
  onDeleteSkill: (skillId: string) => Promise<void>;
  onSaveService: (service: Partial<ServiceItem>) => Promise<void>;
  onDeleteService: (serviceId: string) => Promise<void>;
  onSaveBlog: (blog: Partial<BlogPostItem>) => Promise<void>;
  onDeleteBlog: (blogId: string) => Promise<void>;
  onToggleMessageRead: (messageId: string, currentRead: boolean) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  onSeedDatabase: () => Promise<void>;
  isSeeding: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  profile,
  siteSettings,
  projects,
  skills,
  services,
  blogs,
  messages,
  onSaveProfile,
  onSaveSiteSettings,
  onSaveProject,
  onDeleteProject,
  onSaveSkill,
  onDeleteSkill,
  onSaveService,
  onDeleteService,
  onSaveBlog,
  onDeleteBlog,
  onToggleMessageRead,
  onDeleteMessage,
  onSeedDatabase,
  isSeeding
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'hero' | 'about' | 'skills' | 'services' | 'projects' | 'blogs' | 'messages' | 'security' | 'contact'>('overview');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  
  // Mandatory Login state on every entry
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Password Recovery state
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verify'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('engi.sohelhossen.2002@gmail.com');
  const [recoveryCodeInput, setRecoveryCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [sentRecoveryCode, setSentRecoveryCode] = useState<string | null>(null);
  const [isSendingCode, setIsSendingCode] = useState(false);

  // Security Credentials Editor (inside dashboard)
  const [newAdminUser, setNewAdminUser] = useState('admin');
  const [newAdminPass, setNewAdminPass] = useState('admin123');
  const [adminRecoveryEmail, setAdminRecoveryEmail] = useState('engi.sohelhossen.2002@gmail.com');
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Local copy of SiteSettings for live form edits
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...siteSettings });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState<ProfileData>({ ...profile });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // New Category input state
  const [newCategoryName, setNewCategoryName] = useState('');

  // CRUD Modals state
  const [editingHeroSlide, setEditingHeroSlide] = useState<Partial<HeroSlideItem> | null>(null);
  const [editingTimelineItem, setEditingTimelineItem] = useState<Partial<TimelineItem> | null>(null);
  const [editingPhilosophyCard, setEditingPhilosophyCard] = useState<Partial<{ id: string; title: string; description: string; iconName: string }> | null>(null);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPostItem> | null>(null);

  // In-App Delete Confirmation State (Bypasses iframe window.confirm blocking)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'slide' | 'timeline' | 'skill' | 'service' | 'project' | 'blog' | 'category' | 'message' | 'philosophyCard';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload refs for direct image uploads
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const blogFileInputRef = useRef<HTMLInputElement>(null);

  // Reset auth and inputs every time modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setIsLoggedIn(false);
      setUsernameInput('');
      setPasswordInput('');
      setLoginError(null);
      setIsRecoveryMode(false);
      setRecoveryStep('request');
    }
  }, [isOpen]);

  useEffect(() => {
    setProfileForm({ ...profile });
  }, [profile]);

  useEffect(() => {
    setSettingsForm({ ...siteSettings });
  }, [siteSettings]);

  // Load admin security settings from Firestore on boot
  useEffect(() => {
    async function loadAdminCreds() {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', 'admin'));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setNewAdminUser(data.username || 'admin');
          setAdminRecoveryEmail(data.recoveryEmail || 'engi.sohelhossen.2002@gmail.com');
          setRecoveryEmail(data.recoveryEmail || 'engi.sohelhossen.2002@gmail.com');
        } else {
          await setDoc(doc(db, 'admins', 'admin'), {
            username: 'admin',
            password: 'admin123',
            recoveryEmail: 'engi.sohelhossen.2002@gmail.com'
          }, { merge: true });
        }
      } catch (err) {
        console.warn("Notice loading admin doc:", err);
      }
    }
    loadAdminCreds();
  }, []);

  if (!isOpen) return null;

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // 1. Mandatory User ID & Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const adminDoc = await getDoc(doc(db, 'admins', 'admin'));
      let storedUser = 'admin';
      let storedPass = 'admin123';

      if (adminDoc.exists()) {
        const data = adminDoc.data();
        storedUser = data.username || 'admin';
        storedPass = data.password || 'admin123';
      } else {
        await setDoc(doc(db, 'admins', 'admin'), {
          username: 'admin',
          password: 'admin123',
          recoveryEmail: 'engi.sohelhossen.2002@gmail.com'
        });
      }

      if (usernameInput.trim() === storedUser && passwordInput === storedPass) {
        setIsLoggedIn(true);
        setLoginError(null);
        showNotification('login successfully');
      } else {
        setLoginError('user or password wring reset by email');
      }
    } catch (err: any) {
      setLoginError(err.message || 'enything is wrong?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 2. Request Recovery Code
  const handleRequestRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingCode(true);

    try {
      const adminDoc = await getDoc(doc(db, 'admins', 'admin'));
      const storedEmail = adminDoc.exists() ? (adminDoc.data().recoveryEmail || 'engi.sohelhossen.2002@gmail.com') : 'engi.sohelhossen.2002@gmail.com';

      if (recoveryEmail.trim().toLowerCase() !== storedEmail.trim().toLowerCase()) {
        showNotification('This email is not find', 'error');
        setIsSendingCode(false);
        return;
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSentRecoveryCode(generatedCode);

      await setDoc(doc(db, 'admins', 'admin'), {
        recoveryCode: generatedCode,
        recoveryRequestedAt: new Date().toISOString()
      }, { merge: true });

      setRecoveryStep('verify');
      showNotification(`send a recovery code: ${generatedCode}`);
    } catch (err: any) {
      showNotification(err.message || 'Fail', 'error');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 3. Verify Code & Set New Password
  const handleVerifyAndResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryCodeInput.trim() || !newPasswordInput.trim()) {
      showNotification('Type New Password', 'error');
      return;
    }

    try {
      const adminDoc = await getDoc(doc(db, 'admins', 'admin'));
      const activeCode = adminDoc.exists() ? adminDoc.data().recoveryCode : sentRecoveryCode;

      if (recoveryCodeInput.trim() !== activeCode) {
        showNotification('This is Recovery Code', 'error');
        return;
      }

      await setDoc(doc(db, 'admins', 'admin'), {
        password: newPasswordInput.trim(),
        recoveryCode: null
      }, { merge: true });

      showNotification('Successfully Change');
      setIsRecoveryMode(false);
      setRecoveryStep('request');
      setPasswordInput(newPasswordInput.trim());
      setLoginError(null);
    } catch (err: any) {
      showNotification(err.message || 'Anything is wrong', 'error');
    }
  };

  // 4. Save Security Credentials
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSecurity(true);
    try {
      await setDoc(doc(db, 'admins', 'admin'), {
        username: newAdminUser.trim(),
        password: newAdminPass.trim(),
        recoveryEmail: adminRecoveryEmail.trim()
      }, { merge: true });
      showNotification('Recovery is Update for Admin');
    } catch (err: any) {
      showNotification(err.message || 'Anything is wrong', 'error');
    } finally {
      setIsSavingSecurity(false);
    }
  };

  // 5. Save Site Settings (Branding, Logo, Hero, About, Services Header, Categories)
  const saveAllSettings = async (updated: SiteSettings) => {
    setIsSavingSettings(true);
    try {
      await onSaveSiteSettings(updated);
      setSettingsForm(updated);
      showNotification('Save Successfully Cloud');
    } catch (err: any) {
      showNotification(err.message || 'Anything is wrong', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Helper: File to Base64 image reader for Upload Buttons
  const handleImageFileUpload = (
    file: File, 
    onSuccess: (dataUrl: string) => void
  ) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotification('Select right image!', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotification('Image will be 2MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onSuccess(result);
        showNotification('Upload is Successfully');
      }
    };
    reader.onerror = () => {
      showNotification('Anything is wrong', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Safe In-App Delete Handler that persists directly to Firebase
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const target = { ...deleteTarget };
    setIsDeleting(true);
    try {
      switch (target.type) {
        case 'slide': {
          const updated = {
            ...settingsForm,
            heroSlides: settingsForm.heroSlides.filter(s => s.id !== target.id)
          };
          setSettingsForm(updated);
          await onSaveSiteSettings(updated);
          showNotification('Slide is clear');
          break;
        }
        case 'timeline': {
          const updated = {
            ...settingsForm,
            aboutTimeline: settingsForm.aboutTimeline.filter(t => t.id !== target.id)
          };
          setSettingsForm(updated);
          await onSaveSiteSettings(updated);
          showNotification('Clear Successfully');
          break;
        }
        case 'category': {
          const updated = {
            ...settingsForm,
            skillsCategories: settingsForm.skillsCategories.filter(c => c !== target.id)
          };
          setSettingsForm(updated);
          await onSaveSiteSettings(updated);
          showNotification('Clear Successfully');
          break;
        }
        case 'skill': {
          await onDeleteSkill(target.id);
          showNotification(`"${target.title}" Clear Successfully`);
          break;
        }
        case 'service': {
          await onDeleteService(target.id);
          showNotification(`"${target.title}" Clear Successfully`);
          break;
        }
        case 'project': {
          await onDeleteProject(target.id);
          showNotification(`"${target.title}" Clear Successfully`);
          break;
        }
        case 'blog': {
          await onDeleteBlog(target.id);
          showNotification(`"${target.title}" Clear Successfully`);
          break;
        }
        case 'message': {
          await onDeleteMessage(target.id);
          showNotification('Clear Successfully');
          break;
        }
        case 'philosophyCard': {
          const updatedCards = (settingsForm.aboutSettings.philosophyCards || []).filter(c => c.id !== target.id);
          const updated = {
            ...settingsForm,
            aboutSettings: {
              ...settingsForm.aboutSettings,
              philosophyCards: updatedCards
            }
          };
          setSettingsForm(updated);
          await onSaveSiteSettings(updated);
          showNotification('Clear Successfully');
          break;
        }
      }
      setDeleteTarget(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      showNotification(err.message || 'Clear Successfully', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Category Add / Delete
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const cat = newCategoryName.trim();
    if (settingsForm.skillsCategories.includes(cat)) {
      showNotification('Clear Successfully', 'error');
      return;
    }
    const updated = {
      ...settingsForm,
      skillsCategories: [...settingsForm.skillsCategories, cat]
    };
    await saveAllSettings(updated);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setDeleteTarget({
      type: 'category',
      id: catToDelete,
      title: `category: ${catToDelete}`
    });
  };

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="fixed inset-0 bg-[#010736]/65 backdrop-blur-md" 
        onClick={onClose} 
      />

      <div className="relative w-full max-w-6xl h-[92vh] bg-[#FFF9F2] border border-[#010736]/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 text-[#010736]">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 bg-[#FFF9F2] border-b border-[#010736]/15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-[#010736]">
                  Firebase Complete Control Panel
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  Cloud Live Sync
                </span>
              </div>
              <p className="text-xs text-[#010736]/70">
                
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  showNotification('Login Successfull');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#010736]/20 text-[#010736] hover:bg-[#F2E8DC] transition-colors shadow-sm"
              title="close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className={`px-6 py-2.5 text-xs sm:text-sm font-medium flex items-center gap-2 ${
            feedbackMsg.type === 'success' 
              ? 'bg-emerald-100 text-emerald-800 border-b border-emerald-200' 
              : 'bg-rose-100 text-rose-800 border-b border-rose-200'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* SCREEN 1: MANDATORY LOGIN WITH EMAIL RECOVERY */}
        {!isLoggedIn ? (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#FFF9F2] overflow-y-auto">
            <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-[#010736]/15 shadow-xl">
              
              {!isRecoveryMode ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center mx-auto mb-2 shadow-md">
                    <Lock className="w-7 h-7 text-amber-400" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-serif font-bold text-[#010736]">
                      Admin Login
                    </h3>
                    <p className="text-xs text-[#010736]/70 mt-1">
                      
                    </p>
                  </div>

                  {loginError && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <span>{loginError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsRecoveryMode(true);
                          setRecoveryStep('request');
                        }}
                        className="text-xs font-bold text-[#010736] underline text-left hover:text-black self-start"
                      >
                        Forget Password? email recovery →
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-bold">
                        User ID / Username
                      </label>
                      <input
                        type="text"
                        required
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                        placeholder="admin"
                        className="w-full px-4 py-3 rounded-xl border border-[#010736]/20 bg-[#FFF9F2] text-[#010736] font-medium focus:outline-none focus:border-[#010736]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 font-bold">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsRecoveryMode(true);
                            setRecoveryStep('request');
                          }}
                          className="text-[11px] text-[#010736]/70 hover:underline hover:text-[#010736]"
                        >
                          forget Password?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={passwordInput}
                          onChange={e => setPasswordInput(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-4 py-3 pr-10 rounded-xl border border-[#010736]/20 bg-[#FFF9F2] text-[#010736] font-medium focus:outline-none focus:border-[#010736]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#010736]/50 hover:text-[#010736]"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </form>
              ) : (
                /* Password Recovery Flow */
                <div className="space-y-5">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 border border-amber-300">
                    <KeyRound className="w-7 h-7" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-serif font-bold text-[#010736]">
                      Password recovery
                    </h3>
                    <p className="text-xs text-[#010736]/70 mt-1">
                      {recoveryStep === 'request'
                        ? 'send a code to your email'
                        : 'enter code and new password'}
                    </p>
                  </div>

                  {recoveryStep === 'request' ? (
                    <form onSubmit={handleRequestRecovery} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-bold">
                          Admin email
                        </label>
                        <input
                          type="email"
                          required
                          value={recoveryEmail}
                          onChange={e => setRecoveryEmail(e.target.value)}
                          placeholder="engi.sohelhossen.2002@gmail.com"
                          className="w-full px-4 py-3 rounded-xl border border-[#010736]/20 bg-[#FFF9F2] text-[#010736] focus:outline-none focus:border-[#010736]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSendingCode}
                        className="w-full py-3.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isSendingCode ? <span>Sending Code...</span> : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Again send</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsRecoveryMode(false)}
                        className="w-full text-center text-xs text-[#010736]/70 hover:underline"
                      >
                        ← Login
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyAndResetPassword} className="space-y-4">
                      {sentRecoveryCode && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800">
                          <p className="font-semibold">Verification code sent to your email:</p>
                          <p className="font-mono text-base font-bold text-[#010736] mt-1">{sentRecoveryCode}</p>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          6-Digit Recovery Code
                        </label>
                        <input
                          type="text"
                          required
                          value={recoveryCodeInput}
                          onChange={e => setRecoveryCodeInput(e.target.value)}
                          placeholder="e.g. 749215"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#010736]/20 bg-[#FFF9F2] text-[#010736] font-mono text-center tracking-widest font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={newPasswordInput}
                          onChange={e => setNewPasswordInput(e.target.value)}
                          placeholder="Enter your new password"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#010736]/20 bg-[#FFF9F2] text-[#010736]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all"
                      >
                        Update Password & Login
                      </button>
                    </form>
                  )}

                </div>
              )}

            </div>
          </div>
        ) : (
          /* SCREEN 2: AUTHORIZED CONTROL TABS */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar navigation */}
            <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#010736]/15 p-3 sm:p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible shrink-0 shadow-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'overview' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Overview & Sync</span>
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'branding' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>380×100 Logo Image</span>
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'hero' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Sliders className="w-4 h-4 text-amber-500" />
                  <span>Banner & Carousel Slides</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-bold">
                  {settingsForm.heroSlides.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'about' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>About Section Content</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'skills' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-blue-600" />
                  <span>Skills & Categories</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-bold">
                  {skills.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'services' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>Services & Headers</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-bold">
                  {services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'projects' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Projects Management</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-bold">
                  {projects.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'blogs' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-rose-600" />
                  <span>Blog Posts</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-bold">
                  {blogs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'messages' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Contact Inbox</span>
                </span>
                {unreadMessagesCount > 0 ? (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                    {unreadMessagesCount} new
                  </span>
                ) : (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-bold">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'contact' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <Mail className="w-4 h-4 text-amber-500" />
                <span>Contact Section Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  activeTab === 'security' ? 'bg-[#010736] text-[#FFF9F2] shadow-sm' : 'text-[#010736]/80 hover:bg-[#FFF9F2]'
                }`}
              >
                <KeyRound className="w-4 h-4 text-amber-500" />
                <span>Security / Password</span>
              </button>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-[#FFF9F2]">
              
              {/* TAB: CONTACT SECTION SETTINGS */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-[#010736]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#010736]">
                        Contact Section Control
                      </h3>
                      <p className="text-sm text-[#010736]/70">
                        Customize the Contact section title, subtitle, badge, email, phone, and location.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        setIsSavingSettings(true);
                        try {
                          await onSaveSiteSettings(settingsForm);
                          await onSaveProfile(profileForm);
                          showNotification('Contact section and profile updated successfully!');
                        } catch (err: any) {
                          showNotification(err.message, 'error');
                        } finally {
                          setIsSavingSettings(false);
                        }
                      }}
                      disabled={isSavingSettings}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{isSavingSettings ? 'Saving...' : 'Save Contact Settings'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    <div className="p-6 rounded-3xl bg-white border border-[#010736]/15 shadow-sm space-y-4">
                      <h4 className="font-serif font-bold text-lg text-[#010736] mb-2">Section Header & Texts</h4>
                      
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Badge Text</label>
                        <input
                          type="text"
                          value={settingsForm.contactSettings?.badge || "Let's Build Together"}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            contactSettings: { ...(settingsForm.contactSettings || { badge: '', title: '', subtitle: '' }), badge: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Main Title</label>
                        <input
                          type="text"
                          value={settingsForm.contactSettings?.title || "Get In Touch"}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            contactSettings: { ...(settingsForm.contactSettings || { badge: '', title: '', subtitle: '' }), title: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Subtitle / Description</label>
                        <textarea
                          rows={3}
                          value={settingsForm.contactSettings?.subtitle || ""}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            contactSettings: { ...(settingsForm.contactSettings || { badge: '', title: '', subtitle: '' }), subtitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                        />
                      </div>
                    </div>

                    <div className="p-6 rounded-3xl bg-white border border-[#010736]/15 shadow-sm space-y-4">
                      <h4 className="font-serif font-bold text-lg text-[#010736] mb-2">Direct Contact Details</h4>
                      
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Contact Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Phone Number / WhatsApp</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Location / Address</label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#010736]/15">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#010736]">
                        Database Overview & Real-Time Sync
                      </h3>
                      <p className="text-sm text-[#010736]/70">
                        All data is stored in Firebase Cloud Firestore and synchronized in real-time across all devices.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          await onSeedDatabase();
                          showNotification('Default portfolio data synced with Firebase successfully!');
                        } catch (err: any) {
                          showNotification(err.message || 'Seeding failed', 'error');
                        }
                      }}
                      disabled={isSeeding}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                      <span>{isSeeding ? 'Syncing to Firebase...' : 'Seed / Sync Default Data'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm">
                      <p className="text-xs font-mono uppercase text-[#010736]/60">Banner Slides</p>
                      <p className="text-3xl font-serif font-bold text-[#010736] mt-1">{settingsForm.heroSlides.length}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm">
                      <p className="text-xs font-mono uppercase text-[#010736]/60">Projects</p>
                      <p className="text-3xl font-serif font-bold text-[#010736] mt-1">{projects.length}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm">
                      <p className="text-xs font-mono uppercase text-[#010736]/60">Skills Categories</p>
                      <p className="text-3xl font-serif font-bold text-[#010736] mt-1">{settingsForm.skillsCategories.length}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm">
                      <p className="text-xs font-mono uppercase text-[#010736]/60">Inquiries</p>
                      <p className="text-3xl font-serif font-bold text-[#010736] mt-1">{messages.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 380x100 LOGO IMAGE BRANDING */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-[#010736]/15">
                    <h3 className="text-2xl font-serif font-bold text-[#010736]">
                      Navbar Logo Image (380×100 px)
                    </h3>
                    <p className="text-sm text-[#010736]/70">
                      Customize the logo displayed on the Navbar and Footer. Enter the URL of your preferred 380×100 px image or upload directly.
                    </p>
                  </div>

                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#010736]/15 shadow-sm max-w-3xl space-y-6">
                    {/* Hidden File Input for Logo */}
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageFileUpload(file, (dataUrl) => {
                            setSettingsForm(prev => ({ ...prev, logoUrl: dataUrl }));
                          });
                        }
                      }}
                    />

                    {/* Logo URL Input */}
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-2 font-bold">
                        380×100 LOGO IMAGE URL *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.logoUrl}
                        onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                        placeholder="https://... or data:image/svg+xml..."
                        className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] focus:outline-none focus:border-[#010736]"
                      />
                    </div>

                    {/* Upload Button Area requested by user in photo 1 */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F2] border-2 border-dashed border-[#010736]/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#010736] text-[#FFF9F2] flex items-center justify-center shrink-0 shadow-md">
                          <Upload className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                          <p className="font-serif font-bold text-sm text-[#010736]">
                            Upload Logo from your computer or device
                          </p>
                          <p className="text-xs text-[#010736]/65 mt-0.5">
                            Click the upload button below to select an image file (PNG, SVG, JPG)
                          </p>
                        </div>
                      </div>

                      {/* Prominent Upload Button */}
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-xs sm:text-sm hover:bg-[#010736]/90 shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer shrink-0"
                      >
                        <Upload className="w-4 h-4 text-emerald-400" />
                        <span>Upload Logo Image</span>
                      </button>
                    </div>

                    {/* Logo Preview (380 x 100) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-mono uppercase text-[#010736]/60 font-semibold">
                          Live Preview (380 × 100 px):
                        </p>
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoUrl: defaultSiteSettings.logoUrl })}
                          className="text-xs text-[#010736]/70 hover:text-[#010736] hover:underline font-mono"
                        >
                          Reset to Default Logo
                        </button>
                      </div>

                      <div className="p-4 bg-[#FFF9F2] rounded-2xl border border-[#010736]/15 flex items-center justify-center sm:justify-start">
                        <img
                          src={settingsForm.logoUrl}
                          alt="Logo Preview"
                          className="h-12 sm:h-14 w-auto max-w-[340px] object-contain rounded shadow-xs"
                          style={{ aspectRatio: '380 / 100' }}
                          onError={(e) => {
                            // fallback if broken url
                            (e.target as HTMLImageElement).src = defaultSiteSettings.logoUrl;
                          }}
                        />
                      </div>
                      <p className="text-[11px] font-mono text-[#010736]/50 mt-1.5">
                        * This logo appears across both the Navbar and Footer of the website.
                      </p>
                    </div>

                    {/* Update / Save to Firebase Button */}
                    <button
                      type="button"
                      disabled={isSavingSettings}
                      onClick={() => saveAllSettings(settingsForm)}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                    >
                      {isSavingSettings ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                          <span>Saving to Firebase...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 text-emerald-400" />
                          <span>Save & Update Logo (Sync to Firebase)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: HERO BANNER & CAROUSEL SLIDES */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#010736]/15">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#010736]">
                        Banner & Carousel Slides
                      </h3>
                      <p className="text-sm text-[#010736]/70">
                        Customize slider background images, headlines, descriptions, and CTA buttons.
                      </p>
                    </div>

                    <button
                      onClick={() => setEditingHeroSlide({
                        id: `slide-${Date.now()}`,
                        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1920&h=1080&q=80',
                        title: 'Crafting Scalable Cloud Architectures & Modern Web Apps',
                        subtitle: 'Sohel Hossen — Full Stack Engineer',
                        description: 'Specializing in high-performance web applications and resilient Firebase infrastructure.',
                        primaryBtnText: 'View Projects',
                        primaryBtnLink: '#projects',
                        secondaryBtnText: 'Contact Me',
                        secondaryBtnLink: '#contact'
                      })}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Slide</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {settingsForm.heroSlides.map((slide, index) => (
                      <div
                        key={slide.id || index}
                        className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-24 h-16 object-cover rounded-xl border border-[#010736]/15 shrink-0"
                          />
                          <div>
                            <span className="text-[11px] font-mono text-[#010736]/60 uppercase font-semibold">
                              Slide #{index + 1} &bull; {slide.subtitle}
                            </span>
                            <h4 className="font-serif font-bold text-base sm:text-lg text-[#010736] line-clamp-1">
                              {slide.title}
                            </h4>
                            <p className="text-xs text-[#010736]/70 line-clamp-1">
                              {slide.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                          <button
                            onClick={() => setEditingHeroSlide(slide)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#010736] border border-[#010736]/20 hover:bg-[#010736] hover:text-[#FFF9F2] shadow-xs text-xs font-semibold transition-colors"
                            title="Edit Slide"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          {settingsForm.heroSlides.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTarget({
                                  type: 'slide',
                                  id: slide.id,
                                  title: slide.title
                                });
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white shadow-xs text-xs font-semibold transition-colors cursor-pointer"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ABOUT SECTION CONTENT */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-[#010736]/15">
                    <h3 className="text-2xl font-serif font-bold text-[#010736]">
                      About Section Management
                    </h3>
                    <p className="text-sm text-[#010736]/70">
                      Customize the About section title, philosophy, career timeline, and bio narrative.
                    </p>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await saveAllSettings(settingsForm);
                    }}
                    className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#010736]/15 shadow-sm max-w-4xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          Section Badge *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.aboutSettings.badge}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            aboutSettings: { ...settingsForm.aboutSettings, badge: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          Section Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.aboutSettings.title}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            aboutSettings: { ...settingsForm.aboutSettings, title: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                        Narrative Headline *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.aboutSettings.narrativeHeading}
                        onChange={e => setSettingsForm({
                          ...settingsForm,
                          aboutSettings: { ...settingsForm.aboutSettings, narrativeHeading: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                        Detailed Biography *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={settingsForm.aboutSettings.narrativeBio}
                        onChange={e => setSettingsForm({
                          ...settingsForm,
                          aboutSettings: { ...settingsForm.aboutSettings, narrativeBio: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          Location
                        </label>
                        <input
                          type="text"
                          value={settingsForm.aboutSettings.location}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            aboutSettings: { ...settingsForm.aboutSettings, location: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          Availability Status Text
                        </label>
                        <input
                          type="text"
                          value={settingsForm.aboutSettings.availability}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            aboutSettings: { ...settingsForm.aboutSettings, availability: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>
                    </div>

                    {/* Timeline Milestones Sub-manager */}
                    <div className="pt-4 border-t border-[#010736]/15">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-serif font-bold text-base text-[#010736]">
                          Career Timeline Milestones
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingTimelineItem({
                            id: `t-${Date.now()}`,
                            year: '2024 - Present',
                            role: 'Software Architect',
                            company: 'Tech Solutions',
                            description: 'Leading scalable systems development.'
                          })}
                          className="text-xs font-bold text-[#010736] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Milestone</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {settingsForm.aboutTimeline.map((t, idx) => (
                          <div key={t.id || idx} className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#010736]/15 flex items-center justify-between">
                            <div>
                              <span className="text-xs font-mono font-bold text-emerald-800">{t.year}</span>
                              <p className="font-bold text-sm text-[#010736]">{t.role} - {t.company}</p>
                              <p className="text-xs text-[#010736]/70 line-clamp-1">{t.description}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => setEditingTimelineItem(t)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#010736]/20 hover:bg-[#010736] hover:text-[#FFF9F2] shadow-xs text-xs font-semibold transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget({
                                  type: 'timeline',
                                  id: t.id,
                                  title: `${t.role} (${t.year})`
                                })}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white shadow-xs text-xs font-semibold transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Philosophy Cards Sub-manager (4 highlight cards in About section) */}
                    <div className="pt-6 border-t border-[#010736]/15">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#010736]">
                            About Philosophy Cards (4 Highlights)
                          </h4>
                          <p className="text-xs text-[#010736]/70">These are the 4 highlight cards displayed on the About section that you can edit here.</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingPhilosophyCard({
                            id: `phil-${Date.now()}`,
                            title: '',
                            description: '',
                            iconName: 'Terminal'
                          })}
                          className="text-xs font-bold text-[#010736] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Philosophy Card</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(settingsForm.aboutSettings.philosophyCards || []).map((card, idx) => (
                          <div key={card.id || idx} className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#010736]/15 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Icon: {card.iconName}</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setEditingPhilosophyCard(card)}
                                    className="p-1 rounded bg-white border border-[#010736]/20 text-[#010736] hover:bg-[#010736] hover:text-[#FFF9F2]"
                                    title="Edit"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteTarget({
                                      type: 'philosophyCard',
                                      id: card.id,
                                      title: card.title
                                    })}
                                    className="p-1 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <h5 className="font-bold text-sm text-[#010736]">{card.title}</h5>
                              <p className="text-xs text-[#010736]/70 line-clamp-2 mt-1">{card.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSettings ? 'Saving...' : 'Save About Settings'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: SKILLS & DYNAMIC CATEGORIES */}
              {activeTab === 'skills' && (
                <div className="space-y-8">
                  {/* Category Manager */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#010736]/15 shadow-sm space-y-4">
                    <div className="pb-4 border-b border-[#010736]/15">
                      <h4 className="font-serif font-bold text-xl text-[#010736]">
                        Skills Category Management
                      </h4>
                      <p className="text-xs text-[#010736]/70">
                        Create, manage, and delete custom categories like Frontend, Backend, Database, Cloud & DevOps, etc.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {settingsForm.skillsCategories.map(cat => (
                        <span 
                          key={cat}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FFF9F2] text-xs font-mono font-bold text-[#010736] border border-[#010736]/20 shadow-sm"
                        >
                          <span>{cat}</span>
                          {settingsForm.skillsCategories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat)}
                              className="text-rose-600 hover:text-rose-900"
                              title="Delete Category"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Add Category Form */}
                    <div className="flex items-center gap-3 max-w-md">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="New category name (e.g. Mobile, AI Tools)"
                        className="flex-1 px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-xs sm:text-sm text-[#010736] focus:outline-none focus:border-[#010736]"
                      />
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] text-xs font-bold hover:bg-[#010736]/90 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Category</span>
                      </button>
                    </div>
                  </div>

                  {/* Skills List & Addition */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#010736]/15">
                      <h4 className="font-serif font-bold text-xl text-[#010736]">
                        Skill Items Management
                      </h4>
                      <button
                        onClick={() => setEditingSkill({
                          name: '',
                          category: settingsForm.skillsCategories[0] || 'Frontend',
                          proficiency: 85,
                          order: skills.length + 1
                        })}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#010736] text-[#FFF9F2] text-xs font-bold hover:bg-[#010736]/90 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add New Skill</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {skills.map(sk => (
                        <div key={sk.id} className="p-4 rounded-xl bg-white border border-[#010736]/15 shadow-sm flex items-center justify-between">
                          <div className="overflow-hidden pr-2">
                            <h4 className="font-bold text-sm text-[#010736] truncate">{sk.name}</h4>
                            <span className="text-xs text-[#010736]/60">{sk.category} • {sk.proficiency}%</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setEditingSkill(sk)}
                              className="p-2 rounded-lg bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 hover:bg-[#010736] hover:text-[#FFF9F2] shadow-xs transition-colors"
                              title="Edit Skill"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTarget({
                                  type: 'skill',
                                  id: sk.id,
                                  title: sk.name
                                });
                              }}
                              className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 shadow-xs transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SERVICES & SECTION HEADERS */}
              {activeTab === 'services' && (
                <div className="space-y-8">
                  {/* Header Texts Form */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#010736]/15 shadow-sm space-y-4 max-w-4xl">
                    <div className="pb-4 border-b border-[#010736]/15">
                      <h4 className="font-serif font-bold text-xl text-[#010736]">
                        Services Section Header & Settings
                      </h4>
                      <p className="text-xs text-[#010736]/70">
                        Customize section titles and descriptions for the Services section.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          Section Badge *
                        </label>
                        <input
                          type="text"
                          value={settingsForm.servicesHeader.badge}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            servicesHeader: { ...settingsForm.servicesHeader, badge: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                          Main Title *
                        </label>
                        <input
                          type="text"
                          value={settingsForm.servicesHeader.title}
                          onChange={e => setSettingsForm({
                            ...settingsForm,
                            servicesHeader: { ...settingsForm.servicesHeader, title: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                        Subtitle / Description *
                      </label>
                      <textarea
                        rows={2}
                        value={settingsForm.servicesHeader.subtitle}
                        onChange={e => setSettingsForm({
                          ...settingsForm,
                          servicesHeader: { ...settingsForm.servicesHeader, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isSavingSettings}
                      onClick={() => saveAllSettings(settingsForm)}
                      className="px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] text-xs font-bold hover:bg-[#010736]/90 shadow-sm transition-all"
                    >
                      Save Services Header
                    </button>
                  </div>

                  {/* Services List */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#010736]/15">
                      <h4 className="font-serif font-bold text-xl text-[#010736]">
                        Service Offerings Management
                      </h4>
                      <button
                        onClick={() => setEditingService({
                          title: '',
                          description: '',
                          iconName: 'Code',
                          features: 'High Performance • Clean Architecture • Cloud Deploy',
                          priceRange: 'Custom Project Based',
                          order: services.length + 1
                        })}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#010736] text-[#FFF9F2] text-xs font-bold hover:bg-[#010736]/90 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add New Service</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(serv => (
                        <div key={serv.id} className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono text-emerald-700 font-semibold">Icon: {serv.iconName || 'Code'}</span>
                              <span className="text-xs font-mono text-[#010736]/70 font-semibold">{serv.priceRange}</span>
                            </div>
                            <h4 className="font-serif font-bold text-lg text-[#010736] mb-1">
                              {serv.title}
                            </h4>
                            <p className="text-xs text-[#010736]/75 mb-3 leading-relaxed">
                              {serv.description}
                            </p>
                            <p className="text-[11px] font-mono text-[#010736]/50">
                              Features: {serv.features}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-[#010736]/10 flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingService(serv)}
                              className="p-2 rounded-lg bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 hover:bg-[#010736] hover:text-[#FFF9F2] shadow-xs transition-colors"
                              title="Edit Service"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTarget({
                                  type: 'service',
                                  id: serv.id,
                                  title: serv.title
                                });
                              }}
                              className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 shadow-xs transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: PROJECTS MANAGEMENT */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#010736]/15">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#010736]">
                        Projects Portfolio Management
                      </h3>
                      <p className="text-sm text-[#010736]/70">
                        Add new portfolio projects or edit and remove existing featured works.
                      </p>
                    </div>

                    <button
                      onClick={() => setEditingProject({
                        title: '',
                        category: settingsForm.skillsCategories[0] || 'Full Stack',
                        description: '',
                        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=800&q=80',
                        tags: 'React, TypeScript, Firebase',
                        liveUrl: '',
                        githubUrl: '',
                        featured: true,
                        order: projects.length + 1
                      })}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add New Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(proj => (
                      <div key={proj.id} className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#FFF9F2] text-[#010736] font-semibold border border-[#010736]/10">
                              {proj.category}
                            </span>
                            {proj.featured && (
                              <span className="text-[11px] font-bold text-amber-600">★ Featured</span>
                            )}
                          </div>
                          <h4 className="font-serif font-bold text-lg text-[#010736] mb-1">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-[#010736]/70 line-clamp-2 mb-3">
                            {proj.description}
                          </p>
                          <p className="text-[11px] font-mono text-[#010736]/50 truncate">
                            Tags: {proj.tags}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#010736]/10 flex items-center justify-between">
                          <span className="text-xs font-mono text-[#010736]/50">Order #{proj.order || 1}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingProject(proj)}
                              className="p-2 rounded-lg bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 hover:bg-[#010736] hover:text-[#FFF9F2] shadow-xs transition-colors"
                              title="Edit Project"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTarget({
                                  type: 'project',
                                  id: proj.id,
                                  title: proj.title
                                });
                              }}
                              className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 shadow-xs transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: BLOGS */}
              {activeTab === 'blogs' && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#010736]/15">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#010736]">
                        Articles & Blog Posts Management
                      </h3>
                      <p className="text-sm text-[#010736]/70">
                        Publish new technical articles, edit existing posts, or remove them.
                      </p>
                    </div>

                    <button
                      onClick={() => setEditingBlog({
                        title: '',
                        category: settingsForm.skillsCategories[0] || 'Cloud & DevOps',
                        summary: '',
                        content: '',
                        readTime: '4 min read',
                        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=800&q=80',
                        published: true,
                        createdAt: new Date().toISOString().split('T')[0],
                        likes: 0
                      })}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Write New Article</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {blogs.map(b => (
                      <div key={b.id} className="p-5 rounded-2xl bg-white border border-[#010736]/15 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FFF9F2] text-[#010736] border border-[#010736]/10 font-semibold">
                              {b.category}
                            </span>
                            <span className="text-xs text-[#010736]/60">
                              {b.createdAt} &bull; {b.likes} Likes
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-base sm:text-lg text-[#010736]">
                            {b.title}
                          </h4>
                          <p className="text-xs text-[#010736]/70 line-clamp-1">
                            {b.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            onClick={() => setEditingBlog(b)}
                            className="p-2 rounded-lg bg-[#FFF9F2] text-[#010736] border border-[#010736]/15 hover:bg-[#010736] hover:text-[#FFF9F2] shadow-xs transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setDeleteTarget({
                                type: 'blog',
                                id: b.id,
                                title: b.title
                              });
                            }}
                            className="p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 shadow-xs transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 9: INBOX MESSAGES */}
              {activeTab === 'messages' && (
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#010736]/15">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-[#010736]">
                        Visitor Inbox Messages
                      </h3>
                      <p className="text-sm text-[#010736]/70">
                        Direct messages submitted through the website Contact form in Firebase.
                      </p>
                    </div>

                    <span className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-white text-[#010736] border border-[#010736]/15 shadow-sm font-semibold">
                      Total: {messages.length} ({unreadMessagesCount} unread)
                    </span>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-16 p-8 rounded-3xl bg-white border border-[#010736]/15 shadow-sm">
                      <Mail className="w-12 h-12 text-[#010736]/20 mx-auto mb-3" />
                      <p className="text-base text-[#010736] font-serif font-bold">Inbox is empty</p>
                      <p className="text-xs text-[#010736]/50 mt-1">
                        Messages sent by visitors will appear here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`p-6 rounded-2xl border transition-all shadow-sm ${
                            !msg.read ? 'bg-amber-50/50 border-amber-300' : 'bg-white border-[#010736]/15'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-lg text-[#010736]">{msg.name}</h4>
                              {!msg.read && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">NEW</span>
                              )}
                            </div>
                            <span className="text-xs font-mono text-[#010736]/60">{msg.createdAt || 'Recent'}</span>
                          </div>

                          <div className="text-xs text-[#010736]/80 font-mono mb-2">
                            <span>From: <strong>{msg.email}</strong></span>
                            {msg.subject && <span className="ml-2">| Subject: <strong>{msg.subject}</strong></span>}
                          </div>

                          <div className="p-4 rounded-xl bg-[#FFF9F2] border border-[#010736]/10 text-sm text-[#010736] leading-relaxed mb-4 whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#010736] text-[#FFF9F2] text-xs font-semibold hover:bg-[#010736]/90 transition-colors shadow-sm"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                <span>Reply via Email</span>
                              </a>
                              <button
                                onClick={async () => {
                                  await onToggleMessageRead(msg.id, msg.read);
                                  showNotification('Message status updated');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#FFF9F2] text-[#010736] text-xs font-medium hover:border-[#010736] border border-[#010736]/15"
                              >
                                {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeleteTarget({
                                  type: 'message',
                                  id: msg.id,
                                  title: `Message from ${msg.name}`
                                });
                              }}
                              className="p-1.5 rounded-lg text-rose-700 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 10: SECURITY CREDENTIALS */}
              {activeTab === 'security' && (
                <div>
                  <div className="pb-6 mb-6 border-b border-[#010736]/15">
                    <h3 className="text-2xl font-serif font-bold text-[#010736]">
                      Security & Password Management
                    </h3>
                    <p className="text-sm text-[#010736]/70">
                      Update your dashboard User ID, password, and recovery email. Changes are saved to Firebase Cloud and take effect across all devices immediately.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSecurity} className="space-y-6 max-w-xl bg-white p-6 sm:p-8 rounded-3xl border border-[#010736]/15 shadow-sm">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-bold">
                        Admin User ID / Username *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminUser}
                        onChange={e => setNewAdminUser(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] font-semibold focus:outline-none focus:border-[#010736]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-bold">
                        Admin Password *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminPass}
                        onChange={e => setNewAdminPass(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] font-mono focus:outline-none focus:border-[#010736]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1.5 font-bold">
                        Password Recovery Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={adminRecoveryEmail}
                        onChange={e => setAdminRecoveryEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] focus:outline-none focus:border-[#010736]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSecurity}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 transition-all shadow-md disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSecurity ? 'Saving...' : 'Save New Credentials'}</span>
                    </button>
                  </form>
                </div>
              )}

            </main>
          </div>
        )}

      </div>

      {/* MODAL: EDIT / ADD HERO SLIDE */}
      {editingHeroSlide && (() => {
        const isEditingExisting = settingsForm.heroSlides.some(s => s.id === editingHeroSlide.id);
        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingHeroSlide(null)} />
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] max-h-[90vh] overflow-y-auto border border-[#010736]/20">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#010736]/15">
                <h3 className="font-serif font-bold text-2xl text-[#010736]">
                  {isEditingExisting ? 'Update Hero Slide' : 'Add New Hero Slide'}
                </h3>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingHeroSlide(null)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#010736]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Hidden file input for slide image */}
              <input
                ref={slideFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageFileUpload(file, (dataUrl) => {
                      setEditingHeroSlide(prev => ({ ...prev, image: dataUrl }));
                    });
                  }
                }}
              />
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  let updatedSlides = [...settingsForm.heroSlides];
                  const existingIdx = updatedSlides.findIndex(s => s.id === editingHeroSlide.id);
                  if (existingIdx >= 0) {
                    updatedSlides[existingIdx] = editingHeroSlide as HeroSlideItem;
                  } else {
                    updatedSlides.push(editingHeroSlide as HeroSlideItem);
                  }
                  await onSaveSiteSettings({ ...settingsForm, heroSlides: updatedSlides });
                  setSettingsForm({ ...settingsForm, heroSlides: updatedSlides });
                  setEditingHeroSlide(null);
                  showNotification(isEditingExisting ? 'Slide updated successfully!' : 'New slide added successfully!');
                } catch (err: any) {
                  showNotification(err.message || 'Failed to save slide', 'error');
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 font-bold">Slide Image URL *</label>
                    <button
                      type="button"
                      onClick={() => slideFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#010736] text-[#FFF9F2] text-xs font-semibold hover:bg-[#010736]/85 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Upload Image</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.image || ''}
                    onChange={e => setEditingHeroSlide({ ...editingHeroSlide, image: e.target.value })}
                    placeholder="https://images.unsplash.com/... or upload image"
                    className="w-full px-3 py-2.5 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                  {editingHeroSlide.image && (
                    <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-[#010736]/15">
                      <img src={editingHeroSlide.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Headline / Main Title *</label>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.title || ''}
                    onChange={e => setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })}
                    placeholder="Crafting Scalable Cloud Architectures & Modern Web Apps"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Subtitle / Tagline *</label>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.subtitle || ''}
                    onChange={e => setEditingHeroSlide({ ...editingHeroSlide, subtitle: e.target.value })}
                    placeholder="Sohel Hossen — Full Stack Engineer & Cloud Architect"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Description / Summary</label>
                  <textarea
                    rows={3}
                    value={editingHeroSlide.description || ''}
                    onChange={e => setEditingHeroSlide({ ...editingHeroSlide, description: e.target.value })}
                    placeholder="Specializing in high-performance web applications..."
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Button 1 Text</label>
                    <input
                      type="text"
                      value={editingHeroSlide.primaryBtnText || ''}
                      onChange={e => setEditingHeroSlide({ ...editingHeroSlide, primaryBtnText: e.target.value })}
                      placeholder="View Projects"
                      className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Button 1 Link (#projects)</label>
                    <input
                      type="text"
                      value={editingHeroSlide.primaryBtnLink || ''}
                      onChange={e => setEditingHeroSlide({ ...editingHeroSlide, primaryBtnLink: e.target.value })}
                      placeholder="#projects"
                      className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Button 2 Text</label>
                    <input
                      type="text"
                      value={editingHeroSlide.secondaryBtnText || ''}
                      onChange={e => setEditingHeroSlide({ ...editingHeroSlide, secondaryBtnText: e.target.value })}
                      placeholder="Contact Me"
                      className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Button 2 Link (#contact)</label>
                    <input
                      type="text"
                      value={editingHeroSlide.secondaryBtnLink || ''}
                      onChange={e => setEditingHeroSlide({ ...editingHeroSlide, secondaryBtnLink: e.target.value })}
                      placeholder="#contact"
                      className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setEditingHeroSlide(null)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Updating in Firebase...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-emerald-400" />
                        <span>{isEditingExisting ? 'Update Slide' : 'Save New Slide'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL: EDIT / ADD TIMELINE ITEM */}
      {editingTimelineItem && (() => {
        const isEditingExisting = settingsForm.aboutTimeline.some(t => t.id === editingTimelineItem.id);
        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingTimelineItem(null)} />
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] border border-[#010736]/20">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#010736]/15">
                <h3 className="font-serif font-bold text-xl text-[#010736]">
                  {isEditingExisting ? 'Update Milestone' : 'Add New Milestone'}
                </h3>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingTimelineItem(null)}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#010736]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                try {
                  let updatedTimeline = [...settingsForm.aboutTimeline];
                  const existingIdx = updatedTimeline.findIndex(t => t.id === editingTimelineItem.id);
                  if (existingIdx >= 0) {
                    updatedTimeline[existingIdx] = editingTimelineItem as TimelineItem;
                  } else {
                    updatedTimeline.push(editingTimelineItem as TimelineItem);
                  }
                  await onSaveSiteSettings({ ...settingsForm, aboutTimeline: updatedTimeline });
                  setSettingsForm({ ...settingsForm, aboutTimeline: updatedTimeline });
                  setEditingTimelineItem(null);
                  showNotification(isEditingExisting ? 'Milestone updated successfully!' : 'New milestone saved successfully!');
                } catch (err: any) {
                  showNotification(err.message || 'Failed to save', 'error');
                } finally {
                  setIsSubmitting(false);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Year / Timeline Period *</label>
                  <input
                    type="text"
                    required
                    value={editingTimelineItem.year || ''}
                    onChange={e => setEditingTimelineItem({ ...editingTimelineItem, year: e.target.value })}
                    placeholder="2024 - Present"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Role / Degree *</label>
                  <input
                    type="text"
                    required
                    value={editingTimelineItem.role || ''}
                    onChange={e => setEditingTimelineItem({ ...editingTimelineItem, role: e.target.value })}
                    placeholder="Senior Software Engineer"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Company / University *</label>
                  <input
                    type="text"
                    required
                    value={editingTimelineItem.company || ''}
                    onChange={e => setEditingTimelineItem({ ...editingTimelineItem, company: e.target.value })}
                    placeholder="Enterprise Freelance / University"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Description</label>
                  <textarea
                    rows={2}
                    value={editingTimelineItem.description || ''}
                    onChange={e => setEditingTimelineItem({ ...editingTimelineItem, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setEditingTimelineItem(null)}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-emerald-400" />
                        <span>{isEditingExisting ? 'Update Milestone' : 'Save Milestone'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* MODAL: EDIT / ADD PROJECT */}
      {editingProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingProject(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] max-h-[90vh] overflow-y-auto border border-[#010736]/20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#010736]/15">
              <h3 className="font-serif font-bold text-2xl text-[#010736]">
                {editingProject.id ? 'Update Project' : 'Add New Project'}
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setEditingProject(null)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#010736]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden file input for Project image */}
            <input
              ref={projectFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageFileUpload(file, (dataUrl) => {
                    setEditingProject(prev => ({ ...prev, image: dataUrl }));
                  });
                }
              }}
            />
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await onSaveProject(editingProject);
                setEditingProject(null);
                showNotification(editingProject.id ? 'Project updated successfully!' : 'New project saved successfully!');
              } catch (err: any) {
                showNotification(err.message || 'Failed to save project', 'error');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Title *</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Category *</label>
                  <select
                    value={editingProject.category || settingsForm.skillsCategories[0] || 'Full Stack'}
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  >
                    {settingsForm.skillsCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Full Stack">Full Stack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Display Order</label>
                  <input
                    type="number"
                    value={editingProject.order || 1}
                    onChange={e => setEditingProject({ ...editingProject, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingProject.description || ''}
                  onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 font-bold">Project Image / Screenshot</label>
                  <button
                    type="button"
                    onClick={() => projectFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#010736] text-[#FFF9F2] text-xs font-semibold hover:bg-[#010736]/85 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload Image</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editingProject.image || ''}
                  onChange={e => setEditingProject({ ...editingProject, image: e.target.value })}
                  placeholder="https://... or upload image"
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
                {editingProject.image && (
                  <div className="mt-2 h-24 w-full rounded-xl overflow-hidden border border-[#010736]/15">
                    <img src={editingProject.image} alt="Project Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={editingProject.tags || ''}
                  onChange={e => setEditingProject({ ...editingProject, tags: e.target.value })}
                  placeholder="React, TypeScript, Firebase"
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Live Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ''}
                    onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">GitHub Repo URL</label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ''}
                    onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={editingProject.featured || false}
                  onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#010736]"
                />
                <label htmlFor="featuredCheck" className="text-sm font-semibold text-[#010736]">
                  Mark as Featured Project
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{editingProject.id ? 'Update Project' : 'Save New Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD SKILL */}
      {editingSkill && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingSkill(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] border border-[#010736]/20">
            <h3 className="font-serif font-bold text-2xl mb-4 text-[#010736]">
              {editingSkill.id ? 'Update Skill' : 'Add New Skill'}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await onSaveSkill(editingSkill);
                setEditingSkill(null);
                showNotification(editingSkill.id ? 'Skill updated successfully!' : 'New skill added successfully!');
              } catch (err: any) {
                showNotification(err.message, 'error');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ''}
                  onChange={e => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Category *</label>
                <select
                  value={editingSkill.category || settingsForm.skillsCategories[0] || 'Frontend'}
                  onChange={e => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                >
                  {settingsForm.skillsCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">
                  Proficiency ({editingSkill.proficiency || 80}%)
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={editingSkill.proficiency || 80}
                  onChange={e => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                  className="w-full accent-[#010736]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingSkill(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{editingSkill.id ? 'Update Skill' : 'Save Skill'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD SERVICE */}
      {editingService && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingService(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] border border-[#010736]/20">
            <h3 className="font-serif font-bold text-2xl mb-4 text-[#010736]">
              {editingService.id ? 'Update Service' : 'Add New Service'}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await onSaveService(editingService);
                setEditingService(null);
                showNotification(editingService.id ? 'Service updated successfully!' : 'New service added successfully!');
              } catch (err: any) {
                showNotification(err.message, 'error');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title || ''}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingService.description || ''}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Icon Type</label>
                  <select
                    value={editingService.iconName || 'Code'}
                    onChange={e => setEditingService({ ...editingService, iconName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  >
                    <option value="Code">Code</option>
                    <option value="Flame">Flame (Firebase)</option>
                    <option value="Layout">Layout</option>
                    <option value="Zap">Zap (Performance)</option>
                    <option value="Server">Server</option>
                    <option value="ShieldCheck">Shield (Security)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Price Tag</label>
                  <input
                    type="text"
                    value={editingService.priceRange || ''}
                    onChange={e => setEditingService({ ...editingService, priceRange: e.target.value })}
                    placeholder="Custom Project Based"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Features (Bullet points)</label>
                <input
                  type="text"
                  value={editingService.features || ''}
                  onChange={e => setEditingService({ ...editingService, features: e.target.value })}
                  placeholder="Clean Code • Realtime Sync • Cloud Deploy"
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{editingService.id ? 'Update Service' : 'Save Service'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD BLOG */}
      {editingBlog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingBlog(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] max-h-[90vh] overflow-y-auto border border-[#010736]/20">
            <h3 className="font-serif font-bold text-2xl mb-4 text-[#010736]">
              {editingBlog.id ? 'Update Article' : 'Publish New Article'}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                await onSaveBlog(editingBlog);
                setEditingBlog(null);
                showNotification(editingBlog.id ? 'Article updated successfully!' : 'Article published successfully!');
              } catch (err: any) {
                showNotification(err.message, 'error');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Article Title *</label>
                <input
                  type="text"
                  required
                  value={editingBlog.title || ''}
                  onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Category *</label>
                  <select
                    value={editingBlog.category || settingsForm.skillsCategories[0] || 'Cloud & DevOps'}
                    onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  >
                    {settingsForm.skillsCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Security & Cloud">Security & Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Read Time</label>
                  <input
                    type="text"
                    value={editingBlog.readTime || '4 min read'}
                    onChange={e => setEditingBlog({ ...editingBlog, readTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono uppercase text-[#010736]/70 font-bold">Cover Image</label>
                  <button
                    type="button"
                    onClick={() => blogFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#010736] text-[#FFF9F2] hover:bg-[#010736]/80 transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Image</span>
                  </button>
                </div>
                <input
                  ref={blogFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageFileUpload(file, (base64) => {
                        setEditingBlog(prev => prev ? { ...prev, coverImage: base64 } : prev);
                        showNotification('Cover image selected successfully!');
                      });
                    }
                  }}
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="url"
                    value={editingBlog.coverImage || ''}
                    onChange={e => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                    placeholder="https://... or click button above to upload"
                    className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                  />
                  {editingBlog.coverImage && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#010736]/20 shrink-0 bg-[#010736]/5">
                      <img src={editingBlog.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingBlog.summary || ''}
                  onChange={e => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Content (Article Body) *</label>
                <textarea
                  rows={6}
                  required
                  value={editingBlog.content || ''}
                  onChange={e => setEditingBlog({ ...editingBlog, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingBlog(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-semibold text-sm hover:bg-[#010736]/90 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{editingBlog.id ? 'Update Article' : 'Publish Article'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD PHILOSOPHY CARD */}
      {editingPhilosophyCard && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#010736]/60 backdrop-blur-sm" onClick={() => !isSubmitting && setEditingPhilosophyCard(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50 text-[#010736] border border-[#010736]/20">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#010736]/15">
              <h3 className="font-serif font-bold text-xl text-[#010736]">
                {editingPhilosophyCard.id && (settingsForm.aboutSettings.philosophyCards || []).some(c => c.id === editingPhilosophyCard.id) ? 'Update Philosophy Card' : 'Add New Philosophy Card'}
              </h3>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setEditingPhilosophyCard(null)}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#010736]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              try {
                let cards = [...(settingsForm.aboutSettings.philosophyCards || [])];
                const existingIdx = cards.findIndex(c => c.id === editingPhilosophyCard.id);
                if (existingIdx >= 0) {
                  cards[existingIdx] = editingPhilosophyCard as any;
                } else {
                  cards.push(editingPhilosophyCard as any);
                }
                const updated = {
                  ...settingsForm,
                  aboutSettings: {
                    ...settingsForm.aboutSettings,
                    philosophyCards: cards
                  }
                };
                setSettingsForm(updated);
                await onSaveSiteSettings(updated);
                setEditingPhilosophyCard(null);
                showNotification('Philosophy card saved successfully!');
              } catch (err: any) {
                showNotification(err.message || 'Failed to save', 'error');
              } finally {
                setIsSubmitting(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Card Title *</label>
                <input
                  type="text"
                  required
                  value={editingPhilosophyCard.title || ''}
                  onChange={e => setEditingPhilosophyCard({ ...editingPhilosophyCard, title: e.target.value })}
                  placeholder="Full Stack Mastery"
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Icon Name (e.g. Terminal, Cpu, Sparkles) *</label>
                <select
                  value={editingPhilosophyCard.iconName || 'Terminal'}
                  onChange={e => setEditingPhilosophyCard({ ...editingPhilosophyCard, iconName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736]"
                >
                  <option value="Terminal">Terminal</option>
                  <option value="ShieldCheck">ShieldCheck</option>
                  <option value="Cpu">Cpu</option>
                  <option value="Sparkles">Sparkles</option>
                  <option value="CheckCircle2">CheckCircle2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#010736]/70 mb-1 font-bold">Card Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPhilosophyCard.description || ''}
                  onChange={e => setEditingPhilosophyCard({ ...editingPhilosophyCard, description: e.target.value })}
                  placeholder="End-to-end fluency with React 19, TypeScript..."
                  className="w-full px-3 py-2 bg-[#FFF9F2] border border-[#010736]/20 rounded-xl text-sm text-[#010736] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#010736]/15">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingPhilosophyCard(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#010736] text-[#FFF9F2] font-bold text-sm hover:bg-[#010736]/90 shadow-md"
                >
                  {isSubmitting ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL IN-APP DELETE CONFIRMATION MODAL (Root Level with z-[99999]) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-[#010736]/80 backdrop-blur-sm"
            onClick={() => !isDeleting && setDeleteTarget(null)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-50 text-[#010736] border-2 border-rose-400 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5 mb-4 text-rose-600">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#010736]">Are you sure you want to delete this item?</h3>
                <p className="text-xs text-[#010736]/70">This will permanently delete the item from Firebase Firestore.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-[#010736] mb-5">
              <span className="font-bold block truncate text-rose-900">
                "{deleteTarget.title}"
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#010736] text-sm font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
