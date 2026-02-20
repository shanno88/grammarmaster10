export const Utils = {
  generateMachineId(): string {
    let machineId = localStorage.getItem('grammar_machine_id');
    
    if (!machineId) {
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        screen.colorDepth,
        new Date().getTimezoneOffset(),
        this.getCanvasFingerprint()
      ].join('|');
      
      machineId = 'MID-' + this.simpleHash(fingerprint).substring(0, 16).toUpperCase();
      localStorage.setItem('grammar_machine_id', machineId);
    }
    
    return machineId;
  },

  getCanvasFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';
      
      canvas.width = 200;
      canvas.height = 50;
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Grammar Master', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Fingerprint', 4, 35);
      
      return canvas.toDataURL().slice(-50);
    } catch {
      return 'canvas-error';
    }
  },

  simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
};
