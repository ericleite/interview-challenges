import { NextApiRequest, NextApiResponse } from "next";
import { loadBtcAddressesData } from "utils";

export default async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await loadBtcAddressesData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Failed to load data.",
    });
  }
};
