export interface ProfileData {
  id?: string;
  fullName: string;
  taglines: string;
  aboutBio: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  avatarUrl: string;
  yearsExperience: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  updatedAt?: string;
}

export interface HeroSlideItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  role: string;
  company: string;
  description: string;
}

export interface AboutSettings {
  badge: string;
  title: string;
  narrativeHeading: string;
  narrativeBio: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  philosophyCards?: Array<{
    id: string;
    title: string;
    description: string;
    iconName: string;
  }>;
}

export interface ContactSettings {
  badge: string;
  title: string;
  subtitle: string;
}

export interface ServicesHeader {
  badge: string;
  title: string;
  subtitle: string;
}

export interface SiteSettings {
  logoUrl: string;
  heroSlides: HeroSlideItem[];
  aboutSettings: AboutSettings;
  aboutTimeline: TimelineItem[];
  skillsCategories: string[];
  servicesHeader: ServicesHeader;
  contactSettings: ContactSettings;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  createdAt?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  iconName?: string;
  order: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  features: string;
  priceRange: string;
  order: number;
}

export interface BlogPostItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
  likes: number;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}
