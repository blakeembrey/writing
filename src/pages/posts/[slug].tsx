import React from "react";
import { styled } from "react-free-style";
import Head from "next/head";
import { format } from "date-fns";
import { Layout } from "../../components/layout";
import { getPostByPath, getPostPaths } from "../../lib/api";
import { postSlug, getPostUrl, postToDate } from "../../lib/utils";
import { siteName, baseUrl, siteRepo } from "../../lib/config";
import type { PostEntity } from "../../types/entities";

type Props = {
  post: PostEntity;
};

const Info = styled("ul", {
  margin: "0 0 2em 0",
  padding: 0,
  color: "var(--text-color-subtle)",
  fontSize: "0.85em",
  "> li > a": {
    color: "var(--text-color-subtle)",
  },
  "> li": {
    listStyle: "none",
    display: "inline-block",
    paddingRight: 20,
  },
});

export default function ({ post }: Props) {
  const { title, image, github, npm, description } = post.data;
  const date = postToDate(post);
  const fullUrl = `${baseUrl}${post.url}`;

  return (
    <Layout>
      <Head>
        <title>{post.data.title} • Blake Embrey</title>
        <link rel="canonical" href={fullUrl} />
        <meta name="og:type" content="article" />
        <meta name="og:title" content={title} />
        <meta name="og:site_name" content={siteName} />
        <meta name="og:url" content={fullUrl} />
        <meta name="description" content={description} />
        <meta name="og:description" content={description} />
        {image ? <meta name="og:image" content={image} /> : undefined}
        {date ? (
          <meta name="article:published_time" content={date.toISOString()} />
        ) : undefined}
        <meta name="twitter:site" content="@blakeembrey" />
      </Head>
      <h1>{title}</h1>
      <Info>
        {date ? (
          <li>
            Written{" "}
            <time dateTime={date.toISOString()}>
              {format(date, "d MMMM yyyy")}
            </time>
          </li>
        ) : undefined}
        {github ? (
          <li>
            <a href={`https://github.com/${github}`}>View on GitHub</a>
          </li>
        ) : undefined}
        {npm ? (
          <li>
            <a href={`http://npmjs.org/package/${npm}`}>View on NPM</a>
          </li>
        ) : undefined}
      </Info>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <hr />
      <p>
        <strong>Questions?</strong> Find me on{" "}
        <a href="https://twitter.com/blakeembrey">Twitter</a> or{" "}
        <a href={siteRepo}>open an issue</a>.
      </p>
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = await getPostByPath(`${params.slug}.md`);

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const paths = await getPostPaths();

  return {
    paths: paths.map((path) => {
      return {
        params: {
          slug: postSlug(path),
        },
      };
    }),
    fallback: false,
  };
}
