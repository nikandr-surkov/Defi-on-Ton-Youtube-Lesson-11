import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { EmitLogs } from '../wrappers/EmitLogs';
import '@ton/test-utils';

describe('EmitLogs', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let emitLogs: SandboxContract<EmitLogs>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        emitLogs = blockchain.openContract(await EmitLogs.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await emitLogs.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: emitLogs.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and emitLogs are ready to use
    });
});
