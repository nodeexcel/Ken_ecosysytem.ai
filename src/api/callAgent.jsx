import axiosInstance from "./axiosInstance";

export const addPhoneNumber = async (payload) => {
    try {
        const response = await axiosInstance.post('http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/add-phone-number', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const createPhoneAgent = async (payload) => {
    try {
        const response = await axiosInstance.post('http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/create-phone-agent', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const createPhoneCampaign= async (payload) => {
    try {
        const response = await axiosInstance.post('http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/create-phone-campaign', payload);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};



export const getPhoneNumber= async () => {
    try {
        const response = await axiosInstance.get('http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-phone-numbers');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaign= async () => {
    try {
        const response = await axiosInstance.get('http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-phone-campaigns');
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};


export const getPhoneCampaignDetail= async (id) => {
    try {
        const response = await axiosInstance.get(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/phone-campaign-detail/${id}`);
        return response;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const getCallAgent=async()=>{
     try{
        const response = await axiosInstance.get('http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/get-phone-agents');
        return response;
     }catch (error) {
        console.error(error);
        return error;
}
}


export const updatePhoneNumberStatus=async (id)=>{
      try{
      const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/phone-number-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const updatePhoneNumberAgentStatus=async (id)=>{

      try{
      const response = await axiosInstance.patch(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/phone-agent-status/${id}`);
      return response;
      }catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneNumber=async (id)=>{
      try{
      const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/phone-number/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}

export const deletePhoneCampaign=async(id)=>{

      try{
      const response = await axiosInstance.delete(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }

}

export const updatePhoneCampaign=async ( payload)=>{
      try{
      const response = await axiosInstance.put("http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/update-phone-campaign/"+payload.id, payload);
        return response;
        }
        catch(error){
        console.error(error);
        return error;
        }
}

export const duplicateCampaign=async (id)=>{
      try{
      const response = await axiosInstance.post(`http://ecosystem-agents-2078567720.eu-north-1.elb.amazonaws.com/duplicate-phone-campaign/${id}`);
      return response;
      }
      catch(error){
        console.error(error);
        return error;
      }
}