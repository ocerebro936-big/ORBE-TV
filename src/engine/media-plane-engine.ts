import { TranscodeRendition, IngestEndpointConfig, HlsMasterManifest } from '../types/ott-architecture';
import { OTT_TECHNICAL_SPEC } from '../data/ott-technical-spec';

export class MediaPlaneEngine {
  private activeStreams: Map<string, IngestEndpointConfig> = new Map();
  private segmentCounters: Map<string, number> = new Map();

  constructor() {
    this.initDefaultStreams();
  }

  private initDefaultStreams() {
    const defaultStream: IngestEndpointConfig = {
      channelId: 'ublue-tv-247',
      channelName: 'UBlue TV Oficial (24/7)',
      protocol: 'RTMP',
      rtmpUrl: 'rtmp://ingest.ublue.tv/live',
      srtUrl: 'srt://ingest.ublue.tv:9710?streamid=live/ublue_master',
      streamKey: 'live_ublue_prod_77a94f1c900e2b48',
      status: 'online',
      incomingFps: 59.94,
      incomingBitrateKbps: 6200,
      audioChannels: '2.0 Stereo (AAC 48kHz)',
      originServer: 'origin-hetzner-fsn1.ublue.tv',
      activeViewers: 14820,
      renditions: OTT_TECHNICAL_SPEC.transcodingLadder
    };

    this.activeStreams.set('ublue-tv-247', defaultStream);
    this.segmentCounters.set('ublue-tv-247', 1420);
  }

  public getStream(channelId: string = 'ublue-tv-247'): IngestEndpointConfig {
    return this.activeStreams.get(channelId) || this.activeStreams.get('ublue-tv-247')!;
  }

  public generateMasterManifest(channelId: string): HlsMasterManifest {
    const stream = this.getStream(channelId);
    const renditions = stream.renditions.map(r => ({
      resolution: `${r.width}x${r.height}`,
      bandwidth: r.bandwidth,
      codecs: `${r.codec},mp4a.40.2`,
      uri: `renditions/${r.resolution}/prog_index.m3u8`
    }));

    const lines = [
      '#EXTM3U',
      '#EXT-X-VERSION:6',
      '#EXT-X-INDEPENDENT-SEGMENTS',
      '# UBlue TV Dynamic Master Playlist',
      '# Origin: ' + stream.originServer,
      '# CDN: Cloudflare Edge Network'
    ];

    renditions.forEach(r => {
      lines.push(
        `#EXT-X-STREAM-INF:BANDWIDTH=${r.bandwidth},RESOLUTION=${r.resolution},CODECS="${r.codecs}",FRAME-RATE=60.000`,
        r.uri
      );
    });

    return {
      version: 6,
      targetDuration: 4,
      mediaSequence: this.segmentCounters.get(channelId) || 1420,
      renditions,
      rawManifestText: lines.join('\n')
    };
  }

  public generateVariantManifest(channelId: string, resolution: '1080p' | '720p' | '480p' | '360p'): string {
    const currentSeq = this.segmentCounters.get(channelId) || 1420;
    const lines = [
      '#EXTM3U',
      '#EXT-X-VERSION:6',
      '#EXT-X-TARGETDURATION:4',
      `#EXT-X-MEDIA-SEQUENCE:${currentSeq}`,
      '#EXT-X-DISCONTINUITY-SEQUENCE:0',
      '#EXT-X-PLAYLIST-TYPE:EVENT'
    ];

    for (let i = 0; i < 5; i++) {
      const segNum = currentSeq + i;
      lines.push(
        '#EXTINF:4.000,',
        `segment_${resolution}_${segNum}.ts`
      );
    }

    return lines.join('\n');
  }

  public advanceSegments(channelId: string = 'ublue-tv-247') {
    const current = this.segmentCounters.get(channelId) || 1420;
    this.segmentCounters.set(channelId, current + 1);
  }
}

export const mediaPlaneEngine = new MediaPlaneEngine();
