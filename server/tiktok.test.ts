import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("TikTok Events API helper", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("should send PageView event and return true on success", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ code: 0, message: "OK" }),
    });

    const { sendTikTokEvent } = await import("./tiktok");
    const result = await sendTikTokEvent({
      eventType: "PageView",
      pageUrl: "https://acahydraulic.kz/",
      userAgent: "Mozilla/5.0",
      ip: "1.2.3.4",
    });

    expect(result).toBe(true);
    expect(mockFetch).toHaveBeenCalledOnce();

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain("tiktok.com");
    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);
    expect(body.pixel_code).toBe("D6M5H3JC77U9JTU04Q60");
    expect(body.data[0].event).toBe("PageView");
    expect(body.data[0].page.url).toBe("https://acahydraulic.kz/");
  });

  it("should send Contact event with hashed phone", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ code: 0, message: "OK" }),
    });

    const { sendTikTokEvent } = await import("./tiktok");
    const result = await sendTikTokEvent({
      eventType: "Contact",
      pageUrl: "https://acahydraulic.kz/contacts",
      phone: "+77714177925",
    });

    expect(result).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.data[0].event).toBe("Contact");
    // Phone should be hashed, not plain text
    expect(body.data[0].user.phone_number).not.toBe("+77714177925");
    expect(body.data[0].user.phone_number).toHaveLength(64); // SHA-256 hex
  });

  it("should send SubmitForm event with hashed email", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ code: 0, message: "OK" }),
    });

    const { sendTikTokEvent } = await import("./tiktok");
    const result = await sendTikTokEvent({
      eventType: "SubmitForm",
      pageUrl: "https://acahydraulic.kz/",
      email: "test@example.com",
    });

    expect(result).toBe(true);
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.data[0].event).toBe("SubmitForm");
    // Email should be hashed
    expect(body.data[0].user.email).not.toBe("test@example.com");
    expect(body.data[0].user.email).toHaveLength(64);
  });

  it("should return false on API error response", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ code: 40001, message: "Invalid token" }),
    });

    const { sendTikTokEvent } = await import("./tiktok");
    const result = await sendTikTokEvent({
      eventType: "PageView",
      pageUrl: "https://acahydraulic.kz/",
    });

    expect(result).toBe(false);
  });

  it("should return false on network error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { sendTikTokEvent } = await import("./tiktok");
    const result = await sendTikTokEvent({
      eventType: "PageView",
      pageUrl: "https://acahydraulic.kz/",
    });

    expect(result).toBe(false);
  });
});
