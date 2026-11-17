import BusinessModel from "../models/business.model";

export default {
    async getBusinessNameById(businessId: number): Promise<string | null> {
        const business = await BusinessModel.getById(businessId);

        return business?.name || null;
    },
};
