import { Message } from "./Message";
import { MessageDTO } from "../../infrastructure/transaction/Message";

export class HexMessage extends Message {

  /**
   * @internal
   * @param payload 
   */
  constructor(payload: string) {
    super(payload);
  }

  /**
   * Create new constructor
   * @param message 
   */
  public static create(message: string) {
    let msg = "fe" + message;
    return new HexMessage(msg);
  }

  public isEncrypted(): boolean {
    return false;
  }

  public isPlain(): boolean {
    return true;
  }

  /**
   * @internal
   */
  public toDTO(): MessageDTO {
    return {
      payload: this.payload,
      type: 1,
    } as MessageDTO;
  }
}