/** ---------------------------------------------------------------------------
 * @module [BrdEdr]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20240106
 * ----------------------------------------------------------------------------
 */

import {
    BrdEdr_Microservice,
    Edr,
} from "../deps.ts";


interface BrdEdr_ITest {
    name: string,
    param: number
};


const BrdEdr_Tests: BrdEdr_ITest[] = [
    { name: 'First', param: 1 },
    { name: 'Second', param: 2 }
];



/**
 * Route per testare la classe base Edr.BrdEdr_Base_RestResource
 */
export class BrdEdr_Test_RestResource extends Edr.BrdEdr_Base_RestResource {


    static readonly ROUTE: "/Brd/Edr/Test";

    public paths = [BrdEdr_Test_RestResource.ROUTE];


    public GET(
        request: Edr.Drash.Request,
        response: Edr.Drash.Response
    ) {

        const r = this.begin(BrdEdr_Microservice.name, request);

        const mode = this.GET_mode(request);

        if (this.GET_isHelpMode(mode,  r, response))
            return;

        const rawTestName = request.queryParam(BrdEdr_Test_RestResource.GET_QSP_TEST_NAME);

        if (this.GET_testNameIsMissing(rawTestName,  r, response))
            return;

        const names: string[] = [];
        for (const test of BrdEdr_Tests) {
            names.push(encodeURIComponent(test.name));
        }
        const testName = rawTestName!;
        const testIndex = BrdEdr_Tests.findIndex((v) => v.name == testName);

        if (this.GET_testWasNotFound(testIndex, testName, names, r, response))
            return;

        const params = BrdEdr_Tests[testIndex];

        if (this.GET_isParamsMode(mode, testName, params, r, response))
            return;

        r.payload = this.#processRequest(params);
        this.end(r, response);
    }




    public POST(
        request: Edr.Drash.Request,
        response: Edr.Drash.Response
    ) {

        const r = this.begin(BrdEdr_Microservice.name, request);

        const rawParams = request.bodyParam(BrdEdr_Test_RestResource.POST_BP_PARAMS);

        if (this.POST_paramsAreMissing(rawParams, BrdEdr_Test_RestResource.POST_BP_PARAMS, 'BrdEdr_ITest', r, response))
            return;

        const params = rawParams as BrdEdr_ITest;

        r.payload = this.#processRequest(params);

        this.end(r, response);
    }




    #processRequest(aparams: BrdEdr_ITest) {
        return `Result: ${aparams.param.toString()}`
    }



    routeHelp() {
        const r = super.routeHelp();

        r.route = BrdEdr_Test_RestResource.ROUTE;
        r.description = [
            "Route to test the base class Edr.BrdEdr_Base_RestResource"
        ]
        r.payload.type = "string";
        r.payload.description.push(
            "A simple message from the test"
        )
        
        r.GET!.qsParams[1].values.push(
            "Refer to the [BrdEdr_Tests] list."
        )

        r.POST!.bodyParams[0].type = "BrdEdr_ITest";
        r.POST!.bodyParams[0].description.push(
            "A simple data structure to be used for the test"
        )

        return r;
    }





}


