import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/emit_logs.tact',
    options: {
        debug: true,
    },
};
