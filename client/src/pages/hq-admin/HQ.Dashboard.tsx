// General Imports
import { useState } from "react";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import Table from "../../components/Table";
import {
    TABLE_BRANCHES,
    SALES_OVERVIEW_LABELS,
    PERFORMANCE_LABELS,
    INTER_BRANCH_PERFORMANCE_LABELS,
    PERFORMANCE_DATA,
    INTER_BRANCH_PERFORMANCE_DATA,
    BRANCH_LEGEND,
} from "../../TESTINGDATA/branchData";
import { type ChartColorName } from "../../utils/chartColors";
import SelectInput from "../../components/inputs/SelectInput";
import { PrimarySecondaryText } from "../../components/partials/TablePartials";
import {
    AnalyticsCard,
    BranchLegendCard,
    InterBranchPerformanceCard,
    PerformanceCard,
    SalesOverviewCard,
} from "../../components/partials/DashboardPartials";
import { Outlet, useSearchParams } from "react-router";
import { TableFilterBar } from "../../components/TableFilterBar";

export function NumberFormat(value: number, symbol?: string) {
    return `${symbol ?? ""} ${value.toLocaleString()}`;
}

export function HQ_Dashboard() {
    const [searchParams, setSearchParams] = useSearchParams();

    const timeframe = searchParams.get("timeframe") ?? "today";

    const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev);
            newParams.set("timeframe", e.target.value);
            return newParams;
        });
    };

    const [searchBranch, setSearchBranch] = useState("");
    const [locationFilter, setLocationFilter] = useState("All Locations");
    const [employeeFilter, setEmployeeFilter] = useState("All Employees");

    const salesDataLabels = SALES_OVERVIEW_LABELS;
    const salesData = TABLE_BRANCHES.map((branch) => branch.totalSales);

    const performanceLabels = PERFORMANCE_LABELS;
    const performanceDatasets = PERFORMANCE_DATA.map((branch) => {
        const legendEntry = BRANCH_LEGEND.find((l) => l.name === branch.label);
        return {
            label: branch.label,
            data: branch.data,
            color: (legendEntry?.color ?? "crimson") as ChartColorName,
        };
    });

    const interBranchLabels = INTER_BRANCH_PERFORMANCE_LABELS;
    const interBranchData = INTER_BRANCH_PERFORMANCE_DATA;

    const uniqueLocations = Array.from(new Set(TABLE_BRANCHES.map((branch) => branch.location)));

    const filteredBranches = TABLE_BRANCHES.filter((branch) => {
        const matchesSearch = `${branch.branchId} ${branch.location} ${branch.subLocation}`
            .toLowerCase()
            .includes(searchBranch.toLowerCase());

        const matchesLocation = locationFilter === "All Locations" || branch.location === locationFilter;

        const matchesEmployees =
            employeeFilter === "All Employees" ||
            (employeeFilter === "1-10" && branch.employees >= 1 && branch.employees <= 10) ||
            (employeeFilter === "11-20" && branch.employees >= 11 && branch.employees <= 20) ||
            (employeeFilter === "21-30" && branch.employees >= 21 && branch.employees <= 30) ||
            (employeeFilter === "31-40" && branch.employees >= 31 && branch.employees <= 40) ||
            (employeeFilter === "41+" && branch.employees >= 41);

        return matchesSearch && matchesLocation && matchesEmployees;
    });

    return (
        <Card>
            <Card.Body className="py-6 px-10 overflow-scroll">
                <Text variant="crimson" size="large" weight="extraBold">
                    DASHBOARD
                </Text>
                <div className="flex items-center gap-8 mb-8">
                    <div className="w-full h-0.5 bg-maroon" />
                    <div className="w-fit">
                        <SelectInput
                            variant="button"
                            name="timeframe"
                            defaultValue={timeframe}
                            onChange={handleTimeframeChange}
                            className="border-0! py-1.5! text-normal! w-max"
                            options={{
                                Today: "today",
                                "Last Week": "lastweek",
                                "Last Month": "lastmonth",
                                "Last 6 Months": "lasthalfyear",
                                "Last Year": "lastyear",
                            }}
                        />
                    </div>
                </div>

                <div className="flex gap-5 mb-12">
                    <AnalyticsCard title="Total Revenue" symbol="₱" value={384250.0} percentDifference={10} />
                    <AnalyticsCard title="Average Order Value" symbol="₱" value={1568.37} percentDifference={12.3} />
                    <AnalyticsCard title="Total Orders" value={4321} percentDifference={10} />
                    <AnalyticsCard title="Total Customers" value={1234} percentDifference={10} />
                </div>
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex gap-5 min-w-0">
                        <SalesOverviewCard title="Sales Overview" labels={salesDataLabels} data={salesData} />
                        <PerformanceCard
                            title="Performance"
                            labels={performanceLabels}
                            datasets={performanceDatasets}
                        />
                    </div>
                    <div className="flex gap-5 min-w-0">
                        <BranchLegendCard branches={BRANCH_LEGEND} />
                        <InterBranchPerformanceCard
                            title="Inter-branch Performance"
                            labels={interBranchLabels}
                            data={interBranchData}
                        />
                    </div>
                </div>
                <Card className="mb-12">
                    <Card.Body>
                        <Text variant="crimson" size="bigger" weight="extraBold">
                            Branches
                        </Text>
                    </Card.Body>

                    {/* TABLE FILTER */}
                    <Card.Body>
                        <TableFilterBar
                            isComplex={false}
                            searchValue={searchBranch}
                            onSearchChange={(e) => setSearchBranch(e.target.value)}
                            searchPlaceholder="Search branch ID or location..."
                            filters={
                                <>
                                    <div className="w-48">
                                        <SelectInput
                                            name="locationFilter"
                                            defaultValue={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                            className="py-1!"
                                            options={{
                                                "All Locations": "All Locations",
                                                ...Object.fromEntries(
                                                    uniqueLocations.map((location) => [location, location])
                                                ),
                                            }}
                                        />
                                    </div>

                                    <div className="w-48">
                                        <SelectInput
                                            name="employeeFilter"
                                            defaultValue={employeeFilter}
                                            onChange={(e) => setEmployeeFilter(e.target.value)}
                                            className="py-1!"
                                            options={{
                                                "All Employees": "All Employees",
                                                "1–10 Employees": "1-10",
                                                "11–20 Employees": "11-20",
                                                "21–30 Employees": "21-30",
                                                "31–40 Employees": "31-40",
                                                "41+ Employees": "41+",
                                            }}
                                        />
                                    </div>
                                </>
                            }
                        />
                    </Card.Body>

                    <Card.Body removePadding bordered={false}>
                        <Table
                            bordered={false}
                            pagination={{
                                bgVariant: "cream-muted",
                                borderVariant: "brown",
                                borderedTop: true,
                                maxItems: 6,
                                textSize: "description",
                                textVariant: "crimson",
                                textWeight: "medium",
                            }}
                            rounded={false}
                            shadow
                        >
                            <Table.Row borderedBottom>
                                <Table.Header text="Branch ID" />
                                <Table.Header text="Location" />
                                <Table.Header text="No. of Employees" />
                                <Table.Header text="Total Sales" />
                            </Table.Row>
                            {filteredBranches.map((branch, index) => (
                                <Table.Row key={index}>
                                    <Table.Data text={branch.branchId} />
                                    <Table.Data>
                                        <PrimarySecondaryText
                                            primary={branch.location}
                                            secondary={branch.subLocation}
                                        />
                                    </Table.Data>
                                    <Table.Data text={String(branch.employees)} />
                                    <Table.Data text={NumberFormat(branch.totalSales, "₱")} />
                                </Table.Row>
                            ))}
                        </Table>
                    </Card.Body>
                </Card>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default HQ_Dashboard;
