// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

export function SaveConfirmationPopup() {
    // Used for redirecting
    const useNavigate = useNavigatePage();

    // When triggered, returns the page to the root (exiting the popup)
    const handleClose = () => useNavigate();

    return (
        <PopUp title="Save New Offer">
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
