import {
  ActionGetResponse,
  ActionPostRequest,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
  LinkedAction,
} from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Vottingdapp } from "@project/anchor";
import { BN, Program } from "@coral-xyz/anchor";

const IDL = require("../../../../anchor/target/idl/vottingdapp.json");

export const OPTIONS = GET;

export async function GET(request: Request): Promise<Response> {
  const actionMetaData: ActionGetResponse = {
    icon: "https://di-uploads-pod42.dealerinspire.com/peterboulwaretoyotacolumbia/uploads/2024/04/toyota-vs-nissan-logos.jpg",
    title: "Vote for your favourite Brand of cars",
    description: "vote between Toyota and Nissan",
    label: "Vote",
    links: {
      actions: [
        {
          href: "/api/vote?candidate=Toyota",
          label: "Vote for Toyota",
          type: "post",
        },
        {
          href: "/api/vote?candidate=Nissan",
          label: "Vote for Nissan",
          type: "post",
        },
      ],
    },
  };

  return new Response(JSON.stringify(actionMetaData), {
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");

  if (candidate != "Toyota" && candidate != "Nissan") {
    return new Response("Invalid candidate", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const connection = new Connection("http://localhost:8899", "confirmed");
  const program: Program<Vottingdapp> = new Program(IDL, { connection });
  const body: ActionPostRequest = await request.json();
  let voter;
  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid account", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
  const instruction = await program.methods
    .vote(candidate, new BN(1))
    .accounts({
      signer: voter,
    })
    .instruction();

  const blockHash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockHash.blockhash,
    lastValidBlockHeight: blockHash.lastValidBlockHeight,
  }).add(instruction);

  const response = await createPostResponse({
    fields: {
      transaction: transaction,
    },
  });
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS });
}
