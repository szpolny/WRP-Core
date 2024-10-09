const { swcDir } = require('@swc/cli');
 
swcDir({
    cliOptions: {
        outDir: './build/client',
        filenames: ['./client'],
        extensions: ['.ts'],
        stripLeadingPaths: true,
    },
    swcOptions: {
        jsc: {
            target: 'es2017',
        },
        module: {
            type: 'commonjs',
        },
    },
    callbacks: {
        onSuccess: (e: Error) => {
            console.log(e);
        },
        onFail: (e: Error) => {
            console.log(e);
        },
        onWatchReady: () => {},
    },
});

swcDir({
    cliOptions: {
        outDir: './build/server',
        filenames: ['./server'],
        extensions: ['.ts'],
        stripLeadingPaths: true,
    },
    swcOptions: {
        jsc: {
            target: 'es2017',
        },
        module: {
            type: 'commonjs',
        },
    },
    callbacks: {
        onSuccess: (e: Error) => {
            console.log(e);
        },
        onFail: (e: Error) => {
            console.log(e);
        },
        onWatchReady: () => {},
    },
});