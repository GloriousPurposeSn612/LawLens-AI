import { describe, it, expect } from 'vitest';
import { OfficialSourceService } from '../../server/services/officialSourceService.js';

describe('OfficialSourceService Unit Tests', () => {
  it('should match Section 27 of Indian Contract Act for non-compete queries', () => {
    const query = 'What are the rules regarding non-compete covenants in India?';
    const matches = OfficialSourceService.findRelevantOfficialSources(query);

    expect(matches.length).toBeGreaterThan(0);
    const contractActMatch = matches.find(m => m.actName.includes('Contract Act'));
    expect(contractActMatch).toBeDefined();
    expect(contractActMatch?.section).toContain('Section 27');
  });

  it('should match Section 17(c) Copyright Act for intellectual property queries', () => {
    const query = 'Who owns copyright and intellectual property created during employment?';
    const matches = OfficialSourceService.findRelevantOfficialSources(query);

    const copyrightMatch = matches.find(m => m.actName.includes('Copyright Act'));
    expect(copyrightMatch).toBeDefined();
    expect(copyrightMatch?.section).toContain('Section 17');
  });
});
