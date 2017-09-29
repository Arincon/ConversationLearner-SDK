import * as Request from 'request';
import { BlisDebug } from './BlisDebug';

export class AzureFunctions {
    
    public static Call(azureFunctionsUrl : string,azureFunctionsKey : string, funcName : string, args : string ) : Promise<string>
    {
        var apiPath = "app";

        if (azureFunctionsKey)
        {
            if (args)
            {
                args += `&code=${azureFunctionsKey}`;
            }
            else
            {
                args = `?code=${azureFunctionsKey}`;
            }
        }
        return new Promise(
            (resolve, reject) => {
                const requestData = {
                    url: azureFunctionsUrl + funcName + "/" + args,
                    /*          TODO - auth          
                    headers: {
                        'Cookie' : this.credentials.Cookiestring(),
                    },*/
                    /* TODO - params
                    body: {
                        name: name,
                        LuisAuthKey: luisKey
                    },
                    */
                    json: true
                }
                BlisDebug.LogRequest("GET",apiPath, requestData);
                Request.get(requestData, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else if (response.statusCode >= 300) {
                        reject(body);
                    }
                    else {
                        resolve(body.Result);
                    }
                });
            }
        )
    }
}
