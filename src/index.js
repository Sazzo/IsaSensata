require('dotenv').config()
const twitter = require('twitter-lite')

const client = new twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

// Gambiarra que mal funciona.

const decisions = [
    { decision: '‎‎‎‎‎Sim‎', pct: 550000, arr: '55%'},
    { decision: '‎Não‎', pct: 590000, arr: '59%'},
    { decision: '‎Definitivamente sim‎', pct: 250000, arr:'25%'},
    { decision: '‎Definitivamente não‎', pct: 230000, arr:'23%'},
    { decision: 'Talvez', pct: 150000, arr:'15%'}
]

const stream = client.stream('statuses/filter', { follow: process.env.USERID})
stream.on('data', async (tweet) => {
   if(tweet.delete) return console.log('É um tweet deletado, retornando...')
   if(tweet.user.id_str == process.env.USERID) {
       if(tweet.in_reply_to_status_id_str == null) {
           if(!tweet.is_quote_status || tweet.is_quote_status == null) {
               if(!tweet.text.startsWith('RT')) {
                    const expanded = decisions.flatMap(deci => Array(deci.pct).fill(deci));
                    const winner = expanded[Math.floor(Math.random() * expanded.length)];
                    await client.post('statuses/update', { in_reply_to_status_id: tweet.id_str, status: `Isa foi sensata nesse tweet? ${winner.decision}`, auto_populate_reply_metadata: true})
                    console.log('É um tweet valido! Respondido com successo.')
               }
           }
       }
   }
})

console.log("Bot foi iniciado!")
