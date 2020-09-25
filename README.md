# up8-ticket

[![Build Status](https://secure.travis-ci.org/urbit/up8-ticket.png)](http://travis-ci.org/urbit/up8-ticket)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/up8-ticket.svg)](https://www.npmjs.com/package/up8-ticket)

Securely generate [UP8][up8p]-compatible, `@q`-encoded master tickets.  Split
and combine tickets via a k/n Shamir's Secret Sharing scheme.

If you plan on generating a master ticket for a galaxy wallet, for example, you
might want to use `gen_ticket_drbg(384)` to generate the ticket, and then
`shard(.., 5, 3)` to split it into five shares (any three of which can be used
to recover it).

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

Generate a 256-bit master ticket via a simple CSPRNG (`crypto` or
`window.crypto`):

```
> up8.gen_ticket_simple(256)
'~mactug-digbyn-malnyr-tobset-solfyr-dozner-dolpen-barsum-locfur-pagduc-danseb-timlug-savwyn-latmug-disdyr-laddeg'
```

You can add your own entropy (generated elsewhere) by passing it in the second
argument as a Buffer.  It will simply be XOR'd with the random bytes produced
internally:

```
> up8.gen_ticket_simple(256, Buffer.from("a very random string"))
'~donryd-mallur-wanrex-fidrex-nidwyt-dildul-padryd-talfen-panneb-nocbep-norwep-mispel-ralryc-fiddun-tomsup-toltex'
```

### gen\_ticket\_more

Do the same thing, but also use [more-entropy][ment] to produce additional
entropy when generating the ticket.  Note that it returns a Promise (and takes
a little longer):

```
> await up8.gen_ticket_more(256)
'~morten-davnys-ronpes-hidtyd-pittev-donsug-fonpel-sornet-wacmeb-harbyl-monduc-linmur-racled-namdec-tildul-palmyn'
```

You can similarly pass your own entropy in as an additional Buffer here:

```
> let ticket = await up8.gen_ticket_more(256, Buffer.from('muh entropy'))
'~rivmer-ticnyd-mirfet-rolbyt-tarlus-ricrun-fitmec-losrul-barhep-misfet-pidfen-foshep-ronrem-natlyx-tarlet-sipdeb'
```

### gen\_ticket\_drbg

Do the same thing, but use a HMAC-DRBG function to combine the entropy produced
by the underlying CSPRNG and more-entropy.  Like `gen_ticket_more`, it returns
a Promise, and takes longer.

Note that you must use at least 192 bits of entropy for this method.

```
> await up8.gen_ticket_drbg(256)
'~morten-davnys-ronpes-hidtyd-pittev-donsug-fonpel-sornet-wacmeb-harbyl-monduc-linmur-racled-namdec-tildul-palmyn'
```

As with the other functions, you can pass your own entropy in as an additional
Buffer:

```
> let ticket = await up8.gen_ticket_drbg(384, Buffer.from('a personalization string'))
'~siller-hopryc-ripfyn-laglec-linpur-mogpun-poldux-bicmul-radnum-dapnup-monnub-dilwex-pacrym-samrup-ragryc-samdyt-timdys-hartul-lonrun-posmev-molrum-miclur-doznus-fasnut'
```

### shard

Split a ticket into 'shards' using a k/n Shamir's Secret Sharing scheme.
Specify the number of shards to create and the number of shards required to
reassemble the original ticket, along with the ticket itself:

```
> let ticket = await up8.gen_ticket_drbg(384)
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
