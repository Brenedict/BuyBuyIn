import BranchModel from "../models/branch.model";

export default {
    async getBranchLocationById(branchId: number): Promise<string | null> {
        const branch = await BranchModel.getById(branchId);

        return branch?.location || null;
    },
};
