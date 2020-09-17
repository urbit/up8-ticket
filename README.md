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

If you're paranoid, you can use the `gen_custom` function to supply an
additional custom buffer that will be XOR'd in with the generated entropy:

```
> let paranoia = await tg.gen(384, Buffer.from("a very random string"))
> paranoia
'~dolhes-parmes-tagnev-fablug-pagwyn-dopwel-ripnys-hardut-batnym-ridreb-finmec-mistes-figweg-labled-tocbet-bidryt-wolpub-filtev-tappeg-fassyt-tonred-savruc-lisred-tidlec'
```

[wgen]: https://github.com/urbit/urbit-wallet-generator
