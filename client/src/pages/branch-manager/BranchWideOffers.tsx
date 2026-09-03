// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";

// Material UI Icons
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import StorefrontIcon from "@mui/icons-material/Storefront";

// Types
import type { MaterialIcon } from "../../types/common";

function OfferSummaryCard({ title, icon, value }: { title: string; icon?: MaterialIcon; value: number | string }) {
    return (
        <Card isGlass={false}>
            <Card.Body>
                <Text variant="maroon">{title}</Text>
                <Text
                    size="larger"
                    weight="extraBold"
                    svg={{ gap: "medium", icon: icon, position: "left", size: "larger", variant: "maroon" }}
                >
                    {value}
                </Text>
            </Card.Body>
        </Card>
    );
}

function OfferItemsCard({ title, startDate, endDate }: { title: string; startDate: string; endDate?: string }) {
    const dateRangeText = endDate === "" || endDate == undefined ? startDate : `${startDate} - ${endDate}`;

    return (
        <Card isGlass={false}>
            <Card.Body className="flex flex-col gap-2">
                <Text size="big" weight="extraBold">
                    {title}
                </Text>
                <Text variant="maroon" size="small">
                    {dateRangeText}
                </Text>
                <div className="flex gap-2">
                    <Button size="small" className="flex-1">
                        View
                    </Button>
                    <Button size="small" variant="secondary" leftIcon={DeleteIcon} className="flex-1"></Button>
                </div>
            </Card.Body>
        </Card>
    );
}

function OffersSection() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-2">
                <Text size="bigger" weight="extraBold">
                    Offers
                </Text>
                <section className="grid grid-cols-4 gap-6">
                    <OfferItemsCard title="Summer Sale 2026" startDate="May 1" endDate="June 30" />
                    <OfferItemsCard title="Independence Day" startDate="June 12" endDate="June 15" />
                    <OfferItemsCard title="Black Friday" startDate="Nov 24" endDate="Nov 30" />
                    <OfferItemsCard title="Christmas Sale" startDate="Dec 25" endDate="Dec 30" />
                </section>
                <br />
            </Card.Body>
        </Card>
    );
}

export function BranchWideOffers() {
    return (
        <Card>
            <Card.Header>
                <PageHeader
                    headerText="Branch Wide Offers"
                    descriptionText="Manage ongoing business offers, bundles, and discounts."
                />
            </Card.Header>
            <Card.Body className="flex flex-col gap-6">
                <section className="grid grid-cols-4 gap-6">
                    <OfferSummaryCard title="TOTAL OFFERS IN THIS BRANCH" icon={LocalOfferIcon} value={4} />
                    <OfferSummaryCard title="ACTIVE OFFERS" icon={ThumbUpAltIcon} value={2} />
                    <OfferSummaryCard title="INACTIVE/EXPIRED" icon={ThumbDownIcon} value={1} />
                    <OfferSummaryCard title="TOTAL BRANCHES" icon={StorefrontIcon} value={5} />
                </section>
                <OffersSection />
            </Card.Body>
            <Card.Footer></Card.Footer>
        </Card>
    );
}
