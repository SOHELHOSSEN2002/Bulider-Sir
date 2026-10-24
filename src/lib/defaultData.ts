import { 
  ProfileData, 
  ProjectItem, 
  SkillItem, 
  ServiceItem, 
  BlogPostItem,
  SiteSettings
} from '../types';

export const defaultSiteSettings: SiteSettings = {
  // 380x100 Logo placeholder (supports dynamic custom image URL entered by admin)
  logoUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 380 100' width='380' height='100'%3E%3Crect width='380' height='100' fill='%23010736' rx='16'/%3E%3Crect x='16' y='16' width='68' height='68' rx='12' fill='%23FFF9F2'/%3E%3Ctext x='50' y='60' fill='%23010736' font-family='serif' font-size='36' font-weight='bold' text-anchor='middle'%3ESH%3C/text%3E%3Ccircle cx='76' cy='76' r='7' fill='%2310B981'/%3E%3Ctext x='104' y='48' fill='%23FFF9F2' font-family='serif' font-size='26' font-weight='bold'%3ESohel Hossen%3C/text%3E%3Ctext x='105' y='72' fill='%23C69255' font-family='sans-serif' font-size='12' letter-spacing='3' text-transform='uppercase' font-weight='600'%3ECLOUD ARCHITECT &bull; DEV%3C/text%3E%3C/svg%3E",
  heroSlides: [
    {
      id: "slide-1",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?fit=crop&w=1920&h=1080&q=80",
      title: "Crafting Scalable Cloud Architectures & Modern Web Apps",
      subtitle: "Sohel Hossen — Full Stack Engineer & Cloud Architect",
      description: "Specializing in high-performance web applications, distributed cloud backends, and resilient Firebase infrastructure.",
      primaryBtnText: "View Projects",
      primaryBtnLink: "#projects",
      secondaryBtnText: "Contact Me",
      secondaryBtnLink: "#contact"
    },
    {
      id: "slide-2",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?fit=crop&w=1920&h=1080&q=80",
      title: "End-to-End Enterprise Systems & Microservices",
      subtitle: "Building Next-Gen Full Stack Solutions",
      description: "Engineering reactive user interfaces with lightning-fast databases, ABAC security, and scalable serverless APIs.",
      primaryBtnText: "Explore Services",
      primaryBtnLink: "#services",
      secondaryBtnText: "Hire Me",
      secondaryBtnLink: "#contact"
    },
    {
      id: "slide-3",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?fit=crop&w=1920&h=1080&q=80",
      title: "Intuitive UI/UX Design Powered by Real-Time Data",
      subtitle: "Desktop-Grade Reactive Web Experiences",
      description: "Seamless micro-animations, accessible design systems, and instantaneous multi-device data synchronization.",
      primaryBtnText: "Read Technical Blog",
      primaryBtnLink: "#blog",
      secondaryBtnText: "Get In Touch",
      secondaryBtnLink: "#contact"
    }
  ],
  aboutSettings: {
    badge: "",
    title: "About My",
    narrativeHeading: "Bridging elegant visual craftsmanship with uncompromising technical discipline.",
    narrativeBio: "I am a passionate software engineer with extensive experience in building robust web applications, high-performance backends, and elegant user interfaces. Specializing in modern JavaScript/TypeScript, React, Node.js, and Firebase cloud infrastructure, I focus on building scalable systems with seamless design and bulletproof architectures.",
    location: "Dhaka, Bangladesh (Available Worldwide)",
    email: "engi.sohelhossen.2002@gmail.com",
    phone: "+880 1700-000000",
    availability: "Available for Full-time Roles & Contracts",
    philosophyCards: [
      {
        id: "phil-1",
        title: "Full Stack Mastery",
        description: "End-to-end fluency with React 19, TypeScript, Node.js, Express, and cloud serverless architectures.",
        iconName: "Terminal"
      },
      {
        id: "phil-2",
        title: "Hardened Security",
        description: "Implementing zero-trust Firestore rules, ABAC policies, safe authentication, and input sanitization.",
        iconName: "ShieldCheck"
      },
      {
        id: "phil-3",
        title: "Performance First",
        description: "Sub-second load times, 60 FPS transitions, minimal bundle overhead, and efficient database indexing.",
        iconName: "Cpu"
      },
      {
        id: "phil-4",
        title: "Bespoke Design",
        description: "Custom UI built around purposeful contrast, editorial typography, and 100% mobile responsiveness.",
        iconName: "Sparkles"
      }
    ]
  },
  aboutTimeline: [
    {
      id: "t1",
      year: "2024 - Present",
      role: "Senior Full Stack & Cloud Architect",
      company: "Enterprise Freelance & Cloud Systems",
      description: "Architecting high-scale web platforms and real-time Firestore database solutions with enterprise security."
    },
    {
      id: "t2",
      year: "2022 - 2024",
      role: "Full Stack Developer",
      company: "Digital Innovation Lab",
      description: "Developed reactive web applications, APIs, payment systems, and interactive client dashboards."
    },
    {
      id: "t3",
      year: "2019 - 2022",
      role: "B.Sc. in Computer Science & Engineering",
      company: "University of Engineering & Technology",
      description: "Focused on algorithms, distributed databases, software engineering, and modern web protocols."
    }
  ],
  skillsCategories: [
    "Frontend",
    "Backend",
    "Database",
    "Cloud & DevOps",
    "Tools"
  ],
  servicesHeader: {
    badge: "",
    title: "My Services",
    subtitle: ""
  },
  contactSettings: {
    badge: "",
    title: "Do You Hire me?",
    subtitle: ""
  }
};

