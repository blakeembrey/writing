import { join } from "path";
import matter from "gray-matter";
import { globby } from "globby";
import { readFile } from "fs/promises";
import { PostEntity } from "../types/entities";
import markdownToHtml from "./md";
import { getPostUrl } from "./utils";

const postsDirectory = join(process.cwd(), "posts");

export async function getPostPaths() {
  return globby("**/*.md", { cwd: postsDirectory });
}

export async function getPostByPath(path: string): Promise<PostEntity> {
  const fullPath = join(postsDirectory, path);
  const fileContents = await readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const html = await markdownToHtml(content);
  const url = getPostUrl(path);
  return { data, html, path, url };
}

export async function getAllPosts() {
  const paths = await getPostPaths();
  const pages = await Promise.all(paths.map((x) => getPostByPath(x)));
  return pages.sort((a, b) =>
    (a.data.date || "") < (b.data.date || "") ? 1 : -1,
  );
}
