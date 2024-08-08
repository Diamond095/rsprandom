import { beginCell, toNano, Address, Cell } from '@ton/core';
import { TonConnectUI } from '@tonconnect/ui-react';

export const sendJetton = async (token: string, amount: number, myWallet: string, tonConnectUIInstance: any) => {
    let body;
    if (token == 'random') {
        body = beginCell()
            .storeUint(0xf8a7ea5, 32)                 // jetton transfer op code
            .storeUint(0, 64)                         // query_id:uint64
            .storeCoins(toNano(amount))               // amount:(VarUInteger 16)
            .storeAddress(Address.parse('UQCgqOKk_ETWsB8Pz3AfMbkLgkiBOJwC7uDRdrH72ZCQrHyN')) // destination:MsgAddress
            .storeAddress(Address.parse('UQCgqOKk_ETWsB8Pz3AfMbkLgkiBOJwC7uDRdrH72ZCQrHyN'))    // response_destination:MsgAddress
            .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)
            .storeCoins(toNano(0))                    // forward_ton_amount:(VarUInteger 16)
            .storeUint(0, 1)                          // forward_payload:(Either Cell ^Cell)
            .endCell();
    }
    const myTransaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: body ? [
            {
                address: myWallet, // sender jetton wallet
                amount: toNano(0.045).toString(), // for commission fees, excess will be returned
                payload: body.toBoc().toString("base64") // payload with jetton transfer body
            }
        ] : [{
                address: 'UQCgqOKk_ETWsB8Pz3AfMbkLgkiBOJwC7uDRdrH72ZCQrHyN',
                amount: toNano(amount).toString()
            }]
    }
    const { boc } = await tonConnectUIInstance.sendTransaction(myTransaction);
    const inMsgCell = Cell.fromBase64(boc);
    const inMsgHash = inMsgCell.hash();
    const inMsgHashBase64 = inMsgHash.toString('hex');
    return inMsgHashBase64;
};
