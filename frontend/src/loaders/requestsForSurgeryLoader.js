import {fetchSurgeryRequests} from "../services/apiRequestSurgery"

export async function requestsForSurgeryLoader({params}){
    const requests = await fetchSurgeryRequests(params.surgeryId);
    return requests
}