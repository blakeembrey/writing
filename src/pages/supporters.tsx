import React from "react";
import Head from "next/head";
import { Layout } from "../components/layout";

export type Props = {
  supporters: Array<{ name: string; url: string }>;
};

const Supporters: React.FC<Props> = ({ supporters }) => {
  return (
    <>
      <Head>
        <title>Supporters • Blake Embrey</title>
      </Head>
      <Layout page="supporters">
        <ul>
          {supporters.map((x) => {
            return (
              <li key={x.name}>
                <a href={x.url}>{x.name}</a>
              </li>
            );
          })}
        </ul>
      </Layout>
    </>
  );
};

export default Supporters;

export const getStaticProps = async (): Promise<{ props: Props }> => {
  return {
    props: {
      supporters: [
        { name: "Ideal Postcodes", url: "https://ideal-postcodes.co.uk/" },
        { name: "RaiderIO", url: "https://raider.io/" },
      ],
    },
  };
};
