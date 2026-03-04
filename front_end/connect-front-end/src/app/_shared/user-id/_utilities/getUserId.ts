import getServerUrl from "../../../../../utilities/fetchApiUrl";
import { GetToken } from "../../../../../utilities/getTokenType";

type GetUserIdResponse = {
  statusCode: number;
  message: string;
  userId: string;
};

export async function getUserId(getToken: GetToken) {
  const token = await getToken();
  const serverUrl = getServerUrl();
  const userId = await fetch(serverUrl + "/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  let response: GetUserIdResponse;

  try {
    response = await userId.json();
  } catch (error) {
    throw new Error(
      `Request failed: ${userId.status} ${userId.statusText}. Could not parse response body.`,
    );
  }

  if (!userId.ok) {
    throw new Error(`unable to get user id: ${response.message}`);
  }

  return response.userId;
}
