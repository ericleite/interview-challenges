import { HomeLayout, Layout } from "components";
import { GetStaticProps } from "next";
import Head from "next/head";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>BTC Address Balances over Time</title>
      </Head>
      <HomeLayout />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
