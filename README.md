# Lobby Lobsters

## Overview

The goal of this system is to create 10,000 programatically generated Lobby Lobsters NFTs. The idea for them is to accumulate revenue and all of it will be donated to having better crypto regulations in our world.
Lobby Lobsters want to see policy efforts empower the community. 100% of primary sales will be donated to policy and lobby efforts. Secondary sales will be donated to groups focused on growing the Ethereum ecosystem.

## Genome

The genome - the combination of the different traits of a lobby lobsters are called genome. The genome is represented by a uint256. Each four decimal places (apart from the last one) represent a single gene. This enables for 10000 different options for each attribute. All of the traits for a single attribute add to 10000. However some traits are more rare(have smaller range of numbers in which they will be dropped) than other traits.
Randomization of the genome is based on generating a hash. The seed for this hash includes network and user specific parameters:

- msg.sender - address creating the NFT
- tx.origin - originator of the transaction (will frequently be the same as msg.sender)
- gasleft() - how much gas is left in this transaction. Tricky to control for an attacker as minor variances of gas costs of operations will always happen and will lead to massively unpredictable results.
- g.lastRandom - the last random number generated
- block.timestamp - the current block timestamp
- block.number - the current block number
- blockhash(block.number) - the hash of the current block
- blockhash(block.number-100) - the hash of the block 100 blocks ago.

Theoretically it is possible for a miner to have a slightly bigger chance in generating a morph of his liking compared to a regular user. This risk, however is negligible for both economical and behavioral reasons. On one hand, the miner will likely be risking a significant block reward and the price of Lobby Lobster needs to be sky high in order to make it worth the hassle. On the other hand, lobby lobsters desirability and affinity is a very subjective matter - meaning that if they are going to like or dislike the new morph will depend on the person operating the mining node.

## Gene positions:

- 0 - Background attribute
- 1 - Skin attribute
- 2 - Clothes attribute
- 3 - Hands attribute
- 4 - Head attribute
- 5 - Mouth attribute
- 6 - Eyes attribute

# Contracts

## ERC721PresetMinterPauserAutoId

Standard OZ one with changed visibility modifier for the token counter

## Lobster

The main contract acting as an ERC721 but also carrying the minting logic.

## LobsterGeneGenerator

The library used for randomness generation.
