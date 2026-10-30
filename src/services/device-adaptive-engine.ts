/**
 * Smart Device Adaptive Engine & Controller for UBlue TV
 * Sistema Inteligente que se adequa automaticamente em qualquer dispositivo:
 * - Smartphones (Mobile Portrait & Landscape)
 * - Tablets & iPads
 * - Computadores & Portáteis (Desktop Widescreen)
 * - Smart TVs, Android TV, FireStick e WebOS (Interface de 10 Pés com Comando Remoto)
 */

import { useState, useEffect } from 'react';

export type DeviceFormFactor = 'mobile' | 'tablet' | 'desktop' | 'tv';
export type DeviceOrientation = 'portrait' | 'landscape';

export interface DeviceState {
  formFactor: DeviceFormFactor;
  orientation: DeviceOrientation;
  isTouch: boolean;
  isTVMode: boolean;
  screenWidth: number;
  screenHeight: number;
  manualOverride: DeviceFormFactor | null;
}

class DeviceAdaptiveEngine {
  private state: DeviceState;
  private listeners: Set<(state: DeviceState) => void> = new Set();

  constructor() {
    this.state = this.detectCurrentDevice();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
      window.addEventListener('orientationchange', this.handleResize);
    }
  }

  private detectCurrentDevice(): DeviceState {
    if (typeof window === 'undefined') {
      return {
        formFactor: 'desktop',
        orientation: 'landscape',
        isTouch: false,
        isTVMode: false,
        screenWidth: 1920,
        screenHeight: 1080,
        manualOverride: null
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const orientation: DeviceOrientation = width > height ? 'landscape' : 'portrait';

    // Check if smart TV user agent or large 10-foot distance display
    const ua = navigator.userAgent.toLowerCase();
    const isTvUserAgent =
      ua.includes('smart-tv') ||
      ua.includes('smarttv') ||
      ua.includes('tizen') ||
      ua.includes('webos') ||
      ua.includes('googletv') ||
      ua.includes('android tv') ||
      ua.includes('firetv') ||
      ua.includes('appletv');

    let formFactor: DeviceFormFactor = 'desktop';
    if (isTvUserAgent) {
      formFactor = 'tv';
    } else if (width < 640) {
      formFactor = 'mobile';
    } else if (width <= 1024) {
      formFactor = 'tablet';
    } else {
      formFactor = 'desktop';
    }

    // Check saved manual override in localStorage
    const savedOverride = localStorage.getItem('ublue_device_override') as DeviceFormFactor | null;
    const activeFactor = savedOverride || formFactor;

    return {
      formFactor: activeFactor,
      orientation,
      isTouch,
      isTVMode: activeFactor === 'tv',
      screenWidth: width,
      screenHeight: height,
      manualOverride: savedOverride
    };
  }

  private handleResize = () => {
    const updated = this.detectCurrentDevice();
    this.state = updated;
    this.notify();
  };

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getState(): DeviceState {
    return this.state;
  }

  public setDeviceOverride(override: DeviceFormFactor | null) {
    if (override) {
      localStorage.setItem('ublue_device_override', override);
    } else {
      localStorage.removeItem('ublue_device_override');
    }
    this.state = this.detectCurrentDevice();
    this.notify();
  }

  public subscribe(listener: (state: DeviceState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const deviceAdaptiveEngine = new DeviceAdaptiveEngine();

/**
 * React Hook for Device Adaptive Engine
 */
export function useSmartDevice() {
  const [device, setDevice] = useState<DeviceState>(() => deviceAdaptiveEngine.getState());

  useEffect(() => {
    const unsubscribe = deviceAdaptiveEngine.subscribe((newState) => {
      setDevice(newState);
    });
    return unsubscribe;
  }, []);

  return {
    ...device,
    setOverride: (form: DeviceFormFactor | null) => deviceAdaptiveEngine.setDeviceOverride(form)
  };
}
