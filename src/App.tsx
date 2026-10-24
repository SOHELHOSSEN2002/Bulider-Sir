/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  increment,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { 
  db, 
  testConnection 
} from './lib/firebase';
import { 
  ProfileData, 
  ProjectItem, 
  SkillItem, 
  ServiceItem, 
  BlogPostItem, 
  ContactMessageItem,
  SiteSettings
} from './types';
import { 
  defaultProfile, 
  defaultProjects, 
  defaultSkills, 
  defaultServices, 
  defaultBlogs,
  defaultSiteSettings
} from './lib/defaultData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Services } from './components/Services';
import { Projects } from './components/Projects';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [prefilledSubject, setPrefilledSubject] = useState('');

  // Firestore Real-Time Data State
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [projects, setProjects] = useState<ProjectItem[]>(defaultProjects);
  const [skills, setSkills] = useState<SkillItem[]>(defaultSkills);
  const [services, setServices] = useState<ServiceItem[]>(defaultServices);
  const [blogs, setBlogs] = useState<BlogPostItem[]>(defaultBlogs);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  // 1. Connection check and Auto-Seed per collection if Firestore is empty on initial boot
  useEffect(() => {
    testConnection();

    async function checkAndAutoSeed() {
      try {
        // Check and seed settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'site'));
        if (!settingsSnap.exists()) {
          await setDoc(doc(db, 'settings', 'site'), defaultSiteSettings, { merge: true });
        }

        // Check and seed profile
        const profileSnap = await getDoc(doc(db, 'profile', 'info'));
        if (!profileSnap.exists()) {
          await setDoc(doc(db, 'profile', 'info'), defaultProfile, { merge: true });
        }

        // Check and seed projects
        const projectsSnap = await getDocs(collection(db, 'projects'));
        if (projectsSnap.empty) {
          for (const p of defaultProjects) {
            await setDoc(doc(db, 'projects', p.id), p, { merge: true });
          }
        }

        // Check and seed skills
        const skillsSnap = await getDocs(collection(db, 'skills'));
        if (skillsSnap.empty) {
          for (const s of defaultSkills) {
            await setDoc(doc(db, 'skills', s.id), s, { merge: true });
          }
        }

        // Check and seed services
        const servicesSnap = await getDocs(collection(db, 'services'));
        if (servicesSnap.empty) {
          for (const sv of defaultServices) {
            await setDoc(doc(db, 'services', sv.id), sv, { merge: true });
          }
        }

        // Check and seed blogs
        const blogsSnap = await getDocs(collection(db, 'blogs'));
        if (blogsSnap.empty) {
          for (const bl of defaultBlogs) {
            await setDoc(doc(db, 'blogs', bl.id), bl, { merge: true });
          }
        }

        // Seed admin default credentials
        const adminSnap = await getDoc(doc(db, 'admins', 'admin'));
        if (!adminSnap.exists()) {
          await setDoc(doc(db, 'admins', 'admin'), {
            username: 'admin',
            password: 'admin123',
            recoveryEmail: 'engi.sohelhossen.2002@gmail.com'
          }, { merge: true });
        }
      } catch (err) {
        console.warn("Auto-seed check notice:", err);
      }
    }
    checkAndAutoSeed();
  }, []);

  // 2. Real-time Listeners across all devices (multi-device synchronization)
  useEffect(() => {
    // Site Settings Real-time Sync (380x100 logo, Hero Carousel Slides, About, Dynamic Categories, Services Header)
    const settingsRef = doc(db, 'settings', 'site');
    const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<SiteSettings>;
        setSiteSettings(prev => ({
          ...defaultSiteSettings,
          ...data,
          aboutSettings: { ...defaultSiteSettings.aboutSettings, ...(data.aboutSettings || {}) },
          servicesHeader: { ...defaultSiteSettings.servicesHeader, ...(data.servicesHeader || {}) },
          heroSlides: data.heroSlides && data.heroSlides.length > 0 ? data.heroSlides : defaultSiteSettings.heroSlides,
          aboutTimeline: data.aboutTimeline && data.aboutTimeline.length > 0 ? data.aboutTimeline : defaultSiteSettings.aboutTimeline,
          skillsCategories: data.skillsCategories && data.skillsCategories.length > 0 ? data.skillsCategories : defaultSiteSettings.skillsCategories,
        }));
      }
    }, (error) => {
      console.warn("Settings sync listener:", error.message);
    });

    // Profile Real-time Sync
    const profileRef = doc(db, 'profile', 'info');
    const unsubProfile = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ProfileData;
        setProfile({ ...defaultProfile, ...data });
      }
    }, (error) => {
      console.warn("Profile sync listener:", error.message);
    });

    // Projects Real-time Sync
    const projectsRef = collection(db, 'projects');
    const unsubProjects = onSnapshot(projectsRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectItem[];
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      setProjects(items);
    }, (error) => {
      console.warn("Projects sync listener:", error.message);
    });

    // Skills Real-time Sync
    const skillsRef = collection(db, 'skills');
    const unsubSkills = onSnapshot(skillsRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SkillItem[];
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSkills(items);
    }, (error) => {
      console.warn("Skills sync listener:", error.message);
    });

    // Services Real-time Sync
    const servicesRef = collection(db, 'services');
    const unsubServices = onSnapshot(servicesRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServiceItem[];
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      setServices(items);
    }, (error) => {
      console.warn("Services sync listener:", error.message);
    });

    // Blogs Real-time Sync
    const blogsRef = collection(db, 'blogs');
    const unsubBlogs = onSnapshot(blogsRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPostItem[];
      setBlogs(items);
    }, (error) => {
      console.warn("Blogs sync listener:", error.message);
    });

    // Messages Real-time Sync
    const messagesRef = collection(db, 'messages');
    const unsubMessages = onSnapshot(messagesRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessageItem[];
      items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setMessages(items);
    }, (error) => {
      console.warn("Messages sync listener:", error.message);
    });

    return () => {
      unsubSettings();
      unsubProfile();
      unsubProjects();
      unsubSkills();
      unsubServices();
      unsubBlogs();
      unsubMessages();
    };
  }, []);

  // 3. Scroll spy to track active section
  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'services', 'projects', 'blog', 'contact'];
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section) {
          const top = section.offsetTop - offset;
          if (scrollY >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation Handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Like Blog Post (Firestore atomic increment)
  const handleLikePost = async (blogId: string) => {
    try {
      const postRef = doc(db, 'blogs', blogId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (err) {
      setBlogs(prev => prev.map(b => b.id === blogId ? { ...b, likes: b.likes + 1 } : b));
    }
  };

  // Send Contact Message (Firestore mutation)
  const handleSendMessage = async (msg: { name: string; email: string; subject: string; message: string }) => {
    const newMsg = {
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      read: false,
      replied: false,
      createdAt: new Date().toLocaleString()
    };
    await addDoc(collection(db, 'messages'), newMsg);
  };

  // Admin CRUD Actions (Cloud Firestore writes for real-time multi-device sync)
  const handleSaveSiteSettings = async (newSettings: SiteSettings) => {
    await setDoc(doc(db, 'settings', 'site'), newSettings, { merge: true });
    setSiteSettings(newSettings);
  };

  const handleSaveProfile = async (newProfile: ProfileData) => {
    await setDoc(doc(db, 'profile', 'info'), {
      ...newProfile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    setProfile(newProfile);
  };

  const handleSaveProject = async (proj: Partial<ProjectItem>) => {
    if (proj.id) {
      await setDoc(doc(db, 'projects', proj.id), proj, { merge: true });
    } else {
      await addDoc(collection(db, 'projects'), {
        ...proj,
        createdAt: new Date().toISOString()
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    try {
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (err) {
      console.warn("Delete project error:", err);
    }
  };

  const handleSaveSkill = async (sk: Partial<SkillItem>) => {
    if (sk.id) {
      await setDoc(doc(db, 'skills', sk.id), sk, { merge: true });
    } else {
      await addDoc(collection(db, 'skills'), sk);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    setSkills(prev => prev.filter(s => s.id !== skillId));
    try {
      await deleteDoc(doc(db, 'skills', skillId));
    } catch (err) {
      console.warn("Delete skill error:", err);
    }
  };

  const handleSaveService = async (serv: Partial<ServiceItem>) => {
    if (serv.id) {
      await setDoc(doc(db, 'services', serv.id), serv, { merge: true });
    } else {
      await addDoc(collection(db, 'services'), serv);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (err) {
      console.warn("Delete service error:", err);
    }
  };

  const handleSaveBlog = async (b: Partial<BlogPostItem>) => {
    if (b.id) {
      await setDoc(doc(db, 'blogs', b.id), b, { merge: true });
    } else {
      await addDoc(collection(db, 'blogs'), {
        ...b,
        createdAt: new Date().toISOString().split('T')[0],
        likes: 0
      });
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    setBlogs(prev => prev.filter(b => b.id !== blogId));
    try {
      await deleteDoc(doc(db, 'blogs', blogId));
    } catch (err) {
      console.warn("Delete blog error:", err);
    }
  };

  const handleToggleMessageRead = async (messageId: string, currentRead: boolean) => {
    await updateDoc(doc(db, 'messages', messageId), {
      read: !currentRead
    });
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteDoc(doc(db, 'messages', messageId));
  };

  // Seed default data to Firestore
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), defaultSiteSettings, { merge: true });
      await setDoc(doc(db, 'profile', 'info'), defaultProfile, { merge: true });
      for (const p of defaultProjects) {
        await setDoc(doc(db, 'projects', p.id), p, { merge: true });
      }
      for (const s of defaultSkills) {
        await setDoc(doc(db, 'skills', s.id), s, { merge: true });
      }
      for (const sv of defaultServices) {
        await setDoc(doc(db, 'services', sv.id), sv, { merge: true });
      }
      for (const bl of defaultBlogs) {
        await setDoc(doc(db, 'blogs', bl.id), bl, { merge: true });
      }
      await setDoc(doc(db, 'admins', 'admin'), {
        username: 'admin',
        password: 'admin123',
        recoveryEmail: 'engi.sohelhossen.2002@gmail.com'
      }, { merge: true });
    } catch (err: any) {
      console.error("Seeding error:", err);
      throw err;
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#010736] font-sans selection:bg-[#010736] selection:text-[#FFF9F2]">
      {/* 1. Navbar with 380x100 Logo and Clean Nav Links (Admin Dashboard button moved to bottom Login per user request) */}
      <Navbar
        logoUrl={siteSettings.logoUrl}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* 2. Hero Carousel / Slider with dynamic slides and text overlay directly over the images */}
      <Hero
        slides={siteSettings.heroSlides}
        onNavigate={handleNavigate}
      />

      {/* 3. About Section with Admin Controlled Narrative & Timeline */}
      <About
        aboutSettings={siteSettings.aboutSettings}
        timeline={siteSettings.aboutTimeline}
        onNavigate={handleNavigate}
      />

      {/* 4. Skills Section with Dynamic Categories created & controlled by Admin */}
      <Skills
        skills={skills}
        categories={siteSettings.skillsCategories}
      />

      {/* 5. Services Section with Admin Controlled Header & Offerings */}
      <Services
        services={services}
        header={siteSettings.servicesHeader}
        onSelectService={(serviceTitle) => {
          setPrefilledSubject(`Service Inquiry: ${serviceTitle}`);
          handleNavigate('contact');
        }}
      />

      {/* 6. Projects Section */}
      <Projects
        projects={projects}
      />

      {/* 7. Blog Section */}
      <Blog
        blogs={blogs}
        onLikePost={handleLikePost}
      />

      {/* 8. Contact Form (Direct Firebase Firestore Integration) */}
      <Contact
        profile={profile}
        contactSettings={siteSettings.contactSettings}
        prefilledSubject={prefilledSubject}
        onSendMessage={handleSendMessage}
      />

      {/* 9. Footer with 380x100 Logo and prominent LOGIN button at the very bottom */}
      <Footer
        profile={profile}
        logoUrl={siteSettings.logoUrl}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsAdminDashboardOpen(true)}
      />

      {/* 10. Admin Dashboard Modal (User ID & Password + Email Recovery + Full Site Settings & Content CRUD) */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        profile={profile}
        siteSettings={siteSettings}
        projects={projects}
        skills={skills}
        services={services}
        blogs={blogs}
        messages={messages}
        onSaveProfile={handleSaveProfile}
        onSaveSiteSettings={handleSaveSiteSettings}
        onSaveProject={handleSaveProject}
        onDeleteProject={handleDeleteProject}
        onSaveSkill={handleSaveSkill}
        onDeleteSkill={handleDeleteSkill}
        onSaveService={handleSaveService}
        onDeleteService={handleDeleteService}
        onSaveBlog={handleSaveBlog}
        onDeleteBlog={handleDeleteBlog}
        onToggleMessageRead={handleToggleMessageRead}
        onDeleteMessage={handleDeleteMessage}
        onSeedDatabase={handleSeedDatabase}
        isSeeding={isSeeding}
      />
    </div>
  );
}
