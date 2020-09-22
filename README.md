# up8-ticket

Securely generate [UP8][up8p]-compatible, `@q`-encoded master tickets.  Split
and combine tickets via a k/n Shamir's Secret sharing scheme.

## Install

Grab it from npm like so:

```
npm install up8-ticket
```

To include in your node project, use:

``` javascript
const up8 = require('up8-ticket')
```

To use in the browser, you can use e.g. [rollup][roll] and the
[rollup-plugin-node-resolve][rpnr] plugin, and specify the following in your
`rollup.config.js` or similar:

``` javascript
plugins: [
  ..,
  resolve({
    browser: true,
  }),
  ..
]
```

## Examples

Boot a node repl with async/await support and require the library like so:

```
$ node --experimental-repl-await
Welcome to Node.js v12.18.3.
Type ".help" for more information.
> const up8 = require('up8-ticket')
```

### gen\_ticket\_simple

Generate a 256-bit master ticket via a simple CSPRNG:

```
> up8.gen_ticket_simple(256)
'~mactug-digbyn-malnyr-tobset-solfyr-dozner-dolpen-barsum-locfur-pagduc-danseb-timlug-savwyn-latmug-disdyr-laddeg'
```

You can add your own entropy (generated elsewhere) by passing it in the second
argument as a Buffer.  It will simply be XOR'd with the random bytes produced
internally:

```
> up8.gen_ticket_simple(256, Buffer.from("a very very random string"))
'~donryd-mallur-wanrex-fidrex-nidwyt-dildul-padryd-talfen-panneb-nocbep-norwep-mispel-ralryc-fiddun-tomsup-toltex'
```

### gen\_ticket\_more

Do the same thing, but use [more-entropy][ment] to generate the ticket using
additional entropy.  Note that it returns a Promise (and takes a little
longer):

```
> await up8.gen_ticket_more(256)
'~morten-davnys-ronpes-hidtyd-pittev-donsug-fonpel-sornet-wacmeb-harbyl-monduc-linmur-racled-namdec-tildul-palmyn'
```

You can similarly pass your own entropy in as an additional Buffer here:

```
> let ticket = await up8.gen_ticket_more(256, Buffer.from('muh entropy'))
'~rivmer-ticnyd-mirfet-rolbyt-tarlus-ricrun-fitmec-losrul-barhep-misfet-pidfen-foshep-ronrem-natlyx-tarlet-sipdeb'
```

### shard

Split a ticket into 'shards' using a k/n Shamir's Secret Sharing scheme.
Specify the number of shards to create and the number of shards required to
reassemble the original ticket along with the ticket itself:

```
> let ticket = await up8.gen_ticket_more(384)
> let shards = up8.shard(ticket, 3, 2)
> shards
[
  '~fidnec-topmud-pansul-lacbex-pinlet-finset-sonnyl-dovlud-sibdys-firtyd-walbep-ronlex-harmul-ligmeg-firryg-pidruc-masnup-havlud-tiplup-filrys-walsul-wicrum-narsem-mopdux-hilnev-raglun-doztep-picwes-dotten-micnyr-difwyt-donlys-lorref',
  '~fidbud-rabtel-hapwyn-sander-napwyl-hosnys-savrud-hobsyl-silmev-lonfen-darlup-sopper-mitled-radpeg-diswen-laslun-toglud-sonsun-fopfex-docwyd-botneb-tilfur-rovhes-nollep-hatwer-nimpun-ladmel-borpun-bollep-finluc-noprun-hopmun-dovnul',
  '~fidwes-witdur-nilbet-dolmug-pitpen-bacpyx-talrut-hanren-soltul-micdev-havneb-mildef-dilnec-bosdes-todsud-dopnex-rittyc-taplur-labrux-mogmun-togpeg-lagnel-tonweb-pidtyd-sablyn-sibsyx-linfex-lapteg-nolber-dovwel-nibteg-molsyd-macpec'
]
```

### combine

Combine shards created via `shard`.  Pass in at least the required number of
shards as an array, with elements in any order:

```
> up8.combine(shards.slice(0, 2)) === ticket
true
> up8.combine(shards.slice(1, 3)) === ticket
true
> up8.combine([shards[0], shards[2]]) === ticket
true
> up8.combine(shards) === ticket
true
```

[wgen]: https://github.com/urbit/urbit-wallet-generator
[up8p]: https://github.com/urbit/proposals/blob/master/008-urbit-hd-wallet.md
[roll]: https://rollupjs.org/guide/en
[rpnr]: https://github.com/rollup/rollup-plugin-node-resolve
[ment]: https://www.npmjs.com/package/more-entropy
