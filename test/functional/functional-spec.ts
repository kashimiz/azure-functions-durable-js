import { expect } from "chai";
import * as debug from "debug";
import "mocha";
import * as path from "path";
import { FunctionHostHarness } from "../util/functionhostharness";
import { ProcessHelper } from "../util/processhelper";

const log = debug("durable-functions:functional-spec");
const sampleRoot = path.resolve(__dirname, "../../../test/functional/sample/");

describe("Functional Tests", () => {
    describe("host", () => {
        let host: FunctionHostHarness;

        before(async function() {
            this.timeout(60000);
            await ProcessHelper.killAllFunctionsHosts();
            host = new FunctionHostHarness(sampleRoot);
            await host.init();
            return new Promise((resolve, reject) => {
                const int = setInterval(() => {
                    host.test("ping")
                        .then((res: any) => {
                            log(JSON.stringify(res));
                            if (res.status === 200) {
                                clearTimeout(int);
                                resolve();
                            }
                        }).catch((e) => log(e));
                }, 500);
            });
        });

        after(async function() {
            this.timeout(60000);
            host.stop();
            await ProcessHelper.killAllFunctionsHosts();
            return Promise.resolve();
        });

        it("should complete a simple orchestration function (no activity functions)", (done) => {
            const res = host.testOrchestrator("SayHelloInline");
            done();
        });
    });
});
