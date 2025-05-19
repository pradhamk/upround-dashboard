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
  full_display?: boolean;
}

// Could use supabase type generation here but this is more preferable
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

export type StartupProfile = {
  id: string,
  name: string,
  industry: string,
  sourcer: string,
  status: string,
  source: string,
  mvc_level: string,
  date_sourced: string,
  website: string,
  description: string,
  tagline: string,
  contact: string,
};

export type EnrichedAnalystInsight = {
  id: string,
  company: string,
  member: string,
  created_at: string,
  notes: string,
  user_pfp: string,
  user_name: string,
  user_email: string,
};

export type InsightActionBody = {
  method: 'create' | 'edit' | 'delete',
  notes: string,
  company_id: string,
  insight_id?: string,
};

export enum DealflowStatus {
  Contacted = "Contacted",
  Call = "Call",
  Memo_Written = "Memo Written",
  Passed_To_Partners = "Passed To Partners",
  Passed_To_Fund = "Passed To Fund",
  Rejected = "Rejected"
}

export enum MVCLevel {
  Yes = "Yes",
  No = "No",
  Not_Sure = "Not Sure"
}

export function generatePreview(url: string): string {
  return SEARCH_ICON_LINK + encodeURI(url);
}

export const MAX_INPUT_SIZE = 40;
export const MAX_ABOUT_SIZE = 400;
export const BASE_LINKEDIN_URL = "https://linkedin.com/in/";
export const SEARCH_ICON_LINK = "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=64&url=";