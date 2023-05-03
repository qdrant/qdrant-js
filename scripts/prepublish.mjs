import restClient from '../packages/js-client-rest/package.json' assert {type: 'json'};
import grpcClient from '../packages/js-client-grpc/package.json' assert {type: 'json'};
import {promisify} from 'node:util';
import {exec} from 'node:child_process';

const execAsync = promisify(exec);

process.on('uncaughtException', (e) => {
    console.log(e);
});
process.on('unhandledRejection', (e, promise) => {
    console.log(String(e), String(promise));
});
// Listen to Ctr + C and exit
process.once('SIGINT', () => {
    process.exit(130);
});

async function main() {
    const restMinorVersion = restClient.version.replace(/^(\d+\.\d+\.)\d+$/, '$10');
    const {stdout: restCheck} = await execAsync(
        `docker pull qdrant/qdrant:v${restMinorVersion} > /dev/null || echo "error"`,
    );
    if (restCheck === 'error') {
        throw new Error(
            'Cannot publish gRPC client.\n' +
                `Could not find a matching version ${restMinorVersion} on the docker registry for (${restClient.version}).`,
        );
    }
    const grpcMinorVersion = grpcClient.version.replace(/^(\d+\.\d+\.)\d+$/, '$10');
    const {stdout: grpcCheck} = await execAsync(
        `docker pull qdrant/qdrant:v${grpcMinorVersion} > /dev/null || echo "error"`,
    );
    if (grpcCheck === 'error') {
        throw new Error(
            'Cannot publish gRPC client.\n' +
                `Could not find a matching version ${grpcMinorVersion} on the docker registry for (${grpcClient.version}).`,
        );
    }
    process.exit();
}

void main();
