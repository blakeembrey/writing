import { PostEntity } from "../types/entities";
import { parseISO } from "date-fns";

export function postSlug(path: string): string {
  return path.replace(/\.md$/, "");
}

export function getPostUrl(path: string): string {
  return `/posts/${postSlug(path)}`;
}

export function postToDate(post: PostEntity): Date {
  if (!post.data.date) return new Date(0);
  return parseISO(post.data.date);
}
