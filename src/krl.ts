import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";
import { KRL, Transfer } from "../generated/KRL/KRL";
import { User } from "../generated/schema";

export function handleTransfer(event: Transfer): void {
  if (event.block.timestamp < BigInt.fromI32(1653004800)) {
    let to = User.load(event.params.to.toHexString());
    if (!to) {
      to = new User(event.params.to.toHexString());
      to.address = event.params.to;
      to.amount = BigInt.fromI32(0);
      to.updatedAt = event.block.timestamp;
    }
    to.amount = to.amount.plus(event.params.value);
    to.updatedAt = event.block.timestamp;
    to.save();

    let from = User.load(event.params.from.toHexString());
    if (from) {
      from.amount = from.amount.minus(event.params.value);
      from.updatedAt = event.block.timestamp;
      from.save();
    }
  }
}
