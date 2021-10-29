import {StringMap} from "../../../parser/src/model/CrashReport";
import {objectMap} from "./Javascript";
import {Require} from "../../../parser/src/util/Utils";

export interface HttpResponse {
    body: string
    code: number
}

function parseParameters(parameters?: StringMap): string {
    if (parameters === undefined) return "";
    if (Object.values(parameters).length === 0) return "";
    else {
        return "?" + objectMap(parameters, (key, value) => `${key}=${value}`).join("&")
    }
}

type SpecificHttpRequest = Omit<HttpRequest, "method">
type HttpGetRequest = Omit<SpecificHttpRequest, "body">
type HttpDeleteRequest = Omit<SpecificHttpRequest, "body">
type HttpPostRequest = Require<SpecificHttpRequest, "body">


export async function httpGet(request: HttpGetRequest): Promise<HttpResponse> {
    return httpCall({...request, method: "GET"});
}

export async function httpDelete(request: HttpDeleteRequest): Promise<HttpResponse> {
    return httpCall({...request, method: "DELETE"});
}

export async function httpPost(request: HttpPostRequest): Promise<HttpResponse> {
    return httpCall({...request, method: "POST"});
}


async function httpCall(request: HttpRequest): Promise<HttpResponse> {
    // Add useless parameter to bust cache if needed
    // const actualParameters = noCache ? {noCache: "", ...parameters} : parameters;
    const actualUrl = request.url + parseParameters(request.parameters);
    const noCache = request.noCache === true;
    const noCacheHeaders: StringMap = noCache ? {
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    } : {}
    const response = await fetch(actualUrl, {
        method: request.method,
        body: request.body,
        headers: {...noCacheHeaders, ...request.headers},
        cache: noCache ? "no-cache" : undefined,
        mode: "cors"
    })

    return {
        code: response.status,
        body: await response.text(),
    }
}

interface HttpRequest {
    url: string
    method: string
    parameters?: StringMap
    headers?: StringMap
    noCache?: boolean
    body?: BodyInit
}