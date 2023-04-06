import { HomeLayout, Layout } from "components";
import Head from "next/head";
import { SWRConfig } from "swr";
import { AddressBalanceChartData, ApiEndpoints } from "types";
import { loadBtcAddressesData } from "utils";

interface Props {
  fallback: {
    [ApiEndpoints.BtcAddresses]: AddressBalanceChartData;
  };
}

export default function Home({ fallback }: Props) {
  return (
    <SWRConfig value={{ fallback }}>
      <Layout>
        <Head>
          <title>BTC Address Balances over Time</title>
        </Head>
        <HomeLayout />
      </Layout>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  const chartData = await loadBtcAddressesData();
  return {
    props: {
      fallback: {
        [ApiEndpoints.BtcAddresses]: chartData,
      },
    },
  };
}
