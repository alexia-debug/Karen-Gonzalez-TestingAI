declare module 'zerostep' {
  export class ZeroStep {
    constructor(page: any);
    step(description: string): Promise<void>;
  }
  
  export function zeroStep(page: any): (description: string) => Promise<void>;
} 