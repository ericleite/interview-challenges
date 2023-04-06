import Head from "next/head";
import { Layout } from "components";
import { GetStaticProps } from "next";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>BTC Address Balances over Time</title>
      </Head>
      <section>
        <div className="max-w-2xl mx-auto p-8 text-center">Chart goes here</div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
