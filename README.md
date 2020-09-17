# master-ticket-generator

Generate `@q` master tickets in exactly the same way
[urbit-wallet-generator][wgen] does.

## but how

Clone the repository, `npm install` to grab the dependencies, and then:

```
$ node --experimental-repl-await
> const tg = require('./src')
> let ticket = await tg.gen(384) // supply desired number of bits
> ticket
'~wisbyl-tarfes-biltug-datmyr-rigsyp-ribryc-nocmyr-bilres-mipset-patsut-todbur-foptev-lorfer-famtux-loppes-mismug-tobdyl-hopnes-lophul-tapdus-habtuc-ragseg-dossev-ramneb'
```

[wgen]: https://github.com/urbit/urbit-wallet-generator
