import useNavigatePage from "../../../hooks/useNavigatePage";
import { ROUTES } from "../../../routes/Routes";
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";
import { useParams } from "react-router";

export function SaveConfirmationPopup({ isFromEditPage = false }: { isFromEditPage?: boolean }) {
    // Extracts the Branch Wide Offer Id from the URL Param
    const { id } = useParams();

    // Used for redirecting
    const useNavigate = useNavigatePage();

    // Two instances of the pages use the popup (add and edit). They have different root pages.
    const popupRootPage = isFromEditPage && id ? ROUTES.HQ_ADMIN.branchOffersEdit(id) : ROUTES.HQ_ADMIN.branchOffers;

    // When triggered, returns the page to the root (exiting the popup)
    const handleClose = () => useNavigate(popupRootPage, true);

    return (
        <PopUp title="Save New Offer" onClose={handleClose}>
            <section className="flex flex-col gap-4">
                <GeneralInput
                    name="offerTitle"
                    type="text"
                    label="Offer Title"
                    labelVariant="small"
                    disabled
                    value={"insert here from previous page"}
                />
                <TextAreaInput
                    name="description"
                    disabled
                    value={"insert here from previous page"}
                    label="Offer Description"
                    labelVariant="small"
                >
                    {}
                </TextAreaInput>
                {/* List here the select branches, if the optoin is all branches just add a text stating it */}

                <div className="flex gap-2">
                    <Button onClick={handleClose} className="flex-1" variant="secondary" size="normal">
                        Cancel
                    </Button>
                    <Button className="flex-1" size="normal">
                        Save
                    </Button>
                </div>
            </section>
        </PopUp>
    );
}
