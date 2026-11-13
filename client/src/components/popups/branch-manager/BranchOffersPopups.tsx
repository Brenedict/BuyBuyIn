// General Imports
import { Form, useLoaderData } from "react-router";
import type { ChangeEvent } from "react";

// Components
import { PopUp } from "../../PopUp";
import { Text } from "../../Text";
import { Card } from "../../Card";
import GeneralInput from "../../inputs/GeneralInput";
import TextAreaInput from "../../inputs/TextAreaInput";
import ChoiceInput from "../../inputs/ChoiceInput";

// Hooks
import useNavigatePage from "../../../hooks/useNavigatePage";

// BuyBuyIn Shared Imports
import type { BranchWideOfferEntry, BranchWideOfferStatusType } from "@buybuyin/shared/schema/branchWideOffer";

// Routes & Utils
import { ROUTES } from "../../../routes/Routes";
import { formatFullDate } from "../../../utils/dateUtils";

// Status options shown in the popup. Values follow the offer status enum (ENABLED / DRAFT / DISABLED).
const STATUS_OPTIONS: { value: BranchWideOfferStatusType; label: string }[] = [
    { value: "ENABLED", label: "Enabled" },
    { value: "DRAFT", label: "Draft" },
    { value: "DISABLED", label: "Disabled" },
];

// Popup showing the details of a single branch-wide offer
export function ViewOfferPopup() {
    const navigate = useNavigatePage();
    const offer = useLoaderData<BranchWideOfferEntry | null>();

    // Closing the popup returns to the offers page
    const handleClose = () => navigate(ROUTES.BRANCH_MANAGER.branchOffers, true);

    // Branch choices are display-only, so changes are ignored
    // (using `disabled` would grey them out and the design keeps them crimson)
    const handleReadOnly = () => {};

    // Submits the form as soon as a different status is picked
    const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.currentTarget.form?.requestSubmit();
    };

    // Covers opening the URL directly with an id that does not exist
    if (!offer) {
        return (
            <PopUp title="View Offer" handleCloseProp={handleClose}>
                <Text variant="brown">This offer could not be found.</Text>
            </PopUp>
        );
    }

    // The backend only allows status changes on an offer tied exclusively to the manager's own branch
    const canChangeStatus = offer.isExclusive && offer.branches.length === 1;

    // An offer that is not exclusive applies to every branch
    const isForAllBranches = !offer.isExclusive;

    const statusChoices = (
        <div className="flex gap-6">
            {STATUS_OPTIONS.map((status) => (
                <ChoiceInput
                    key={status.value}
                    id={`status-${status.value}`}
                    name={canChangeStatus ? "offerStatus" : undefined}
                    value={canChangeStatus ? status.value : undefined}
                    inputVariant="radio"
                    className="w-fit!"
                    checked={offer.offerStatus === status.value}
                    onChange={canChangeStatus ? handleStatusChange : handleReadOnly}
                >
                    {status.label}
                </ChoiceInput>
            ))}
        </div>
    );

    return (
        <PopUp title="View Offer" handleCloseProp={handleClose}>
            <section className="flex flex-col gap-4">
                <GeneralInput
                    id="offerName"
                    name="offerName"
                    type="text"
                    label="Offer name"
                    disabled
                    readOnly
                    value={offer.offerName}
                />

                <TextAreaInput
                    id="description"
                    name="description"
                    label="Description"
                    disabled
                    readOnly
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
                        readOnly
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
                        readOnly
                        value={formatFullDate(new Date(offer.endDate))}
                    />
                </div>

                {/* Branches: "All Branches" is checked when the offer is not exclusive */}
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
                        {offer.branches.map((branch) => (
                            <ChoiceInput
                                key={branch.branchId}
                                id={`branch-${branch.branchId}`}
                                className="w-full"
                                checked
                                onChange={handleReadOnly}
                            >
                                {branch.location}
                            </ChoiceInput>
                        ))}
                    </Card.Body>
                </Card>

                {/* Status: editable only for offers exclusive to the manager's own branch */}
                <div>
                    <Text size="big" weight="bold" variant="brown">
                        Status
                    </Text>
                    {canChangeStatus ? <Form method="post">{statusChoices}</Form> : statusChoices}
                </div>
            </section>
        </PopUp>
    );
}
