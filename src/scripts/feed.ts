import { Feed } from "feed";
import { parseISO } from "date-fns";
import { writeFile } from "fs/promises";
import { join } from "path";
import {
  siteName,
  siteDescription,
  baseUrl,
  name,
  email,
  link,
} from "../lib/config";
import { getAllPosts } from "../lib/api";

async function main() {
  const now = new Date();

  const feed = new Feed({
    title: siteName,
    description: siteDescription,
    id: baseUrl,
    link: baseUrl,
    image: undefined,
    copyright: `Copyright ${now.getFullYear()} ${name}`,
    updated: now,
    author: { name, email, link },
  });

  const posts = await getAllPosts();

  for (const {
    data: { title, image, date },
    url,
    html,
  } of posts.slice(0, 15)) {
    feed.addItem({
      title: title || "",
      id: url,
      link: `${baseUrl}${url}`,
      content: html,
      date: date ? parseISO(date) : new Date(0),
      image: image,
    });
  }

  return writeFile(join(__dirname, "../../public/rss.xml"), feed.rss2());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
