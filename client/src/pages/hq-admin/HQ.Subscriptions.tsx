// General Import
import { useMemo } from "react";
import { Form } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";

import SearchInput from "../../components/inputs/SearchInput";

// Material UI Icons
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import StorefrontIcon from "@mui/icons-material/Storefront";

// Utils
import { formatFullDate } from "../../utils/dateUtils";

// Test Data
import {
    HQ_SUBSCRIPTION,
    HQ_BRANCH_SUBSCRIPTIONS,
} from "../../TESTINGDATA/subscriptionsData";
import type { BranchSubscription } from "../../TESTINGDATA/subscriptionsData";

// Hooks
import { useFormSearchParams } from "../../hooks/useFormSearchParams";

interface BranchStatusProps {
    status: "active" | "inactive";
}

interface StatCardProps {
    icon: React.ElementType;
    badgeIcon?: React.ElementType;
    badgeVariant?: "active" | "inactive";
    count: number;
    label: string;
    caption?: string;
}

export default function HQ_SubscriptionDetails() {
    return (
        <Card isGlass={true} dropShadow={true} className="w-full">
            <Card.Body className="flex flex-col gap-6">
                <SubscriptionHeaderSection />
                <CurrentPlanSection />

                <div className="flex gap-6 items-start">
                    <BranchSubscriptionSection />
                    <BranchStatsSection />
                </div>
            </Card.Body>
        </Card>
    );
}

function SubscriptionHeaderSection() {
    return (
        <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <Text
                    align="left"
                    font="default"
                    size="larger"
                    variant="crimson"
                    weight="extraBold"
                >
                    SUBSCRIPTION DETAILS
                </Text>

                <Text
                    align="left"
                    font="default"
                    size="mediumBig"
                    variant="slate-medium"
                    weight="medium"
                >
                    Monitor and manage branch subscriptions
                </Text>
            </div>

            
        </div>
    );
}

function CurrentPlanSection() {
    // Test data containing the current HQ subscription plan
    const testPlan = HQ_SUBSCRIPTION;

    return (
        <Card isGlass={false} dropShadow={false} className="w-full">
            <Card.Body className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <Text
                        align="left"
                        font="default"
                        size="bigger"
                        variant="crimson"
                        weight="medium"
                    >
                        HQ CURRENT PLAN
                    </Text>

                    <div className="flex items-center gap-3">
                        <StorefrontIcon
                            className="text-crimson"
                            fontSize="large"
                        />

                        <Text
                            align="left"
                            font="default"
                            size="larger"
                            variant="crimson"
                            weight="extraBold"
                        >
                            {testPlan?.planName}
                        </Text>

                        <div className="bg-crimson text-cream font-bold px-3 py-1 rounded-xl text-small-description">
                            {testPlan?.billingCycle}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-right">
                    <div className="flex gap-8 justify-end">
                        <Text variant="slate-light">Next Billing Date</Text>
                        <Text weight="bold">
                            {formatFullDate(
                                new Date(testPlan?.nextBillingDate)
                            )}
                        </Text>
                    </div>

                    <div className="flex gap-8 justify-end">
                        <Text variant="slate-light">Payment Method</Text>
                        <Text weight="bold">
                            {testPlan?.paymentMethod}
                        </Text>
                    </div>

                    <a
                        href="#"
                        className="border-none shadow-none bg-transparent p-0 text-larger-description font-larger text-crimson hover:underline mt-5 "
                    >
                        MANAGE BILLING
                    </a>
                </div>
            </Card.Body>
        </Card>
    );
}

