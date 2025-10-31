import {
  formatResponseTime,
  formatBytes,
  formatPercentage,
  formatNetworkName
} from '@/lib/utils/formatters';

describe('Formatters', () => {
  describe('formatResponseTime', () => {
    it('should format milliseconds correctly', () => {
      expect(formatResponseTime(100)).toBe('100ms');
      expect(formatResponseTime(999)).toBe('999ms');
    });

    it('should format seconds correctly', () => {
      expect(formatResponseTime(1000)).toBe('1.00s');
      expect(formatResponseTime(1500)).toBe('1.50s');
      expect(formatResponseTime(30000)).toBe('30.00s');
    });
  });

  describe('formatBytes', () => {
    it('should format bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(1048576)).toBe('1.0 MB');
      expect(formatBytes(1073741824)).toBe('1.0 GB');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.5)).toBe('50.0%');
      expect(formatPercentage(0.755)).toBe('75.5%');
      expect(formatPercentage(1)).toBe('100.0%');
    });
  });

  describe('formatNetworkName', () => {
    it('should capitalize network names', () => {
      expect(formatNetworkName('helium')).toBe('Helium');
      expect(formatNetworkName('render')).toBe('Render');
      expect(formatNetworkName('arweave')).toBe('Arweave');
      expect(formatNetworkName('generic')).toBe('Generic');
    });
  });
});
