use anchor_lang::prelude::*;

declare_id!("Bw7pZ8KiGkRY9dDvmCNyeLGtfs4hQwJmBQVUTm5dTcaM");

pub const ANCHOR_DISCRIMINATOR_SIZE :usize = 8;

#[program]
pub mod favourites {
    use super::*;

    pub fn set_favorites(context : Context<SetFavourites>,
        number:u64,
        color:String,
        hobbies:Vec<String>)-> Result<()>
        {
  let user_public_key = context.program_id;
  msg!("Greeting from {}", user_public_key);

  msg!("User {user_public_key}'s favourite number is {number}, favourite color is {color}");
       

       context.accounts.favourites.set_inner(Favourites{
        number,
        color,
        hobbies,
       });
       Ok(())
    }

  
}

#[account]
#[derive(InitSpace)]
pub struct Favourites {
    pub number : u64,

    #[max_len(50)]
    pub color:String,

    #[max_len(5,50)]
    pub hobbies: Vec<String>,
}


#[derive(Accounts)]
pub struct SetFavourites<'info>{

    #[account(mut)]
    pub user : Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favourites::INIT_SPACE,
        seeds = [b"favourites", user.key().as_ref()],
        bump
    )]
    pub favourites: Account<'info, Favourites>,
    pub system_program : Program<'info, System>
}