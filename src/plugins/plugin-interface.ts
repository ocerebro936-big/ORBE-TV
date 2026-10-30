import { Content, Category, Channel, Program } from '../types/content';

export interface UBlueContentPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'active' | 'standby' | 'error';
  latencyMs: number;
  provider: string;
  authRequired: boolean;

  search(query: string): Promise<Content[]>;

  getCategories(): Promise<Category[]>;

  getContent(id: string): Promise<Content | null>;

  getLiveChannels(): Promise<Channel[]>;

  getSchedule(channelId: string): Promise<Program[]>;
}
