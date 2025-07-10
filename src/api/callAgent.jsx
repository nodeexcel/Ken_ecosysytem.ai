import agentInstance from "./agentInstance";

export const addPhoneNumber = async (payload) => {
    try {
        const response = await agentInstance.post('/add-phone-number', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const createPhoneAgent = async (payload) => {
    try {
        const response = await agentInstance.post('/create-phone-agent', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const createPhoneCampaign= async (payload) => {
    try {
        const response = await agentInstance.post('/create-phone-campaign', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const getPhoneNumber= async () => {
    try {
        const response = await agentInstance.get('/get-phone-numbers');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaign= async () => {
    try {
        const response = await agentInstance.get('/get-phone-campaigns');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaignDetail= async (id) => {
    try {
        const response = await agentInstance.get(`/phone-campaign-detail/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCallAgent=async()=>{
     try{
        const response = await agentInstance.get('/get-phone-agents');
        return response;
     }catch (error) {
        console.error(error);
        return error;
}
}


export const updatePhoneNumberStatus=async (id)=>{
      try{
      const response = await agentInstance.patch(`/phone-number-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const updatePhoneNumberAgentStatus=async (id)=>{

      try{
      const response = await agentInstance.patch(`/phone-agent-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneNumber=async (id)=>{
      try{
      const response = await agentInstance.delete(`/phone-number/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneCampaign=async(id)=>{

      try{
      const response = await agentInstance.delete(`/phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }

}

export const updatePhoneCampaign=async ( payload)=>{
      try{
      const response = await agentInstance.put("/update-phone-campaign/"+payload.id, payload);
        return response;
        }
        catch(error){
        console.error(error);
        return error;
        }
}

export const duplicateCampaign=async (id)=>{
      try{
      const response = await agentInstance.post(`/duplicate-phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}