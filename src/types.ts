export interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
  handle?: string;
}

export interface ActivityData {
  username: string;
  platform: string;
  songTitle: string;
  artist?: string;
  startedAtMinutesAgo: number;
  coverUrl?: string;
}

export interface BioConfig {
  views: number;
  uid: string;
  avatarUrl: string;
  musicAvatarUrl?: string;
  username: string;
  verified: boolean;
  friends: {
    left: string;
    right: string;
  };
  tag: string;
  location: string;
  discordHandle: string;
  activity: ActivityData;
  trackTitle?: string;
  trackDurationSec?: number;
  videoSrc: string;
  tiltStrength?: number;
}
