import * as debug from "debug";
import * as request from "supertest";
import { FunctionHost } from "./functionhost";

const log = debug("durable-functions:FunctionHostHarness");

export class FunctionHostHarness {
    private host: FunctionHost;
    private request: request.SuperTest<request.Test>;

    constructor(funcRoot: string) {
        this.host = new FunctionHost(funcRoot);
        this.request = request("http://localhost:7071");

        this.host.on("error", (err: Error) => {
            log(err);
        });

        this.host.on("exit", (code: string) => {
            log(`Functions host exited with status code: ${code}`);
        });
    }

    public test(name: string) {
        return this.request.post(`/${name}`);
    }

    public testOrchestrator(name: string) {
        const res = this.test(`orchestrators/${name}`);

        return res;
        // poll for response, return status response
    }

    public init(): Promise<{}> {
        const req = this.request;
        this.host.start();
        return new Promise((resolve, reject) => {
            const int = setInterval(() => {
                req.get("/admin/host/status")
                    .then((res) => {
                        if (res.status === 200) {
                            clearTimeout(int);
                            resolve();
                        }
                    }).catch((e) => log(e));
            }, 500);
        });
    }

    public stop() {
        this.host.stop();
    }
}
