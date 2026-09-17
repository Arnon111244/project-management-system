import { NextResponse } from "next/server";
import { lookup } from "dns/promises";

/**
 * Test endpoint to debug network connectivity
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    tests: {},
  };

  // Test 1: DNS Resolution
  try {
    const addresses = await lookup("apps1.yourBaseUrl.io", { all: true });
    results.tests.dns = {
      success: true,
      addresses: addresses,
    };
  } catch (error: any) {
    results.tests.dns = {
      success: false,
      error: error.message,
    };
  }

  // Test 2: Basic HTTPS connectivity
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch("https://apps1.yourBaseUrl.io", {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    results.tests.basicHTTPS = {
      success: true,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: any) {
    results.tests.basicHTTPS = {
      success: false,
      error: error.message,
      code: error.code,
      cause: error.cause?.message,
    };
  }

  // Test 3: API endpoint connectivity
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      "https://apps1.yourBaseUrl.io/api/Login/authenticate-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          LoginFromMobile: false,
          UserName: "test",
          Password: "test",
          ClientType: "person",
        }),
        signal: controller.signal,
      },
    );

    clearTimeout(timeout);

    const text = await response.text();

    results.tests.apiEndpoint = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      responseLength: text.length,
      responsePreview: text.substring(0, 200),
    };
  } catch (error: any) {
    results.tests.apiEndpoint = {
      success: false,
      error: error.message,
      code: error.code,
      cause: error.cause?.message,
    };
  }

  // Test 4: Environment variables
  results.environment = {
    NODE_ENV: process.env.NODE_ENV,
    hasProxy: {
      HTTP_PROXY: !!process.env.HTTP_PROXY,
      HTTPS_PROXY: !!process.env.HTTPS_PROXY,
      NO_PROXY: process.env.NO_PROXY,
    },
  };

  return NextResponse.json(results, { status: 200 });
}
