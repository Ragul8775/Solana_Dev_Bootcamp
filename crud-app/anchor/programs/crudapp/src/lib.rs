#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod crudapp {
    use anchor_lang::solana_program::message;

    use super::*;

    pub fn create_journal_entry(ctx:Context<CreateEntry>,title:String, message:String)->Result<()>{
      let journla_entry = &mut ctx.accounts.journal_entry;
      journla_entry.owner = *ctx.accounts.owner.key;
      journla_entry.title = title;
      journla_entry.message = message;       
      Ok(())
    }


}
#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateEntry<'info>{
#[account(
  init,
seeds = [title.as_bytes(),owner.key().as_ref()],
bump,
space = 8+JournalEntryState::INIT_SPACE,
payer = owner,
)]
pub journal_entry: Account<'info,JournalEntryState>,
#[account(mut)]
pub owner : Signer<'info>,
pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
  pub owner: Pubkey,
  #[max_len(50)]
  pub title: String,
  #[max_len(1000)]
  pub message: String,
}
