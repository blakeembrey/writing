import React from "react";
import Head from "next/head";
import Link from "next/link";
import { format } from "date-fns";
import { styled } from "react-free-style";
import { getAllPosts } from "../lib/api";
import { getPostUrl, postToDate } from "../lib/utils";
import { Layout } from "../components/layout";

const Article = styled("div", {});

const ArticleMetadata = styled("div", {
  color: "var(--text-color-subtle)",
  fontSize: "0.8em",
});

const ArticleTitle = styled("h2", {
  fontWeight: "normal",
});

export type Props = {
  posts: Array<{ url: string; title: string; date: string }>;
};

const Index: React.FC<Props> = ({ posts }) => {
  return (
    <>
      <Head>
        <title>Blake Embrey</title>
      </Head>
      <Layout page="index">
        {posts.map((x) => {
          return (
            <Article key={x.title}>
              <ArticleMetadata>{x.date}</ArticleMetadata>
              <ArticleTitle>
                <Link href={x.url}>{x.title}</Link>
              </ArticleTitle>
            </Article>
          );
        })}
      </Layout>
    </>
  );
};

export default Index;

export const getStaticProps = async (): Promise<{ props: Props }> => {
  const posts = await getAllPosts();

  return {
    props: {
      posts: posts.map((post) => ({
        url: getPostUrl(post.path),
        title: post.data.title || "",
        date: format(postToDate(post), "d MMMM yyyy"),
      })),
    },
  };
};
