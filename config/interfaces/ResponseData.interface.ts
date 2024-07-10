export interface ResponseDataInterface <ResultValue>{
    code?: number,
    status: boolean,
    result?: ResultValue,
    error: unknown,
    message: string | null
};