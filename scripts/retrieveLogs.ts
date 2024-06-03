import { getHttpEndpoint } from "@orbs-network/ton-access";
import { Address } from "ton/dist/address/Address";
import { TonClient } from "ton";
import { StakeEvent, TransferEvent, loadStakeEvent, loadTransferEvent } from "../wrappers/EmitLogs";
import { Cell } from "@ton/core";

// Define the emitted message formats
type EmitLogEvent = {
    type: 'ActionHandled' | 'TransferEvent' | 'StakeEvent';
    data: any;
};

// Function to decode the TransferEvent from a cell
function decodeTransferEvent(cell: Cell): TransferEvent {
    const slice = cell.beginParse();
    return loadTransferEvent(slice);
}

// Function to decode the StakeEvent from a cell
function decodeStakeEvent(cell: Cell): StakeEvent {
    const slice = cell.beginParse();
    return loadStakeEvent(slice);
}

function getEventType(cell: Cell): 'TransferEvent' | 'StakeEvent' | 'Comment' | 'Unknown' {
    const slice = cell.beginParse();
    const header = slice.loadUint(32);
    if (header === 772744475) {
        return 'TransferEvent';
    } else if (header === 2917934626) {
        return 'StakeEvent';
    } else if (header === 0) {
        return 'Comment';
    } else {
        return 'Unknown';
    }
}

export async function run() {
    const endpoint = await getHttpEndpoint({
        network: "testnet",
    });

    const client = new TonClient({ endpoint });
    const transactions = await client.getTransactions(Address.parse("EQAcClNwCFRPTSRgfLLhZbRii0bepV_zpWZ4JTYI3ruKVUKX"), { limit: 10 });

    const logs: EmitLogEvent[] = [];

    for (const tx of transactions) {
        if (tx?.outMessages && tx?.outMessages.length > 0) {
            if (tx?.outMessages[0].body?.type === 'data') {
                const bodyBuffer = Buffer.from(tx.outMessages[0].body.data);
                const bodyCell = Cell.fromBoc(bodyBuffer)[0];

                const eventType = getEventType(bodyCell);

                if (eventType === 'TransferEvent') {
                    const decodedTransfer = decodeTransferEvent(bodyCell);
                    logs.push({ type: 'TransferEvent', data: decodedTransfer });
                } else if (eventType === 'StakeEvent') {
                    const decodedStake = decodeStakeEvent(bodyCell);
                    logs.push({ type: 'StakeEvent', data: decodedStake });
                }
            } else if (tx?.outMessages[0].body?.type === 'text') {
                const comment = tx.outMessages[0].body.text;
                if (comment === 'Action handled') {
                    logs.push({ type: 'ActionHandled', data: {} });
                }
            }
        }
    }

    console.log('Logs data', logs);
}
