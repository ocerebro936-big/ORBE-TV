/**
 * M3U Playlist Parser and Exporter Service
 * Implements standard Extended M3U (#EXTM3U) format used by iptv-org and IPTV players
 * Reference: https://github.com/iptv-org/iptv
 */

import { IptvChannel } from '../types/iptv';

export interface ParseM3UResult {
  channels: IptvChannel[];
  title?: string;
  totalParsed: number;
}

export class M3UParserService {
  /**
   * Parses raw M3U / M3U8 string content into structured IptvChannel array
   */
  public static parse(content: string): ParseM3UResult {
    const lines = content.split(/\r?\n/);
    const channels: IptvChannel[] = [];
    let currentMetadata: Partial<IptvChannel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      if (line.startsWith('#EXTINF:')) {
        currentMetadata = this.parseExtInfLine(line);
      } else if (line.startsWith('#EXTVLCOPT:') || line.startsWith('#EXTGRP:')) {
        // Additional VLC or group tags
        if (line.startsWith('#EXTGRP:') && !currentMetadata.category) {
          currentMetadata.category = line.replace('#EXTGRP:', '').trim();
        }
      } else if (!line.startsWith('#')) {
        // This is the stream URL line
        if (line.startsWith('http://') || line.startsWith('https://')) {
          const channelId = currentMetadata.id || `channel-${channels.length + 1}-${Date.now().toString().slice(-4)}`;
          const channelName = currentMetadata.name || `Canal ${channels.length + 1}`;
          
          channels.push({
            id: channelId,
            name: channelName,
            logo: currentMetadata.logo || 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=160&auto=format&fit=crop&q=80',
            category: (currentMetadata.category || 'general').toLowerCase(),
            country: currentMetadata.country || 'Global',
            countryCode: (currentMetadata.countryCode || 'global').toLowerCase(),
            language: currentMetadata.language || 'Português',
            streamUrl: line,
            resolution: currentMetadata.resolution || '1080p',
            status: 'online',
            bitrate: '3.5 Mbps',
            currentProgram: `Emissão ao Vivo · ${channelName}`,
            nextProgram: 'Transmissão Contínua 24/7',
            provider: currentMetadata.provider || 'iptv-org feed',
            epgId: currentMetadata.epgId
          });

          // Reset metadata for next channel
          currentMetadata = {};
        }
      }
    }

    return {
      channels,
      totalParsed: channels.length
    };
  }

  /**
   * Helper to parse #EXTINF line with regex for attributes
   * Example: #EXTINF:-1 tvg-id="TVM.mz" tvg-name="TVM" tvg-logo="https://..." group-title="General",TVM Moçambique
   */
  private static parseExtInfLine(line: string): Partial<IptvChannel> {
    const meta: Partial<IptvChannel> = {};

    // Extract attributes: key="value"
    const tvgIdMatch = line.match(/tvg-id="([^"]+)"/i);
    if (tvgIdMatch) {
      meta.epgId = tvgIdMatch[1];
      meta.id = `iptv-${tvgIdMatch[1].replace(/[^a-zA-Z0-9_-]/g, '')}`;
    }

    const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/i);
    if (tvgLogoMatch) meta.logo = tvgLogoMatch[1];

    const groupTitleMatch = line.match(/group-title="([^"]+)"/i);
    if (groupTitleMatch) meta.category = groupTitleMatch[1];

    const tvgCountryMatch = line.match(/tvg-country="([^"]+)"/i);
    if (tvgCountryMatch) {
      meta.countryCode = tvgCountryMatch[1];
      meta.country = tvgCountryMatch[1].toUpperCase();
    }

    const tvgLangMatch = line.match(/tvg-language="([^"]+)"/i);
    if (tvgLangMatch) meta.language = tvgLangMatch[1];

    // Extract channel title after last comma
    const commaIndex = line.lastIndexOf(',');
    if (commaIndex !== -1 && commaIndex < line.length - 1) {
      meta.name = line.slice(commaIndex + 1).trim();
    }

    return meta;
  }

  /**
   * Exports an array of IptvChannels back to a standard .m3u playlist string
   */
  public static exportToM3U(channels: IptvChannel[], playlistName: string = 'UBlue-IPTV-Org-Playlist'): string {
    let output = '#EXTM3U\n';
    output += `## Playlist: ${playlistName} - Generated via UBlue TV & iptv-org\n`;
    output += `## Source: https://github.com/iptv-org/iptv\n\n`;

    for (const ch of channels) {
      output += `#EXTINF:-1 tvg-id="${ch.epgId || ch.id}" tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="${ch.category.toUpperCase()}" tvg-country="${ch.countryCode}",${ch.name}\n`;
      output += `${ch.streamUrl}\n\n`;
    }

    return output;
  }

  /**
   * Triggers a browser file download of the M3U playlist
   */
  public static downloadM3UFile(channels: IptvChannel[], filename: string = 'ublue-iptv-playlist.m3u') {
    const content = this.exportToM3U(channels, filename);
    const blob = new Blob([content], { type: 'application/x-mpegurl;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
