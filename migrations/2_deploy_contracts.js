const fs = require('fs')

const PredicateRegistry = artifacts.require('PredicateRegistry');

const utils = require('../scripts/utils')

module.exports = async function(deployer) {
    await deployer.deploy(PredicateRegistry);

    const OICash = await utils.getOICashContract('main')

    // map OICash token in the plasma registry
    const childOICash = await utils.getOICashContract('matic')
    await utils.artifacts.plasma.Registry.methods.mapToken(
        OICash.options.address,
        childOICash.options.address,
        false /* _isERC721 */
    ).send({ from: utils.from, gas: utils.gas })

    // write addresses to predicate addresses file
    const predicateAddresses = JSON.parse(fs.readFileSync('./output/addresses.predicate.json'))
    predicateAddresses.helpers = { PredicateRegistry: PredicateRegistry.address }
    fs.writeFileSync('./output/addresses.predicate.json', JSON.stringify(predicateAddresses, null, 2))
};