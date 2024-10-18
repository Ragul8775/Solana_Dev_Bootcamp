"use client";

import { PublicKey } from "@solana/web3.js";
import {
  useCrudappProgram,
  useCrudappProgramAccount,
} from "./crudapp-data-access";
import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export function CrudappCreate() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { createEntry } = useCrudappProgram();
  const { publicKey } = useWallet();

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const handleSubmit = async () => {
    if (publicKey && isFormValid) {
      await createEntry.mutateAsync({ title, message, owner: publicKey });
      setTitle("");
      setMessage("");
    }
  };

  if (!publicKey) {
    return <p>Connect Your Wallet</p>;
  }
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <textarea
          placeholder="Enter your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea textarea-bordered w-full max-w-xs"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
        className="btn btn-xs lg:btn-md btn-primary"
      >
        Submit
      </button>
    </div>
  );
}

export function CrudappList({ account }: { account: PublicKey }) {
  const { accountQuery, updateEntry, deleteEntry } = useCrudappProgramAccount({
    account,
  });

  const { publicKey } = useWallet();
  const [message, setMessage] = useState("");
  const title = accountQuery.data?.title!;

  const isFormValid = message.trim() !== "";

  const handleUpdate = async () => {
    if (publicKey && isFormValid) {
      await updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };
  const handleDelete = async () => {
    if (title) {
      await deleteEntry.mutateAsync(title);
    }
  };

  if (!publicKey) {
    return <p>Connect Your Wallet</p>;
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="card card-border border-base-30 border-4 text-neutral-content">
      <div className="card-body items0center text-center">
        <div className="space-y-6" />
        <h2
          className="card-title justify-center text-3xl cursor-pointer"
          onClick={() => accountQuery.refetch()}
        >
          {accountQuery.data?.title}
        </h2>
        <p className="">{accountQuery.data?.message}</p>
      </div>
      <div className="card-actions justify-around">
        <textarea
          placeholder="Update your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea textarea-bordered w-full max-w-xs"
        />
        <button
          onClick={handleUpdate}
          disabled={updateEntry.isPending || !isFormValid}
          className="btn btn-xs lg:btn-md btn-primary"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteEntry.isPending || !isFormValid}
          className="btn btn-xs lg:btn-md btn-primary"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
