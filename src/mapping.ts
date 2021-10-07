import {
  Approval,
  ApprovalForAll,
  DeveloperDaoNFT,
  OwnershipTransferred,
  Transfer,
} from "../generated/DeveloperDaoNFT/DeveloperDaoNFT"
import { Developer, Owner } from "../generated/schema"

import { BigInt } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
  const contract = DeveloperDaoNFT.bind(event.address)
  const id: string = event.params.tokenId.toString()
  let token = Developer.load(id)
  const wallet = event.params.to.toHexString()

  let owner =  Owner.load(wallet);
  if (owner == null) {
    owner = new Owner(wallet)
    owner.save()
  }
  if(token == null) {
    token = new Developer(event.params.tokenId.toString())
    token.createdAt = event.block.timestamp
    token.owner = owner.id
    token.transfersCount = BigInt.fromI32(1)
    token.os = contract.getOS(event.params.tokenId)
    token.textEditor = contract.getTextEditor(event.params.tokenId)
    token.clothes = contract.getClothing(event.params.tokenId)
    token.language = contract.getLanguage(event.params.tokenId)
    token.industry = contract.getIndustry(event.params.tokenId)
    token.location = contract.getLocation(event.params.tokenId)
    token.mind = contract.getMind(event.params.tokenId)
    token.vibe = contract.getVibe(event.params.tokenId)
    token.uri = contract.tokenURI(event.params.tokenId)
  } else {
    token.transfersCount.plus(BigInt.fromI32(1))
    token.owner = owner.id
  }
  token.save()
}
