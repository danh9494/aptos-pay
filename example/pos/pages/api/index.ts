import { Account, AccountAddress } from "@aptos-labs/ts-sdk";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { aptosClient } from "../aptos";
import {
  APTOS_DEVNET_URL,
  createTransferAptos,
  validateTransaction,
} from "apto-pay";

interface GetResponse {
  label: string;
  icon: string;
}

const get: NextApiHandler<GetResponse> = async (request, response) => {
  const label = request.query.label;
  if (!label) throw new Error("missing label");
  if (typeof label !== "string") throw new Error("invalid label");

  const icon = `https://${request.headers.host}/vercel.svg`;

  response.status(200).send({
    label,
    icon,
  });
};

const post: NextApiHandler<Response> = async (request, response) => {
  const recipientField = request.query.recipient;
  if (!recipientField) throw new Error("missing recipient");
  if (typeof recipientField !== "string") throw new Error("invalid recipient");

  const amountField = request.query.amount;
  if (!amountField) throw new Error("missing amount");
  if (typeof amountField !== "string") throw new Error("invalid amount");

  const coinType = request.body?.coinType;
  if (!coinType) throw new Error("missing account");
  if (typeof coinType !== "string") throw new Error("invalid coinType");

  const label = request.body?.coinType;

  const sampleAccount = Account.generate();
  const address = sampleAccount.accountAddress;

  const recipient = AccountAddress.from(recipientField);
  const amount = Number(amountField);
  const tx = await createTransferAptos(address, aptosClient, {
    recipient,
    amount,
    coinType,
    label,
  });

  return tx;
};

const put: NextApiHandler<Response> = async (request, response) => {
  const transactionHash = request.query.txHash;
  if (!transactionHash) throw new Error("missing txHash");
  if (typeof transactionHash !== "string") throw new Error("invalid txHash");

  const txResponse = await validateTransaction({
    url: APTOS_DEVNET_URL,
    txHash: transactionHash,
  });

  if (txResponse.type == "commited") {
    response.redirect(200, "/confirmation");
  } else {
    response.redirect(307, "/");
  }
};

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === "GET") return get(request, response);
  if (request.method === "POST") return post(request, response);
  if (request.method === "PUT") return put(request, response);

  throw new Error(`Unexpected method ${request.method}`);
}
