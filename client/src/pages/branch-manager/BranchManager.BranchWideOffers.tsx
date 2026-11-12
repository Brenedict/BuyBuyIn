// General Imports
import type { MouseEvent } from "react";
import { Form, Outlet, useLoaderData, useSearchParams } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import SearchInput from "../../components/inputs/SearchInput";
import Icon from "../../components/Icon";

// MUI Icons
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";
import { useFormSearchParams } from "../../hooks/useFormSearchParams";

// API Services
import type { BranchWideOffersPageData } from "../../api/branchWideOfferService";

// BuyBuyIn Shared Imports
import type { BranchWideOfferEntry, BranchWideOfferStatusType } from "@buybuyin/shared/schema/branchWideOffer";

// Routes & Utils
import { ROUTES } from "../../routes/Routes";
import { formatFullDate } from "../../utils/dateUtils";

type StatusVariant = "enabled" | "disabled" | "draft";

const STATUS_CLASSES: Record<StatusVariant, string> = {
    enabled: "bg-crimson text-cream font-bold",
    disabled: "bg-slate-light text-cream font-bold",
    draft: "bg-slate-medium/90 text-cream font-bold",
};

const getStatusVariant = (status: BranchWideOfferStatusType): StatusVariant => status.toLowerCase() as StatusVariant;

