import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Vottingdapp } from "../target/types/vottingdapp";
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { beforeAll, describe, expect, it, test } from "@jest/globals";

const IDL = require("../target/idl/vottingdapp.json");

const vottingAddress = new PublicKey(
  "AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ"
);

describe("vottingdapp", () => {
  let context;
  let provider;
  let vottingProgram: any;

  beforeAll(async () => {
    context = await startAnchor(
      "",
      [{ name: "vottingdapp", programId: vottingAddress }],
      []
    );
    provider = new BankrunProvider(context);
    vottingProgram = new Program<Vottingdapp>(IDL, provider);
  });
  it("Initialize Poll", async () => {
    context = await startAnchor(
      "",
      [{ name: "vottingdapp", programId: vottingAddress }],
      []
    );
    provider = new BankrunProvider(context);

    vottingProgram = new Program<Vottingdapp>(IDL, provider);

    await vottingProgram.methods
      .initializaPoll(
        new anchor.BN(2),
        "What is your favorite type of car",
        new anchor.BN(0),
        new anchor.BN(1828821978)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(2).toArrayLike(Buffer, "le", 8)],
      vottingAddress
    );
    const poll = await vottingProgram.account.poll.fetch(pollAddress);
    console.log(poll);
    expect(poll.pollId.toNumber()).toBe(2);
    expect(poll.description).toBe("What is your favorite type of car");
  });

  it("Initialize Candidate", async () => {
    await vottingProgram.methods
      .initializeCandidate("Toyota", new anchor.BN(2))
      .rpc();
    await vottingProgram.methods
      .initializeCandidate("Nissan", new anchor.BN(2))
      .rpc();

    const [toyotoAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(2).toArrayLike(Buffer, "le", 8), Buffer.from("Toyota")],
      vottingAddress
    );

    const toyotoCandidate = await vottingProgram.account.candidate.fetch(
      toyotoAddress
    );

    console.log(toyotoCandidate);
    expect(toyotoCandidate.candidateVote.toNumber()).toEqual(0);
    const [nissanAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(2).toArrayLike(Buffer, "le", 8), Buffer.from("Nissan")],
      vottingAddress
    );

    const nissanCandidate = await vottingProgram.account.candidate.fetch(
      nissanAddress
    );

    console.log(nissanCandidate);
    expect(nissanCandidate.candidateVote.toNumber()).toEqual(0);
  });

  it("Vote", async () => {
    await vottingProgram.methods.vote("Nissan", new anchor.BN(2)).rpc();

    const [nissanAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(2).toArrayLike(Buffer, "le", 8), Buffer.from("Nissan")],
      vottingAddress
    );

    const nissanCandidate = await vottingProgram.account.candidate.fetch(
      nissanAddress
    );

    console.log(nissanCandidate);
    expect(nissanCandidate.candidateVote.toNumber()).toEqual(1);
  });
});