export const defaultProfile: ProfileData = {
  fullName: "Sohel Hossen",
  taglines: "Full Stack Engineer & Cloud Architect",
  aboutBio: "I am a passionate software engineer with extensive experience in building robust web applications, high-performance backends, and elegant user interfaces. Specializing in modern JavaScript/TypeScript, React, Node.js, and Firebase cloud infrastructure, I focus on building scalable systems with seamless design and bulletproof architectures.",
  email: "engi.sohelhossen.2002@gmail.com",
  phone: "+880 1700-000000",
  location: "Dhaka, Bangladesh (Available Worldwide)",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  resumeUrl: "#contact",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=600&h=600&q=80",
  yearsExperience: 4,
  projectsCompleted: 28,
  clientSatisfaction: 99,
  updatedAt: new Date().toISOString()
};

export const defaultProjects: ProjectItem[] = [
  {
    id: "proj-1",
    title: "Enterprise Cloud ERP Platform",
    category: "Full Stack",
    description: "Next-gen enterprise dashboard with real-time analytics, RBAC permission tiers, and automated inventory pipelines with Firebase Firestore.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?fit=crop&w=800&q=80",
    tags: "React, TypeScript, Firebase, Tailwind CSS",
    liveUrl: "https://example.com/project-erp",
    githubUrl: "https://github.com/sohelhossen",
    featured: true,
    order: 1
  },
  {
    id: "proj-2",
    title: "AI Prompt Studio & Creative Suite",
    category: "AI & Tools",
    description: "An intuitive collaborative studio for generating, testing, and fine-tuning Gemini AI multi-modal prompts with instant streaming output.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fit=crop&w=800&q=80",
    tags: "Gemini API, React 19, Node.js, Motion",
    liveUrl: "https://example.com/ai-studio",
    githubUrl: "https://github.com/sohelhossen",
    featured: true,
    order: 2
  },
  {
    id: "proj-3",
    title: "FinTech Microservices & Ledger Engine",
    category: "Backend",
    description: "High-throughput transaction ledger with double-entry accounting guarantees, webhook security, and idempotent processing.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fit=crop&w=800&q=80",
    tags: "Node.js, Express, PostgreSQL, Redis",
    liveUrl: "https://example.com/fintech",
    githubUrl: "https://github.com/sohelhossen",
    featured: true,
    order: 3
  },
  {
    id: "proj-4",
    title: "Luxury E-Commerce & Checkout Flow",
    category: "Frontend",
    description: "Ultra-fast headless luxury shopping experience with fluid transitions, instant cart state sync, and Stripe checkout integration.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?fit=crop&w=800&q=80",
    tags: "Next.js, Tailwind v4, Stripe, Zustand",
    liveUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/sohelhossen",
    featured: false,
    order: 4
  },
  {
    id: "proj-5",
    title: "Real-Time Collaborative Workspace",
    category: "Full Stack",
    description: "Multiplayer doc editor and whiteboard with live cursor sync, presence detection, and automated version history snapshots.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?fit=crop&w=800&q=80",
    tags: "WebSockets, Firebase, React, Canvas API",
    liveUrl: "https://example.com/collab",
    githubUrl: "https://github.com/sohelhossen",
    featured: false,
    order: 5
  },
  {
    id: "proj-6",
    title: "Healthcare Telemedicine App",
    category: "Mobile & Web",
    description: "HIPAA-conscious appointment scheduler, encrypted chat, and video consultation interface for remote medical practitioners.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?fit=crop&w=800&q=80",
    tags: "WebRTC, React, Cloud Functions, Tailwind",
    liveUrl: "https://example.com/telemed",
    githubUrl: "https://github.com/sohelhossen",
    featured: false,
    order: 6
  }
];

