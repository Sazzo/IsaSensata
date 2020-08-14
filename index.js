require('dotenv').config()
const twitter = require('twitter-lite')

const client = new twitter({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token_key: process.env.access_token,
    access_token_secret: process.env.access_token_secret
})

const decisions = [
    { decision: 'Sim', pct: 55000, arr: '55%'},
    { decision: 'Não', pct: 40000, arr: '40%'},
    { decision: 'Definitivamente sim', pct: 13000, arr:'13%'},
    { decision: 'Definitivamente não', pct: 10000, arr:'10%'},
    { decision: 'Talvez', pct: 9000, arr:'9%'}
]

const stream = client.stream('statuses/filter', { follow: '1103618173927071744'})
stream.on('data', async (tweet) => {
   if(tweet.delete) return console.log('É um tweet deletado, retornando...')
   if(tweet.user.id_str == '1103618173927071744') {
       if(tweet.in_reply_to_status_id_str == null) {
           if(!tweet.is_quote_status || tweet.is_quote_status == null) {
               if(!tweet.text.startsWith('RT')) {
                    const expanded = decisions.flatMap(deci => Array(deci.pct).fill(deci));
                    const winner = expanded[Math.floor(Math.random() * expanded.length)];
                    const reply = await client.post('statuses/update', { in_reply_to_status_id: tweet.id_str, status: `Isa foi sensata nesse tweet? ${winner.decision} (Porcentagem da decisão: ${winner.arr})`, auto_populate_reply_metadata: true})
                    console.log('É um tweet valido! Respondido com successo.')
               } else {
                   console.log(`É um RT da Isatoro! | Texto: ${tweet.text}`)
               }
           } else {
               console.log("Não é um tweet valido da Isatoro.")
           }
       } else {
            console.log(`É uma resposta! | Para: ${tweet.in_reply_to_screen_name}`)
       }
   } else {
       console.log(`Não é! | User: ${tweet.user.name} | ScreenName: ${tweet.user.screen_name} | Mensagem: ${tweet.text}`)
   }
})
