import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export interface UserSelectProps {
  user: User | null;
}

export type MemberProfile = {
  name: string | null;
  email: string | null;
  id: string;
  linkedin: string | null;
  pfp: string | null;
  club_roles: string[];
  major: string | null;
  graduation_date: number;
  about: string | null;
  completed: boolean;
  phone: string | null;
};

export const MAX_INPUT_SIZE = 40;
export const MAX_ABOUT_SIZE = 400;
export const BASE_LINKEDIN_URL = "https://linkedin.com/in/";