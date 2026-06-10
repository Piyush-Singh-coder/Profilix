export type AuthProvider = "EMAIL" | "GITHUB" | "GOOGLE";
export type ProfileStatus = "LOOKING_FOR_ROLES" | "OPEN_TO_HACKATHONS" | "BUILDING_SOMETHING" | "AVAILABLE_FOR_FREELANCE" | "NOT_AVAILABLE" | "CUSTOM";
export type TechCategory = "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "DEVOPS" | "TOOL" | "CLOUD" | "OTHER";
export type ProfileTheme = "LIGHT" | "DARK";
export type CardTheme = "GLASS" | "BRUTAL" | "APPLE";
export type SocialPlatform = "GITHUB" | "LINKEDIN" | "TWITTER" | "LEETCODE" | "HACKERRANK" | "PERSONAL_WEBSITE" | "OTHER";
export type AnalyticsEventType = "PROFILE_VIEW" | "RESUME_DOWNLOAD" | "SOCIAL_LINK_CLICK" | "QR_SCAN" | "OG_IMAGE_RENDER";
export type AchievementType = "HACKATHON" | "COMPETITION" | "CERTIFICATE" | "AWARD" | "OTHER";
export type BlogStatus = "DRAFT" | "PUBLISHED";

export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  isVerified: boolean;
  authProvider?: AuthProvider;
  selectedTheme?: ProfileTheme;
}

export interface TechStack {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  category: TechCategory;
}

export interface ResumeConfig {
  sections: {
    summary: boolean;
    experience: boolean;
    education: boolean;
    projects: boolean;
    skills: boolean;
    achievements: boolean;
    customSections: boolean;
  };
  limits: {
    projects: number;
    experiences: number;
    achievements: number;
    educations: number;
  };
  styling: {
    fontFamily: string;
    fontSize: string;
  };
}

export interface ProfileSkill {
  id: string;
  userId: string;
  category: string;
  skills: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomSection {
  id: string;
  userId: string;
  title: string;
  bullets: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileTechStack {
  tech: TechStack;
  assignedAt: string;
}

export interface Profile {
  id: string;
  displayName: string;
  headline: string | null;
  bio: string | null;
  status: ProfileStatus;
  statusCustomText: string | null;
  location: string | null;
  phoneNumber: string | null;
  isPublic: boolean;
  theme: ProfileTheme;
  cardTheme?: CardTheme;
  techStacks?: ProfileTechStack[];
  resumeConfig?: ResumeConfig | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  bullets: string[] | null;
  repoUrl: string | null;
  liveUrl: string | null;
  videoUrl: string | null;
  isPinned: boolean;
  displayOrder: number;
  techTags: string[] | null;
  stargazerCount?: number;
  forkCount?: number;
  primaryLanguage?: { name: string; color: string } | null;
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  visibleInDefault: boolean;
  visibleInRecruiter: boolean;
}

export interface Resume {
  id: string;
  fileUrl: string;
  originalFilename: string;
  fileSizeBytes: number;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  bullets: string[] | null;
  logoUrl: string | null;
  displayOrder: number;
}

export interface Achievement {
  id: string;
  title: string;
  provider: string | null;
  type: AchievementType;
  date: string | null;
  url: string | null;
  imageUrl: string | null;
  description: string | null;
  displayOrder: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  scoreType: "CGPA" | "PERCENTAGE" | null;
  score: string | null;
  description: string | null;
  bullets: string[] | null;
  displayOrder: number;
}

export interface BlogPost {
  id: string;
  authorId?: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string[];
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubStats {
  id: string;
  githubUsername: string;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  avatarUrl: string | null;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  lastSynced: string;
  contributions?: {
    totalContributions: number;
    weeks: Array<{
      contributionDays: Array<{
        contributionCount: number;
        date: string;
        color: string;
      }>;
    }>;
  } | null;
  pinnedRepos?: Array<{
    name: string;
    description: string | null;
    url: string;
    primaryLanguage: { name: string; color: string } | null;
    stargazerCount: number;
    forkCount: number;
  }> | null;
}

export interface PublicProfileData {
  username: string;
  fullName: string;
  avatarUrl: string | null;
  profile: Profile;
  viewMode: "default" | "hire";
  techStacks: TechStack[];
  socialLinks: SocialLink[];
  projects: Project[];
  resume: Pick<Resume, "fileUrl" | "updatedAt"> | null;
  experiences: Experience[];
  achievements: Achievement[];
  educations?: Education[];
  githubStats: GitHubStats | null;
  customSections?: CustomSection[];
  profileSkills?: ProfileSkill[];
}
