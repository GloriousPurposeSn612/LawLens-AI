import { OfficialAuthorityMatch } from '../../shared/types.js';

export interface OfficialStatuteRef {
  id: string;
  actName: string;
  section: string;
  officialText: string;
  relevanceKeywords: string[];
  summary: string;
  officialUrl: string;
}

export class OfficialSourceService {
  private static STATUTE_DATABASE: OfficialStatuteRef[] = [
    {
      id: 'statute-contract-27',
      actName: 'The Indian Contract Act, 1872',
      section: 'Section 27 — Agreement in restraint of trade, void',
      officialText: 'Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void.',
      relevanceKeywords: ['non-compete', 'restraint of trade', 'post-employment restriction', 'competing business', 'restraint', 'prohibit work'],
      summary: 'Under Section 27 of the Indian Contract Act, post-employment non-compete covenants restricting an employee from taking up employment with a competitor are generally void and legally unenforceable in India.',
      officialUrl: 'https://www.indiacode.nic.in/handle/123456789/2187',
    },
    {
      id: 'statute-contract-73',
      actName: 'The Indian Contract Act, 1872',
      section: 'Section 73 — Compensation for loss or damage caused by breach of contract',
      officialText: 'When a contract has been broken, the party who suffers by such breach is entitled to receive, from the party who has broken the contract, compensation for any loss or damage caused to him thereby.',
      relevanceKeywords: ['breach', 'penalty', 'damages', 'liquidated damages', 'loss', 'indemnity', 'compensation'],
      summary: 'Section 73 mandates that compensation for contract breach is limited to actual direct loss naturally arising from the breach. Unreasonable, excessive liquidated damages or penalty clauses are subject to judicial moderation.',
      officialUrl: 'https://www.indiacode.nic.in/handle/123456789/2187',
    },
    {
      id: 'statute-shops-notice',
      actName: 'Delhi Shops and Establishments Act, 1954 / State Shops & Est. Acts',
      section: 'Section 30 — Notice of dismissal or termination',
      officialText: 'No employer shall dispense with the services of an employee who has been in his continuous employment for not less than three months without giving such employee at least one month notice or wages in lieu thereof.',
      relevanceKeywords: ['notice period', 'termination', 'notice', 'wages in lieu', 'pay in lieu of notice', 'resignation notice'],
      summary: 'Statutory shops and establishment laws generally mandate a minimum 30-day notice or notice pay for employees who have completed probation, balancing employer and employee obligations.',
      officialUrl: 'https://labour.gov.in',
    },
    {
      id: 'statute-it-43a',
      actName: 'The Information Technology Act, 2000',
      section: 'Section 43A — Compensation for failure to protect data',
      officialText: 'Where a body corporate, possessing, dealing or handling any sensitive personal data or information in a computer resource which it owns, controls or operates, is negligent in implementing and maintaining reasonable security practices... such body corporate shall be liable to pay damages by way of compensation to the person so affected.',
      relevanceKeywords: ['data privacy', 'confidentiality', 'confidential information', 'data protection', 'sensitive personal data', 'security practices'],
      summary: 'Section 43A imposes strict compliance obligations on organizations handling sensitive employee or personal data to maintain reasonable security procedures.',
      officialUrl: 'https://www.indiacode.nic.in/handle/123456789/1999',
    },
    {
      id: 'statute-copyright-17',
      actName: 'The Copyright Act, 1957',
      section: 'Section 17(c) — First owner of copyright in work made during employment',
      officialText: 'In the case of a work made in the course of the author’s employment under a contract of service or apprenticeship, the employer shall, in the absence of any agreement to the contrary, be the first owner of the copyright therein.',
      relevanceKeywords: ['intellectual property', 'ip assignment', 'invention', 'copyright', 'work made for hire', 'patent', 'work created'],
      summary: 'Section 17(c) confirms that IP created by an employee during the normal course of employment under a contract of service belongs to the employer unless agreed otherwise.',
      officialUrl: 'https://www.indiacode.nic.in/handle/123456789/1367',
    },
    {
      id: 'statute-gratuity-4',
      actName: 'The Payment of Gratuity Act, 1972',
      section: 'Section 4 — Payment of gratuity',
      officialText: 'Gratuity shall be payable to an employee on the termination of his employment after he has rendered continuous service for not less than five years.',
      relevanceKeywords: ['gratuity', '5 years', 'five years', 'superannuation', 'retirement benefit', 'severance pay'],
      summary: 'Employees completing 5 years of continuous service are statutorily entitled to gratuity payment calculated at 15 days salary per year of service.',
      officialUrl: 'https://www.indiacode.nic.in/handle/123456789/1660',
    },
  ];

  /**
   * Matches statutory authority relevant to text content or search query.
   */
  public static findRelevantOfficialSources(queryOrClauseText: string): OfficialAuthorityMatch[] {
    const textLower = queryOrClauseText.toLowerCase();
    const matches: OfficialAuthorityMatch[] = [];

    for (const statute of this.STATUTE_DATABASE) {
      const matchCount = statute.relevanceKeywords.filter(kw => textLower.includes(kw.toLowerCase())).length;

      if (matchCount > 0) {
        matches.push({
          id: statute.id,
          actName: statute.actName,
          section: statute.section,
          officialText: statute.officialText,
          relevanceSummary: statute.summary,
          officialUrl: statute.officialUrl,
          sourceTier: 'authoritative',
        });
      }
    }

    return matches;
  }
}
