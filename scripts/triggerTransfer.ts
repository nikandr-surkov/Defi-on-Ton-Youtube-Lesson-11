import { Address, toNano } from '@ton/core';
import { EmitLogs } from '../wrappers/EmitLogs';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const emitLogs = provider.open(await EmitLogs.fromAddress(Address.parse("EQAcClNwCFRPTSRgfLLhZbRii0bepV_zpWZ4JTYI3ruKVUKX")));

    await emitLogs.send(
        provider.sender(),
        {
            value: toNano('1.5'),  // Adjust value if necessary
        },
        'transfer'
    );

    console.log('Transfer message sent');
}
