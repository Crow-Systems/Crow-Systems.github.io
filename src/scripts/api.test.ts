import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  ApiError,
  ApiParseError,
  submitContact,
  submitConsultation,
  uploadAudio,
} from "./api";

const mockFetch = vi.fn();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  mockFetch.mockReset();
});

describe("submitContact", () => {
  it("POSTs the contact payload and returns success", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: true }));
    const result = await submitContact({
      name: "Ana",
      email: "ana@example.com",
      subject: "Consulta",
      message: "Quiero información sobre sus servicios.",
    });
    expect(result).toEqual({ success: true });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://crowsys.chrislabs.net/api/v1/contact");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      name: "Ana",
      email: "ana@example.com",
      subject: "Consulta",
      message: "Quiero información sobre sus servicios.",
    });
  });

  it("rejects a payload with a short message before fetching", () => {
    // schema.parse throws synchronously (before request is reached)
    expect(() =>
      submitContact({
        name: "Ana",
        email: "ana@example.com",
        subject: "Consulta",
        message: "corto",
      }),
    ).toThrow();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects an invalid email before fetching", () => {
    expect(() =>
      submitContact({
        name: "Ana",
        email: "not-an-email",
        subject: "Consulta",
        message: "Mensaje válido de prueba",
      }),
    ).toThrow();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("rejects an empty name before fetching", () => {
    expect(() =>
      submitContact({
        name: "  ",
        email: "ana@example.com",
        subject: "Consulta",
        message: "Mensaje válido de prueba",
      }),
    ).toThrow();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("throws ApiError with status and errorKey on field error response", async () => {
    mockFetch.mockResolvedValue(
      jsonResponse(
        { success: false, errorKey: "VALIDATION_NAME_REQUIRED" },
        422,
      ),
    );
    try {
      await submitContact({
        name: "Ana",
        email: "ana@example.com",
        subject: "Consulta",
        message: "Mensaje válido de prueba",
      });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(422);
      expect((err as ApiError).errorKey).toBe("VALIDATION_NAME_REQUIRED");
    }
  });
});

describe("submitConsultation", () => {
  it("POSTs a valid consultation payload", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: true }));
    const result = await submitConsultation({
      fullName: "Juan Pérez",
      phone: "+52 55 1234 5678",
      businessProblem:
        "Necesito automatizar la facturación e integrarla con el CRM.",
    });
    expect(result).toEqual({ success: true });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://crowsys.chrislabs.net/api/v1/consultation");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      fullName: "Juan Pérez",
      phone: "+52 55 1234 5678",
      businessProblem:
        "Necesito automatizar la facturación e integrarla con el CRM.",
    });
  });

  it("rejects a short businessProblem before fetching", () => {
    expect(() =>
      submitConsultation({
        fullName: "Juan Pérez",
        phone: "+52 55 1234 5678",
        businessProblem: "corto",
      }),
    ).toThrow();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

describe("uploadAudio", () => {
  const payload = {
    audioBlob: new Blob(["fake-audio"], { type: "audio/webm" }),
    fullName: "Ana",
    phone: "+52 55 1234 5678",
  };

  it("POSTs multipart form data with webm filename", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: true }));
    const result = await uploadAudio(payload);
    expect(result).toEqual({ success: true });
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://crowsys.chrislabs.net/api/v1/audio/upload");
    expect(init.method).toBe("POST");
    const body = init.body as FormData;
    expect(body.get("audio") instanceof Blob).toBe(true);
    expect((body.get("audio") as File).name).toBe("recording.webm");
    expect(body.get("fullName")).toBe("Ana");
    expect(body.get("phone")).toBe("+52 55 1234 5678");
  });

  it("uses mp3 extension for audio/mpeg blobs", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: true }));
    await uploadAudio({
      audioBlob: new Blob(["x"], { type: "audio/mpeg" }),
    });
    const body = mockFetch.mock.calls[0][1].body as FormData;
    expect((body.get("audio") as File).name).toBe("recording.mp3");
  });

  it("falls back to webm extension for unknown MIME types", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: true }));
    await uploadAudio({
      audioBlob: new Blob(["x"], { type: "application/octet-stream" }),
    });
    const body = mockFetch.mock.calls[0][1].body as FormData;
    expect((body.get("audio") as File).name).toBe("recording.webm");
  });

  it("throws ApiError on upload failure", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ success: false }, 500));
    try {
      await uploadAudio(payload);
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(500);
    }
  });
});

describe("parseResponse error path", () => {
  it("throws ApiParseError when the server returns non-JSON", async () => {
    mockFetch.mockResolvedValue(new Response("<html>oops</html>", { status: 502 }));
    try {
      await submitContact({
        name: "Ana",
        email: "ana@example.com",
        subject: "Consulta",
        message: "Mensaje válido de prueba",
      });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(ApiParseError);
    }
  });
});