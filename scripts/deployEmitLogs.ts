import { toNano } from '@ton/core';
import { EmitLogs } from '../wrappers/EmitLogs';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const emitLogs = provider.open(await EmitLogs.fromInit());

    await emitLogs.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(emitLogs.address);

    // run methods on `emitLogs`
}
