// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { PageHeader } from "../../components/PageHeader";

// Material UI Icons
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

// Types
import type { MaterialIcon } from "../../types/common";

function OfferSummaryCard({ title, icon, value }: { title: string; icon?: MaterialIcon; value: number | string }) {
    return (
        <Card>
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
        <Card>
            <Card.Body>
                <Text size="big" weight="extraBold">
                    {title}
                </Text>
                <Text variant="maroon" size="small">
                    {dateRangeText}
                </Text>
            </Card.Body>
        </Card>
    );
}

function OffersSection() {
    return (
        <Card>
            <Card.Body>
                <Text size="bigger" weight="extraBold">
                    Offers
                </Text>
                <section className="grid grid-cols-4 gap-6">
                    <OfferItemsCard title="Summer Sale 2026" startDate="May 1" endDate="June 30" />
                    <OfferItemsCard title="Summer Sale 2026" startDate="May 1" endDate="June 30" />
                    <OfferItemsCard title="Summer Sale 2026" startDate="May 1" endDate="June 30" />
                    <OfferItemsCard title="Summer Sale 2026" startDate="May 1" endDate="June 30" />
                </section>
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
            <Card.Body>
                <section className="grid grid-cols-4 gap-6">
                    <OfferSummaryCard title="TOTAL OFFERS IN THIS BRANCH" icon={LocalOfferIcon} value={4} />
                    <OfferSummaryCard title="ACTIVE OFFERS" icon={LocalOfferIcon} value={4} />
                    <OfferSummaryCard title="INACTIVE/EXPIRED" icon={LocalOfferIcon} value={4} />
                    <OfferSummaryCard title="TOTAL BRANCHES" icon={LocalOfferIcon} value={4} />
                </section>
                <OffersSection />
            </Card.Body>
        </Card>
    );
}
