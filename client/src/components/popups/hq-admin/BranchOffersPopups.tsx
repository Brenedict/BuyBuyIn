// General Imports
import { Form, useLoaderData } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import { Text } from "../../Text";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// BuyBuyIn Shared Imports
import type { BranchWideOfferEntry } from "@buybuyin/shared/schema/branchWideOffer";

// Routes
import { ROUTES } from "../../../routes/Routes";

// Material UI Icons
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export function BranchOfferDeletePopup() {
    const navigate = useNavigatePage();
    const offer = useLoaderData<BranchWideOfferEntry | null>();

    const handleClose = () => navigate(ROUTES.HQ_ADMIN.branchOffers, true);

    if (!offer) {
        return (
            <PopUp title="Offer Not Found" size="md" handleCloseProp={handleClose}>
                <Text>The offer you are looking for no longer exists.</Text>
                <div className="flex w-full gap-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </PopUp>
        );
    }

    const formId = "branchOfferDeleteForm";

    return (
        <PopUp title="Delete offer" subtitle="This action cannot be undone" size="md" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <div className="w-fit rounded-full bg-cream px-4 py-1.5">
                        <Text size="normal" weight="bold" variant="brown">
                            {offer.offerName}
                        </Text>
                    </div>
                </div>

                <Text>
                    Are you sure you want to delete <span className="font-bold">{offer.offerName}</span>? The offer will
                    be removed from all branches.
                </Text>

                <div className="flex items-start gap-3 rounded-2xl bg-crimson-muted p-3">
                    <WarningAmberOutlinedIcon className="text-crimson" fontSize="small" />
                    <Text size="description" weight="medium" variant="crimson">
                        Offers with existing transaction history are disabled instead of being permanently deleted.
                    </Text>
                </div>

                <Form id={formId} method="post" />
                <div className="flex w-full gap-2 pt-4">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1" form={formId}>
                        Yes, delete
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
