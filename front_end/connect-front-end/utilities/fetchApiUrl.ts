export default function getServerUrl() {
  if (process.env.NEXT_PUBLIC_DEV == "true" || !process.env.NEXT_PUBLIC_DEV) {
    return "http://localhost:3003";
  }

  return process.env.NEXT_PUBLIC_SERVER_URL_PROD;
}
