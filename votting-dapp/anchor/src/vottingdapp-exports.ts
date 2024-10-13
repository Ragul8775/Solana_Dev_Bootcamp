// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VottingdappIDL from '../target/idl/vottingdapp.json'
import type { Vottingdapp } from '../target/types/vottingdapp'

// Re-export the generated IDL and type
export { Vottingdapp, VottingdappIDL }

// The programId is imported from the program IDL.
export const VOTTINGDAPP_PROGRAM_ID = new PublicKey(VottingdappIDL.address)

// This is a helper function to get the Vottingdapp Anchor program.
export function getVottingdappProgram(provider: AnchorProvider) {
  return new Program(VottingdappIDL as Vottingdapp, provider)
}

// This is a helper function to get the program ID for the Vottingdapp program depending on the cluster.
export function getVottingdappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Vottingdapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return VOTTINGDAPP_PROGRAM_ID
  }
}
