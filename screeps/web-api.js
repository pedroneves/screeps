import { URL, URLSearchParams } from "node:url";

const PROTO = "https";
const HOST = "screeps.com";

const getOrigin = () => `${PROTO}://${HOST}`;

export const getCode = async (token = "") => {
  if (!token) throw new Error("Missing token");

  const searchParams = new URLSearchParams({ _token: token });

  const url = new URL("/api/user/code", getOrigin());
  url.search = searchParams.toString();

  const headers = new Headers();
  headers.set("Content-Type", "application/json; charset=utf-8");

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (response.ok) return response.json();

  const failedError = new Error("Failed to fetch code");
  failedError.response = response;
  throw failedError;
};
