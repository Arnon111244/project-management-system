import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { URL } from "url";

const isDev = process.env.NODE_ENV === "development";

/**
 * API Proxy Route
 * Forwards requests to BaseUrl API to avoid CORS issues
 *
 * This route acts as a middleware between the browser and the BaseUrl API
 * Uses native Node.js https module for direct, reliable connections
 */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;

    // Get the path segments from the dynamic route
    const path = resolvedParams.path?.join("/") || "";

    // Construct the target URL
    const targetUrl = `https://apps1.yourBaseUrl.io/${path}`;

    if (isDev) console.log("[API-PROXY] POST", targetUrl);

    // Get the request body
    const body = await request.text();

    // Parse the target URL
    const parsedUrl = new URL(targetUrl);

    // Prepare headers - copy Authorization if present
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body).toString(),
      Accept: "application/json",
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      requestHeaders["Authorization"] = authHeader;
    }

    // Make the HTTPS request using native Node.js https module
    const {
      data,
      statusCode,
      headers: responseHeaders,
    } = await new Promise<{
      data: string;
      statusCode: number;
      headers: Record<string, string | string[] | undefined>;
    }>((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname,
        method: "POST",
        headers: requestHeaders,
        rejectUnauthorized: true,
        family: 4, // Force IPv4
      };

      const req = https.request(options, (res) => {
        let responseData = "";
        res.setEncoding("utf8");

        res.on("data", (chunk: string) => {
          responseData += chunk;
        });

        res.on("end", () => {
          if (isDev && res.statusCode && res.statusCode >= 400) {
            console.error(
              "[API-PROXY] Error response:",
              res.statusCode,
              responseData.substring(0, 200),
            );
          }

          resolve({
            data: responseData,
            statusCode: res.statusCode || 200,
            headers: res.headers as Record<
              string,
              string | string[] | undefined
            >,
          });
        });
      });

      req.on("error", (error: Error) => {
        console.error("[API-PROXY] Request failed:", error.message);
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.write(body);
      req.end();
    });

    // Create response
    const proxyResponse = new NextResponse(data, {
      status: statusCode,
    });

    // Copy relevant headers from response
    Object.entries(responseHeaders).forEach(([key, value]) => {
      if (
        value &&
        !["content-encoding", "transfer-encoding"].includes(key.toLowerCase())
      ) {
        proxyResponse.headers.set(
          key,
          Array.isArray(value) ? value.join(", ") : value,
        );
      }
    });

    return proxyResponse;
  } catch (error: any) {
    console.error("❌ Proxy error:", error.message);

    return NextResponse.json(
      {
        error: "Failed to proxy request",
        message: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }
}

// Also support GET requests if needed
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;

    const path = resolvedParams.path?.join("/") || "";
    const targetUrl = `https://apps1.yourBaseUrl.io/${path}`;

    if (isDev) console.log("[API-PROXY] GET", targetUrl);

    const parsedUrl = new URL(targetUrl);

    // Prepare headers - copy Authorization if present
    const requestHeaders: Record<string, string> = {
      Accept: "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      requestHeaders["Authorization"] = authHeader;
    }

    const {
      data,
      statusCode,
      headers: responseHeaders,
    } = await new Promise<{
      data: string;
      statusCode: number;
      headers: Record<string, string | string[] | undefined>;
    }>((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname,
        method: "GET",
        headers: requestHeaders,
        rejectUnauthorized: true,
        family: 4,
      };

      const req = https.request(options, (res) => {
        let responseData = "";
        res.setEncoding("utf8");

        res.on("data", (chunk: string) => {
          responseData += chunk;
        });

        res.on("end", () => {
          if (isDev && res.statusCode && res.statusCode >= 400) {
            console.error(
              "[API-PROXY] Error response:",
              res.statusCode,
              responseData.substring(0, 200),
            );
          }

          resolve({
            data: responseData,
            statusCode: res.statusCode || 200,
            headers: res.headers as Record<
              string,
              string | string[] | undefined
            >,
          });
        });
      });

      req.on("error", (error: Error) => {
        console.error("[API-PROXY] Request failed:", error.message);
        reject(error);
      });

      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error("Request timeout"));
      });

      req.end();
    });

    const proxyResponse = new NextResponse(data, {
      status: statusCode,
    });

    Object.entries(responseHeaders).forEach(([key, value]) => {
      if (
        value &&
        !["content-encoding", "transfer-encoding"].includes(key.toLowerCase())
      ) {
        proxyResponse.headers.set(
          key,
          Array.isArray(value) ? value.join(", ") : value,
        );
      }
    });

    return proxyResponse;
  } catch (error: any) {
    console.error("❌ Proxy GET error:", error.message);

    return NextResponse.json(
      {
        error: "Failed to proxy GET request",
        message: error.message,
        code: error.code,
      },
      { status: 500 },
    );
  }
}
