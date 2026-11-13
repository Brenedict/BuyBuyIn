// General Imports
import { useParams } from "react-router";

// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Card } from "../../Card";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";
import ChoiceInput from "../../inputs/ChoiceInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { formatFullDate } from "../../../utils/dateUtils";

// Temporary mock data (replace once the backend is connected)
import { SAMPLE_OFFERS, SAMPLE_OVERALL_BRANCHES } from "../../../TESTINGDATA/branchWideOfferData";

// Status options shown in the popup. Values follow the offer status enum (ENABLED / DRAFT / DISABLED).
const STATUS_OPTIONS = [
    { value: "enabled", label: "Enabled" },
    { value: "draft", label: "Draft" },
    { value: "disabled", label: "Disabled" },
];

// Read-only popup showing the details of a single branch-wide offer
export function ViewOfferPopup() {
    // Offer id from the URL (/branch-manager/branch-offers/:id/view)
    const { id } = useParams();

    // Used for redirecting
    const navigate = useNavigatePage();

    // Closing the popup returns to the offers page
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.branchOffers, true);

    // Checkboxes and radios here are display-only, so changes are ignored
    // (using `disabled` would grey them out and the design keeps them crimson)
    const handleReadOnly = () => {};

    const offer = SAMPLE_OFFERS.find((row) => String(row.id) === String(id));

    // Covers opening the URL directly with an id that does not exist
    if (!offer) {
        return (
            <PopUp title="View Offer" handleCloseProp={handleClose}>
                <Text variant="brown">This offer could not be found.</Text>
            </PopUp>
        );
    }

    // An empty branch list means the offer applies to every branch
    const isForAllBranches = offer.branchWideOfferBranches.length === 0;

    return (
        <PopUp title="View Offer" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <GeneralInput
                    id="offerName"
                    name="offerName"
                    type="text"
                    label="Offer name"
                    disabled
                    value={offer.offerName}
                />

                <TextAreaInput
                    id="description"
                    name="description"
                    label="Description"
                    disabled
                    value={offer.description}
                />

                {/* Date Range */}
                <div className="flex gap-3 items-end">
                    <GeneralInput
                        id="startDate"
                        name="startDate"
                        type="text"
                        label="Date Range"
                        disabled
                        value={formatFullDate(new Date(offer.startDate))}
                    />
                    <Text variant="brown" className="pb-3">
                        to
                    </Text>
                    <GeneralInput
                        id="endDate"
                        name="endDate"
                        type="text"
                        disabled
                        value={formatFullDate(new Date(offer.endDate))}
                    />
                </div>

                {/* Branches: "All Branches" is checked when no specific branch is attached to the offer */}
                <Card dropShadow={false}>
                    <Card.Body className="flex flex-col gap-2">
                        <ChoiceInput
                            id="allBranches"
                            className="w-full"
                            checked={isForAllBranches}
                            onChange={handleReadOnly}
                        >
                            All Branches
                        </ChoiceInput>
                        {SAMPLE_OVERALL_BRANCHES.map((branch) => (
                            <ChoiceInput
                                key={branch.branchId}
                                id={`branch-${branch.branchId}`}
                                className="w-full"
                                checked={offer.branchWideOfferBranches.some(
                                    (offerBranch) => offerBranch.branchId === branch.branchId
                                )}
                                onChange={handleReadOnly}
                            >
                                {branch.location}
                            </ChoiceInput>
                        ))}
                    </Card.Body>
                </Card>

                {/* Status */}
                <div>
                    <Text size="big" weight="bold" variant="brown">
                        Status
                    </Text>
                    <div className="flex gap-6">
                        {STATUS_OPTIONS.map((status) => (
                            <ChoiceInput
                                key={status.value}
                                id={`status-${status.value}`}
                                name="status"
                                inputVariant="radio"
                                className="w-fit!"
                                checked={offer.offerStatus === status.value}
                                onChange={handleReadOnly}
                            >
                                {status.label}
                            </ChoiceInput>
                        ))}
                    </div>
                </div>
            </section>
        </PopUp>
    );
}
