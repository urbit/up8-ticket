const { expect } = require('chai')
const jsc = require('jsverify')
const ob = require('urbit-ob')

const mtg = require('../src')

// mocha, jsverify stuff

// needs to be required explicitly
global.crypto = require('crypto')

const ticket_bytes = jsc.elements([8, 16, 24, 32, 40, 48, 56, 64])

// tests

describe('gen_ticket_simple', () => {
  context("when no additional entropy provided", () => {
    it('produces tickets of the correct bitlength', () => {
      let prop = jsc.forall(ticket_bytes, bytes => {
        let bits = bytes * 8
        let ticket = mtg.gen_ticket_simple(bits)
        let hex = ob.patq2hex(ticket)
        let nbits = hex.length * 4
        return (bits === nbits)
      })

      jsc.assert(prop)
    })
  })

  context("when additional entropy provided", () => {
    it('produces tickets of the correct bitlength', () => {
      let prop = jsc.forall(ticket_bytes, bytes => {
        let bits = bytes * 8
        let addl = Buffer.from("look at all this entropy")
        let ticket = mtg.gen_ticket_simple(bits, addl)
        let hex = ob.patq2hex(ticket)
        let nbits = hex.length * 4
        return (bits === nbits)
      })

      jsc.assert(prop)
    })
  })

})

describe('gen_ticket_more', () => {

  context("when no additional entropy provided", () => {
    it('produces tickets of the correct bitlength', async () => {
      let given_bits = 384
      let ticket = await mtg.gen_ticket_more(given_bits)
      let hex = ob.patq2hex(ticket)
      let expected_bits = hex.length * 4
      expect(expected_bits).to.equal(given_bits)
    })
  })

  context("when additional entropy provided", () => {
    it('produces tickets of the correct bitlength', async () => {
      let given_bits = 384
      let addl = Buffer.from("you'll never predict this")
      let ticket = await mtg.gen_ticket_more(given_bits, addl)
      let hex = ob.patq2hex(ticket)
      let expected_bits = hex.length * 4
      expect(expected_bits).to.equal(given_bits)
    })
  })

})

describe('shard', () => {

  it('throws on non-@q input', () => {
    expect(() => mtg.shard('flubblub', 3, 2)).to.throw()
  })

  it("using 3/2 sharding, produces shards that are recombinable", () => {
    let prop = jsc.forall(ticket_bytes, bytes => {
      let bits      = bytes * 8
      let ticket    = mtg.gen_ticket_simple(bits)
      let shards    = mtg.shard(ticket, 3, 2)
      let combined0 = mtg.combine(shards.slice(0, 2))
      let combined1 = mtg.combine(shards.slice(1, 3))
      let combined2 = mtg.combine([shards[0], shards[2]])
      let combined3 = mtg.combine(shards)

      return (
        (ticket === combined0) &&
        (ticket === combined1) &&
        (ticket === combined2) &&
        (ticket === combined3)
      )
    })

    jsc.assert(prop)
  })

  it("using 5/3 sharding, produces shards that are recombinable", () => {
    let prop = jsc.forall(ticket_bytes, bytes => {
      let bits      = bytes * 8
      let ticket    = mtg.gen_ticket_simple(bits)
      let shards    = mtg.shard(ticket, 5, 3)

      let combined0 = mtg.combine([shards[0], shards[1], shards[2]])
      let combined1 = mtg.combine([shards[0], shards[1], shards[3]])
      let combined2 = mtg.combine([shards[0], shards[1], shards[4]])

      let combined3 = mtg.combine([shards[0], shards[2], shards[3]])
      let combined4 = mtg.combine([shards[0], shards[2], shards[4]])

      let combined5 = mtg.combine([shards[1], shards[2], shards[3]])
      let combined6 = mtg.combine([shards[1], shards[2], shards[4]])

      let combined7 = mtg.combine([shards[2], shards[3], shards[4]])

      let combined8 = mtg.combine(shards)

      return (
        (ticket === combined0) &&
        (ticket === combined1) &&
        (ticket === combined2) &&
        (ticket === combined3) &&
        (ticket === combined4) &&
        (ticket === combined5) &&
        (ticket === combined6) &&
        (ticket === combined7) &&
        (ticket === combined8)
      )
    })

    jsc.assert(prop)
  })

})