function OfferCard({ offer }: { offer: BranchWideOfferEntry }) {
    const navigate = useNavigatePage();

    const isExclusive = offer.isExclusive;
    const editPath = ROUTES.BRANCH_MANAGER.branchOffersEdit(String(offer.id));
    const viewPath = ROUTES.BRANCH_MANAGER.branchOffersView(String(offer.id));
    const deletePath = ROUTES.BRANCH_MANAGER.branchOffersDelete(String(offer.id));
    const cardDestination = isExclusive ? editPath : viewPath;

    const status = getStatusVariant(offer.offerStatus);
    const shortenedTitle = offer.offerName.length > 20 ? `${offer.offerName.substring(0, 20)}...` : offer.offerName;

    const handleCardClick = () => navigate(cardDestination, true);

    const handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        navigate(deletePath, true);
    };

    return (
        <Card
            className="bg-[#FEFCED] rounded-2xl h-full hover:opacity-80 active:opacity-100 hover:cursor-pointer hover:scale-99 transition-transform"
            onClick={handleCardClick}
        >
            <Card.Body className="flex flex-col justify-between h-full min-h-[160px] gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                        <Text weight="extraBold" size="big" variant="crimson" className="leading-tight">
                            {shortenedTitle}
                        </Text>
                        {isExclusive && (
                            <Text size="description" weight="medium" variant="crimson">
                                Exclusive
                            </Text>
                        )}
                    </div>

                    <Text variant="slate-light">
                        {formatFullDate(new Date(offer.startDate))} - {formatFullDate(new Date(offer.endDate))}
                    </Text>

                    <div
                        className={`w-fit px-3 py-1 rounded-xl lg:text-normal md:text-small-description ${STATUS_CLASSES[status]}`}
                    >
                        {status}
                    </div>
                </div>

                <div className="flex flex-row justify-end items-center gap-2 mt-auto pt-2">
                    {isExclusive && (
                        <>
                            <Button
                                type="button"
                                aria-label="Delete offer"
                                variant="secondary"
                                size="small"
                                rightIcon={DeleteOutlineOutlinedIcon}
                                className="p-2! bg-transparent! hover:bg-crimson!"
                                onClick={handleDelete}
                            />
                        </>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}

function PaginationFooter({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <Card.Footer bordered={false} className="flex justify-end gap-2 px-8 pb-8">
            <Button
                type="button"
                variant="secondary"
                size="small"
                className="rounded-full!"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>

            {pages.map((pageNumber) => (
                <Button
                    key={pageNumber}
                    type="button"
                    variant={pageNumber === page ? "main" : "secondary"}
                    size="small"
                    className="rounded-full! px-4!"
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </Button>
            ))}

            <Button
                type="button"
                variant="secondary"
                size="small"
                className="rounded-full!"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </Card.Footer>
    );
}

export function BranchManager_BranchWideOffers() {
    const { list, options } = useLoaderData<BranchWideOffersPageData>();

    const navigate = useNavigatePage();
    const [searchParams, setSearchParams] = useSearchParams();
    const { values, handleChange } = useFormSearchParams({ search: "", page: "" });

    const branch = options.branches[0];
    const branchDetails = branch ? `Branch #${branch.branchId}` : "No branch assigned";

    const statCards = [
        {
            label: "Total Offers In This Branch",
            value: list.summary.totalOffers,
            icon: LocalOfferOutlinedIcon,
        },
        {
            label: "Active Offers",
            value: list.summary.activeOffers,
            icon: EventAvailableOutlinedIcon,
        },
        {
            label: "Inactive / Expired",
            value: list.summary.inactiveOffers,
            icon: WarningAmberOutlinedIcon,
        },
        {
            label: "Total Branches",
            value: list.summary.totalBranches,
            icon: StorefrontOutlinedIcon,
        },
    ];

    const handlePageChange = (page: number) => {
        const nextParams = new URLSearchParams(searchParams);

        if (page <= 1) {
            nextParams.delete("page");
        } else {
            nextParams.set("page", String(page));
        }

        setSearchParams(nextParams);
    };

    return (
        <Card>
            <Card.Body className="py-6 px-10 flex flex-col gap-8 overflow-scroll">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-row justify-between items-center border-b-1 border-maroon pb-6">
                    <Text
                        weight="extraBold"
                        size="large"
                        variant="crimson"
                        className="uppercase drop-shadow-sm text-4xl"
                    >
                        BRANCH-WIDE OFFERS
                    </Text>

                    <div className="flex flex-row gap-6 items-center">
                        <Form onChange={handleChange}>
                            <SearchInput
                                name="search"
                                placeholder="Search Offers"
                                defaultValue={values.search}
                                className="w-64"
                            />
                        </Form>

                        <Card isGlass={false} dropShadow={true} className="px-6 py-4 rounded-2xl bg-[#FEFCED]">
                            <Text weight="bold" size="normal" variant="black">
                                Branch Details
                            </Text>
                            <Text weight="extraBold" size="bigger" variant="crimson">
                                {branch ? branch.location : "No branch assigned"}
                            </Text>
                            <Text size="normal" variant="black">
                                {branchDetails}
                            </Text>
                        </Card>
                    </div>
                </div>

                {/* --- STATS GRID SECTION --- */}
                <div className="grid grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Card key={stat.label} dropShadow={true} className="bg-[#FEFCED] rounded-2xl py-2 flex-1">
                            <Card.Body className="flex flex-col gap-2 justify-center h-full">
                                <Text size="description" variant="black" className="uppercase">
                                    {stat.label}
                                </Text>
                                <div className="flex flex-row items-center gap-4 mt-2">
                                    <Icon icon={stat.icon} size="bigger" variant="crimson" />
                                    <Text size="bigger" weight="extraBold" variant="crimson" className="text-5xl">
                                        {stat.value}
                                    </Text>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>

                {/* --- OFFERS SECTION --- */}
                <Card dropShadow={true} className="mt-4 bg-transparent flex flex-col">
                    <Card.Header bordered={false} className="pt-16 px-8">
                        <div className="flex flex-row justify-between items-center w-full">
                            <Text weight="extraBold" size="bigger" variant="crimson" className="uppercase text-3xl">
                                OFFERS
                            </Text>

                            <Button
                                type="button"
                                size="small"
                                variant="main"
                                leftIcon={AddIcon}
                                className="rounded-full px-6"
                                disabled={options.branches.length === 0}
                                onClick={() => navigate(ROUTES.BRANCH_MANAGER.branchOffersAdd, true)}
                            >
                                Add Offer
                            </Button>
                        </div>
                    </Card.Header>

                    <Card.Body className="px-8 pb-4">
                        <div className="border border-gray-400 rounded-3xl p-6">
                            {list.items.length === 0 ? (
                                <Text variant="slate-light">No offers found.</Text>
                            ) : (
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                                    {list.items.map((offer) => (
                                        <OfferCard key={offer.id} offer={offer} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card.Body>

                    <PaginationFooter
                        page={list.pagination.page}
                        totalPages={list.pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </Card>
            </Card.Body>

            <Outlet />
        </Card>
    );
}

export default BranchManager_BranchWideOffers;
