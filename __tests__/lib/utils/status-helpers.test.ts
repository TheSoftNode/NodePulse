import {
  determineNodeStatus,
  getStatusVariant,
  getStatusIcon
} from '@/lib/utils/status-helpers';
import { HealthMetrics } from '@/lib/types/health-check';

describe('Status Helpers', () => {
  describe('determineNodeStatus', () => {
    it('should return critical for offline nodes', () => {
      const metrics: HealthMetrics = { online: false };
      expect(determineNodeStatus(metrics, 1000)).toBe('critical');
    });

    it('should return critical for high response time', () => {
      const metrics: HealthMetrics = { online: true };
      expect(determineNodeStatus(metrics, 31000)).toBe('critical');
    });

    it('should return warning for moderate response time', () => {
      const metrics: HealthMetrics = { online: true };
      expect(determineNodeStatus(metrics, 15000)).toBe('warning');
    });

    it('should return healthy for normal operation', () => {
      const metrics: HealthMetrics = { online: true };
      expect(determineNodeStatus(metrics, 500)).toBe('healthy');
    });
  });

  describe('getStatusVariant', () => {
    it('should return correct badge variants', () => {
      expect(getStatusVariant('healthy')).toBe('default');
      expect(getStatusVariant('warning')).toBe('secondary');
      expect(getStatusVariant('critical')).toBe('destructive');
      expect(getStatusVariant('unknown')).toBe('outline');
    });
  });

  describe('getStatusIcon', () => {
    it('should return correct status icons', () => {
      expect(getStatusIcon('healthy')).toBe('🟢');
      expect(getStatusIcon('warning')).toBe('🟡');
      expect(getStatusIcon('critical')).toBe('🔴');
      expect(getStatusIcon('unknown')).toBe('⚪');
    });
  });
});