export const defaultSkills: SkillItem[] = [
  { id: "sk-1", name: "React / Next.js", category: "Frontend", proficiency: 95, iconName: "Atom", order: 1 },
  { id: "sk-2", name: "TypeScript / JavaScript", category: "Frontend", proficiency: 92, iconName: "Code2", order: 2 },
  { id: "sk-3", name: "Tailwind CSS & Motion", category: "Frontend", proficiency: 94, iconName: "Palette", order: 3 },
  { id: "sk-4", name: "Node.js & Express", category: "Backend", proficiency: 88, iconName: "Server", order: 4 },
  { id: "sk-5", name: "RESTful & GraphQL APIs", category: "Backend", proficiency: 89, iconName: "Network", order: 5 },
  { id: "sk-6", name: "Firebase (Firestore, Auth)", category: "Database", proficiency: 92, iconName: "Flame", order: 6 },
  { id: "sk-7", name: "PostgreSQL & MongoDB", category: "Database", proficiency: 84, iconName: "Database", order: 7 },
  { id: "sk-8", name: "Google Cloud / Docker", category: "Cloud & DevOps", proficiency: 80, iconName: "Cloud", order: 8 },
  { id: "sk-9", name: "Git, CI/CD & Testing", category: "Tools", proficiency: 87, iconName: "GitBranch", order: 9 }
];

export const defaultServices: ServiceItem[] = [
  {
    id: "serv-1",
    title: "Full Stack Web Development",
    description: "End-to-end custom web applications built with modern frontend frameworks and scalable server architectures.",
    iconName: "Code",
    features: "Custom Architecture • React 19 / TypeScript • REST / GraphQL APIs • Database Design",
    priceRange: "Custom Project Based",
    order: 1
  },
  {
    id: "serv-2",
    title: "Firebase Cloud Solutions",
    description: "Serverless backend integration, real-time Firestore database schema design, and secure authentication setups.",
    iconName: "Flame",
    features: "Firestore ABAC Rules • Real-time Multi-device Sync • Cloud Functions • Idempotent APIs",
    priceRange: "Fast Delivery",
    order: 2
  },
  {
    id: "serv-3",
    title: "UI/UX & Responsive Frontends",
    description: "High-end responsive user interfaces with interactive micro-animations, accessible components, and brand harmony.",
    iconName: "Layout",
    features: "Tailwind CSS • Mobile Optimization • 60 FPS Animations • Cross-Browser Quality",
    priceRange: "Design & Dev",
    order: 3
  },
  {
    id: "serv-4",
    title: "API Integration & Performance",
    description: "Optimizing application speed, Core Web Vitals, third-party payment gateways, and AI APIs like Gemini.",
    iconName: "Zap",
    features: "Speed Audits • Third-Party OAuth • Payment Gateways • Zero Bottlenecks",
    priceRange: "Consulting & Retainer",
    order: 4
  }
];

export const defaultBlogs: BlogPostItem[] = [
  {
    id: "blog-1",
    title: "Building Bulletproof ABAC Security Rules in Firebase Firestore",
    category: "Security & Cloud",
    summary: "Discover why standard rules leave update gaps and how to construct zero-trust Attribute-Based Access Control in Firestore.",
    content: `Firestore security rules are the front line of defense in modern serverless applications. Many teams rely solely on client-side authentication checks, which can be easily bypassed using REST APIs or the client SDK directly.

In this guide, we break down:
1. The difference between RBAC and ABAC in distributed environments.
2. Why checking \`request.resource.data.diff(resource.data).affectedKeys()\` is critical during updates.
3. How to prevent resource poisoning attacks and unauthorized document overrides.
4. Setting up server-side verification with \`request.time\` timestamps.

By following strict validation blueprints, you ensure your database remains impervious to data corruption and unauthorized tampering.`,
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?fit=crop&w=800&q=80",
    published: true,
    createdAt: "2026-10-18",
    likes: 42
  },
  {
    id: "blog-2",
    title: "Modern React Architecture: Balancing Server State and Client State",
    category: "Frontend",
    summary: "An exploration of state management patterns in modern React, reducing bundle sizes while maximizing reactivity.",
    content: `Managing state across large React codebases used to mean dozens of redundant Redux actions. With modern hooks and cloud snapshots, the paradigm shifts towards keeping the server as the single source of truth.

Key principles to follow:
• Separate ephemeral UI state (modals, dropdowns) from persistent data models.
• Leverage real-time Firestore \`onSnapshot\` listeners for instantaneous multi-device updates.
• Implement optimistic UI updates with rollback safeguards.

This ensures snappy, desktop-grade responsiveness in browser applications.`,
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?fit=crop&w=800&q=80",
    published: true,
    createdAt: "2026-10-12",
    likes: 38
  },
  {
    id: "blog-3",
    title: "Designing with Purpose: Why Dark Forest Green & Warm Cream Work",
    category: "Design & UX",
    summary: "The psychology of deep earthy greens combined with warm creamy undertones for luxury portfolios.",
    content: `In a sea of generic dark mode templates, bespoke color harmony sets exceptional software apart. The interplay between deep hues and warm antique cream evokes elegance, focus, and organic warmth.

In this design review, we examine:
• Contrast ratios that exceed WCAG AAA standards for reading comfort.
• Using subtle borders without compromising legibility.
• Creating visual rhythm using serif titles and clean geometric sans-serif copy.`,
    readTime: "3 min read",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=800&q=80",
    published: true,
    createdAt: "2026-10-05",
    likes: 29
  }
];
