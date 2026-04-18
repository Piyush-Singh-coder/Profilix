export type AuthProvider = "EMAIL" | "GITHUB" | "GOOGLE";
export type ProfileStatus = "LOOKING_FOR_ROLES" | "OPEN_TO_HACKATHONS" | "BUILDING_SOMETHING" | "AVAILABLE_FOR_FREELANCE" | "NOT_AVAILABLE" | "CUSTOM";
export type TechCategory = "LANGUAGE" | "FRAMEWORK" | "DATABASE" | "DEVOPS" | "TOOL" | "CLOUD" | "OTHER";
export type ProfileTheme = "GLASS" | "BRUTALISM" | "CLAY" | "SKEUOMORPHIC" | "MINIMAL" | "NEON" | "RETRO" | "AURORA";
export type CardTheme = "GLASSMORPHISM" | "NEOBRUTALISM" | "APPLE" | "CLAY" | "SKEUOMORPHIC";
export type SocialPlatform = "GITHUB" | "LINKEDIN" | "TWITTER" | "LEETCODE" | "HACKERRANK" | "PERSONAL_WEBSITE" | "OTHER";
export type AnalyticsEventType = "PROFILE_VIEW" | "RESUME_DOWNLOAD" | "SOCIAL_LINK_CLICK" | "QR_SCAN" | "OG_IMAGE_RENDER";
export type AchievementType = "HACKATHON" | "COMPETITION" | "CERTIFICATE" | "AWARD" | "OTHER";

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
  isPublic: boolean;
  theme: ProfileTheme;
  cardTheme?: CardTheme;
  techStacks?: ProfileTechStack[];
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
  description: string | null;
  bullets: string[] | null;
  displayOrder: number;
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
}
