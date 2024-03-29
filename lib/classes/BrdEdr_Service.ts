/** ---------------------------------------------------------------------------
 * @module [BrdEdr]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20220909 Alpha version
 * @version 0.2 APG 20230416 Moved to its own microservice
 * @version 0.3 APG 20240106 Revamped
 * ----------------------------------------------------------------------------
 */

import { Uts } from "../deps.ts";


/**
 * Servizio che contiene le regole di base per il funzionamento di un server Edr
 */
export class BrdEdr_Service {

    /** In seconds */
    static ClientCacheMaxAge = 0;

    /** Local relative path to */
    static AssetsPath = "./srv";

    private static _missingImage = "/assets/img/missing.png";

    /** Default missing image placeholder*/
    static get MissingImage() {
        return this.AssetsPath + this._missingImage;
    }

    static get IsDenoDeploy() {
        return Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
    }



    static ServerStartupResume(
        amicroservice: Uts.BrdUts_IMicroservice,
        aaddress: string
    ) {
        const start = new Date();
        console.log(`********************************************************************`)
        console.log('');
        console.log(amicroservice.name);
        console.log(amicroservice.description);
        console.log('');
        console.log(`Server started at ${start.toLocaleString()}`);
        console.log(`Running at ${aaddress}.`);
        console.log('');
        console.log(`********************************************************************`)
    }
}