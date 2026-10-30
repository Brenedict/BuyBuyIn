// Components
import { PopUp } from "../../PopUp";
import { Button } from "../../Button";
import GeneralInput from "../../inputs/GeneralInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// General Imports
import { Form } from "react-router";
import { ROUTES } from "../../../routes/Routes";

export function BusinessFormPopup() {
    const navigate = useNavigatePage();
    const handleClose = () => navigate(ROUTES.SUPER_ADMIN.businesses, true);

    return (
        <PopUp title="Add Business" handleCloseProp={handleClose}>
            <Form method="post" className="flex flex-col gap-4">
                <GeneralInput
                    name="name"
                    type="text"
                    label="Business Name"
                    labelVariant="small"
                    placeholder="Santos Fashion Boutique"
                    required
                />
                <GeneralInput
                    name="location"
                    type="text"
                    label="Location"
                    labelVariant="small"
                    placeholder="Manila"
                    required
                />

                <div className="flex gap-2 pt-2">
                    <Button type="button" variant="secondary" size="normal" className="flex-1" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="main" size="normal" className="flex-1">
                        Add
                    </Button>
                </div>
            </Form>
        </PopUp>
    );
}