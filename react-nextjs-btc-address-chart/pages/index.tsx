import { HomeLayout, Layout } from "components";
import Head from "next/head";
import { SWRConfig } from "swr";
import {
  ApiEndpoints,
  BtcAddressChartData,
  BtcAddressesTimePeriod,
} from "types";
import { downsampleChartData, loadBtcAddressChartData } from "utils";

const BTC_ADDRESSES_API_FALLBACK_KEY =
  `${ApiEndpoints.BtcAddresses}?period=${BtcAddressesTimePeriod.All}` as const;

interface Props {
  fallback: {
    [BTC_ADDRESSES_API_FALLBACK_KEY]: BtcAddressChartData;
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
  const chartData = await loadBtcAddressChartData(BtcAddressesTimePeriod.All);
  const downsampledChartData = downsampleChartData(chartData);
  return {
    props: {
      fallback: {
        [BTC_ADDRESSES_API_FALLBACK_KEY]: downsampledChartData,
      },
    },
  };
}
