type OtpRecord = {
  code: string;
  expiresAt: number; // epoch ms
};

type TokenRecord = {
  token: string;
  expiresAt: number;
};

class InMemoryStore {
  private otpByEmail = new Map<string, OtpRecord>();
  private verifyByEmail = new Map<string, TokenRecord>();

  setOtp(email: string, code: string, ttlMs: number) {
    const expiresAt = Date.now() + ttlMs;
    this.otpByEmail.set(email.toLowerCase(), { code, expiresAt });
  }

  getOtp(email: string): OtpRecord | undefined {
    const rec = this.otpByEmail.get(email.toLowerCase());
    if (!rec) return undefined;
    if (Date.now() > rec.expiresAt) {
      this.otpByEmail.delete(email.toLowerCase());
      return undefined;
    }
    return rec;
  }

  clearOtp(email: string) {
    this.otpByEmail.delete(email.toLowerCase());
  }

  setVerifyToken(email: string, token: string, ttlMs: number) {
    const expiresAt = Date.now() + ttlMs;
    this.verifyByEmail.set(email.toLowerCase(), { token, expiresAt });
  }

  getVerifyToken(email: string): TokenRecord | undefined {
    const rec = this.verifyByEmail.get(email.toLowerCase());
    if (!rec) return undefined;
    if (Date.now() > rec.expiresAt) {
      this.verifyByEmail.delete(email.toLowerCase());
      return undefined;
    }
    return rec;
  }

  clearVerifyToken(email: string) {
    this.verifyByEmail.delete(email.toLowerCase());
  }
}

export const otpStore = new InMemoryStore();


