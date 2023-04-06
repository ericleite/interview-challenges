import { HomeLayout, Layout } from "components";
import Head from "next/head";
import { SWRConfig } from "swr";
import { BtcAddressChartData, ApiEndpoints } from "types";
import { downsampleChartData, loadBtcAddressChartData } from "utils";

interface Props {
  fallback: {
    [ApiEndpoints.BtcAddresses]: BtcAddressChartData;
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
  const chartData = await loadBtcAddressChartData();
  const downsampledChartData = downsampleChartData(chartData);
  return {
    props: {
      fallback: {
        [ApiEndpoints.BtcAddresses]: downsampledChartData,
      },
    },
  };
}