function BranchSubscriptionSection() {
    const { values, submit } = useFormSearchParams({ search: "" });

    // Filters the branch list based on the search param
    const filteredBranches = useMemo(
        () =>
            HQ_BRANCH_SUBSCRIPTIONS.filter(
                (branch: BranchSubscription) =>
                    branch.branchName
                        .toLowerCase()
                        .includes(values.search.toLowerCase())
            ),
        [values.search]
    );

    return (
        <Card dropShadow={false} className="w-[70%]">
            <Card.Header
                toggleRightButton
                rightButton={
                    <Button
                        size="normal"
                        variant="main"
                        leftIcon={AddIcon}
                        className="border-none shadow-none"
                    >
                        Add Branch
                    </Button>
                }
                bordered
            >
                <Text weight="bold" size="big" variant="crimson">
                    Branch Subscription
                </Text>
            </Card.Header>

            <Card.Body className="flex gap-4">
                <Form onSubmit={submit()} className="grow">
                    <SearchInput
                        disabled={false}
                        hidden={false}
                        id="hq_brName_search"
                        label=""
                        name="search"
                        defaultValue={values.search}
                        onChange={() => {}}
                        placeholder="Search Branch Name"
                    />
                </Form>

                <Button
                    variant="grey"
                    leftIcon={FilterListIcon}
                    className="h-full border-none shadow-none"
                    size="normal"
                >
                    Filter Status
                </Button>
            </Card.Body>

            <Table
                bordered
                pagination={{
                    bgVariant: "cream-muted",
                    borderVariant: "brown",
                    borderedTop: true,
                    maxItems: 6,
                    textSize: "description",
                    textVariant: "crimson",
                    textWeight: "medium",
                }}
                rounded
                shadow={false}
            >
                <Table.Row borderedBottom>
                    <Table.Header
                        text="Branch Details"
                        className="w-[70%] text-center"
                    />

                    <Table.Header
                        text="Status"
                        className="w-[30%] text-center"
                    />
                </Table.Row>

                {filteredBranches.map((branch: BranchSubscription) => (
                    <Table.Row key={branch.id}>
                        <Table.Data className="w-[70%]">
                            <div className="flex flex-col">
                                <Text weight="bold">
                                    {branch.branchName}
                                </Text>

                                <Text
                                    variant="slate-light"
                                    size="description"
                                >
                                    {branch.branchAddress}
                                </Text>
                            </div>
                        </Table.Data>

                        <Table.Data className="w-[30%]">
                            <div className="flex justify-center">
                                <BranchStatusBadge
                                    status={
                                        branch.status as BranchStatusProps["status"]
                                    }
                                />
                            </div>
                        </Table.Data>
                    </Table.Row>
                ))}
            </Table>
        </Card>
    );
}

function BranchStatusBadge({ status }: BranchStatusProps) {
    const statusClass: Record<
        BranchStatusProps["status"],
        string
    > = {
        active: "border border-crimson text-crimson",
        inactive: "bg-crimson text-cream",
    };

    return (
        <div
            className={`w-fit px-4 py-1 rounded-full font-bold text-small-description ${statusClass[status]}`}
        >
            {status === "active" ? "Active" : "Inactive"}
        </div>
    );
}

function BranchStatsSection() {
    // Derives the branch counts straight from the test data
    const totalBranches = HQ_BRANCH_SUBSCRIPTIONS.length;

    const activeBranches = HQ_BRANCH_SUBSCRIPTIONS.filter(
        (branch: BranchSubscription) =>
            branch.status === "active"
    ).length;

    const inactiveBranches = totalBranches - activeBranches;

    return (
        <div className="w-[30%] flex flex-col gap-4">
            <StatCard
                icon={StorefrontIcon}
                badgeIcon={CheckCircleIcon}
                badgeVariant="active"
                count={activeBranches}
                label="Active Branches"
                //caption="+3 this month"
            />

            <StatCard
                icon={StorefrontIcon}
                //badgeIcon={CancelIcon}
                badgeVariant="inactive"
                count={inactiveBranches}
                label="Inactive Branches"
            />

            <StatCard
                icon={StorefrontIcon}
                count={totalBranches}
                label="Total Branches"
            />
        </div>
    );
}

function StatCard({
    icon: Icon,
    badgeIcon: BadgeIcon,
    badgeVariant,
    count,
    label,
    caption,
}: StatCardProps) {
    const badgeClass: Record<
        NonNullable<StatCardProps["badgeVariant"]>,
        string
    > = {
        active: "text-crimson",
        inactive: "text-crimson",
    };

    return (
        <Card
            isGlass={false}
            dropShadow={false}
            className="relative"
        >
            <Card.Body className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cream">
                        <Icon
                            className="text-crimson"
                            fontSize="medium"
                        />
                    </div>

                    {caption && (
                        <Text
                            align="right"
                            size="description"
                            variant="crimson"
                        >
                            {caption}
                        </Text>
                    )}
                </div>

                {BadgeIcon && badgeVariant && (
                    <BadgeIcon
                        className={`absolute top-2 right-2 ${badgeClass[badgeVariant]}`}
                        fontSize="small"
                    />
                )}

                <Text
                    weight="extraBold"
                    size="larger"
                    variant="crimson"
                >
                    {count}
                </Text>

                <Text
                    weight="bold"
                    size="description"
                    variant="crimson"
                >
                    {label.toUpperCase()}
                </Text>
            </Card.Body>
        </Card>
    );
}