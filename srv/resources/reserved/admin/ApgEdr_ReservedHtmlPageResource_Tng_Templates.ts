/** ---------------------------------------------------------------------------
 * @module [ApgEdr/srv]
 * @author [APG] Angeli Paolo Giusto
 * @version 1.0 APG 20240708
 * @version 1.1 APG 20240731 ApgEdr_Service.GetTemplateData
 * ----------------------------------------------------------------------------
 */

import {
    Edr
} from "../../../deps.ts";



export class ApgEdr_ReservedHtmlPageResource_Tng_Templates extends Edr.Drash.Resource {

    override paths = [Edr.ApgEdr_Route_eShared.RESERVED_PAGE_TNG_TEMPLATES];

    readonly EDR_ROLE = Edr.ApgEdr_Auth_eRole.ADMIN;

    async GET(
        request: Edr.Drash.Request,
        response: Edr.Drash.Response
    ) {

        const edr = Edr.ApgEdr_Service.GetEdrRequest(request);
        if (!Edr.ApgEdr_Service.VerifyProtectedPage(edr, this.EDR_ROLE)) {
            this.redirect(Edr.ApgEdr_Route_eShared.PAGE_LOGIN, response);
            return;
        }


        const pagesDir = Edr.ApgEdr_Service.LocalTemplatesPath;

        const data = await this.#getFilesRecursively(pagesDir);

        const templateData = Edr.ApgEdr_Service.GetTemplateData(
            edr,
            'Tng templates',
            "/pages/reserved/admin/ApgEdr_ReservedHtmlPageTemplate_Tng_Templates.html",
        )

        templateData.page.data = data;

        await Edr.ApgEdr_Service.RenderPageUsingTng(request, response, templateData, {
            isCdnResource: true
        });
    }



    async #getFilesRecursively(
        afolder: string,
        aroot = ""
    ) {

        const data: {
            url: string;
        }[] = [];

        const rootRoute = Edr.ApgEdr_Route_eShared.FILE_ANY_TEMPLATE.replace("/*", "");
        let rootDir = aroot
        if (rootDir == "") { 
            rootDir = afolder
        }

        for await (const dirEntry of Deno.readDir(afolder)) {

            if (dirEntry.isDirectory) { 
                const subfolder = `${afolder}/${dirEntry.name}`
                data.push(...await this.#getFilesRecursively(subfolder, rootDir));
            }

            else {
                const ext = dirEntry.name.split('.').pop();
                if (ext == 'html') {
    
                    const rawPath = `${afolder}/${dirEntry.name}`;
                    const filePath = rawPath.replace(rootDir, "")
                    data.push({
                        url: rootRoute + filePath,
                    });
    
                }
            }
        }
        return data;
    }
}
