/* Imports for interfaces */
import { ResponseDataInterface } from "../config/interfaces/ResponseData.interface";

type SanitizedData = Record<string, number | string>;

/** 
* All method here are related to global helpers.
*/
class GlobalHelper{

    /**
    * This function is used for filtering required fields.<br>
    * Triggered by All Controllers.<br>
    * Last updated at: April 19, 2024
    * @param required_fields - Key names of required fields. 
    * @param optional_fields - Key names of optional fields.
    * @param req_body - Object to validate.
    * @author Jerick, Updated By: Kirt
    */
    checkFields = (required_fields: string[], optional_fields: string[], req_body: SanitizedData): ResponseDataInterface<SanitizedData>  => {
        let response_data: ResponseDataInterface<SanitizedData> = { status: false, message: null, error: null };
        
        try{
            let all_fields     = [...required_fields, ...optional_fields];
            let sanitized_data: SanitizedData = {};
            let missing_fields = [];

            for(let index in all_fields){
                let selected_key = all_fields[index]; 
                /* Set the selected_value to an empty string if it is undefined */
                let selected_value = req_body[selected_key] != undefined ? req_body[selected_key] : ""; 

                /* Check if the selected_key is included in required fields, use trim to remove white space */
                if(String(selected_value).trim() === "" && required_fields.includes(selected_key)){
                    missing_fields.push(selected_key);
                }
                else{
                    sanitized_data[selected_key] = selected_value;
                }
            }

            /* Check if there are any missing fields from the sanitization */
            if(!missing_fields.length){
                response_data.result = sanitized_data;
                response_data.status = true;
            }
            else{
                response_data.message = `Fields ${missing_fields.join(", ")} are missing`;
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

export default new GlobalHelper();