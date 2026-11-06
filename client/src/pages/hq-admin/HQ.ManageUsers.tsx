// General Imports
import { Outlet } from "react-router";
import { useState } from "react";

// Components
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import { SearchInput } from "../../components/Input";
import SelectInput from "../../components/inputs/SelectInput";
import Icon from "../../components/Icon";
import { TableFilterBar } from "../../components/TableFilterBar";

// Icons
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";
import { ROUTES } from "../../routes/Routes";

// Mock Data
import { MOCK_BRANCHES, MOCK_BRANCH_MANAGERS } from "../../TESTINGDATA/hqAdminManageAccountsData";

/* MAIN COMPONENT */
export default function HQAdmin_ManageUsers() {
    const navigate = useNavigatePage();

    // Branch States
    const [branchSearch, setBranchSearch] = useState("");
    const [branchLocationFilter, setBranchLocationFilter] = useState("All Locations");
    const [branchLimitFilter, setBranchLimitFilter] = useState("All Limits");

    // Manager States
    const [managerSearch, setManagerSearch] = useState("");
    const [managerLocationFilter, setManagerLocationFilter] = useState("All Locations");

    // Options
    const uniqueLocations = Array.from(new Set(MOCK_BRANCHES.map((b) => b.location)));
    const uniqueLimits = Array.from(new Set(MOCK_BRANCHES.map((b) => b.accountLimit))).sort((a, b) => a - b);

    const branchLocationOptions = {
        "All Locations": "All Locations",
        ...Object.fromEntries(uniqueLocations.map((loc: string) => [loc, loc])),
    };

    const branchLimitOptions = {
        "All Limits": "All Limits",
        ...Object.fromEntries(uniqueLimits.map((limit: number) => [`${limit} Limits`, String(limit)])),
    };

    const managerLocationOptions = {
        "All Locations": "All Locations",
        ...Object.fromEntries(uniqueLocations.map((loc: string) => [loc, loc])),
    };

    // Filter Logic
    const filteredBranches = MOCK_BRANCHES.filter((branch) => {
        const matchesSearch = branch.id.toLowerCase().includes(branchSearch.toLowerCase());
        const matchesLocation =
            branchLocationFilter === "All Locations" ? true : branch.location === branchLocationFilter;
        const matchesLimit =
            branchLimitFilter === "All Limits" ? true : branch.accountLimit === Number(branchLimitFilter);
        return matchesSearch && matchesLocation && matchesLimit;
    });

    const filteredManagers = MOCK_BRANCH_MANAGERS.filter((manager) => {
        const matchesSearch =
            manager.firstName.toLowerCase().includes(managerSearch.toLowerCase()) ||
            manager.lastName.toLowerCase().includes(managerSearch.toLowerCase()) ||
            manager.id.toLowerCase().includes(managerSearch.toLowerCase()) ||
            manager.email.toLowerCase().includes(managerSearch.toLowerCase());
        const matchesLocation =
            managerLocationFilter === "All Locations" ? true : manager.location === managerLocationFilter;
        return matchesSearch && matchesLocation;
    });

    // Navigation HandlerS
    const handleAddBranch = () => navigate(`${ROUTES.HQ_ADMIN.manageUsers}/branch/add`);
    const handleEditBranch = (id: string) => navigate(`${ROUTES.HQ_ADMIN.manageUsers}/branch/edit/${id}`);
    const handleDeleteBranch = (id: string) => navigate(`${ROUTES.HQ_ADMIN.manageUsers}/branch/delete/${id}`);

    const handleAddManager = () => navigate(`${ROUTES.HQ_ADMIN.manageUsers}/manager/add`);
    const handleViewManager = (id: string) => navigate(`${ROUTES.HQ_ADMIN.manageUsers}/manager/view/${id}`);
    const handleEditManager = (id: string) => navigate(`${ROUTES.HQ_ADMIN.manageUsers}/manager/edit/${id}`);

    return (
        <main className="flex flex-col w-full gap-6 pb-10">
            <PageHeaderSection />
            <StatCardsSection />
            <BranchesSection
                search={branchSearch}
                onSearchChange={setBranchSearch}
                locationFilter={branchLocationFilter}
                onLocationChange={setBranchLocationFilter}
                limitFilter={branchLimitFilter}
                onLimitChange={setBranchLimitFilter}
                branchLocationOptions={branchLocationOptions}
                branchLimitOptions={branchLimitOptions}
                filteredBranches={filteredBranches}
                handleAdd={handleAddBranch}
                handleEdit={handleEditBranch}
                handleDelete={handleDeleteBranch}
            />
            <BranchManagersSection
                search={managerSearch}
                onSearchChange={setManagerSearch}
                locationFilter={managerLocationFilter}
                onLocationChange={setManagerLocationFilter}
                managerLocationOptions={managerLocationOptions}
                filteredManagers={filteredManagers}
                handleAdd={handleAddManager}
                handleView={handleViewManager}
                handleEdit={handleEditManager}
            />
            <Outlet />
        </main>
    );
}

/* SUB-COMPONENTS */
function PageHeaderSection() {
    return (
        <Card>
            <Card.Body className="py-6 px-10">
                <PageHeader
                    headerText="MANAGE BRANCHES & ACCOUNTS"
                    descriptionText="Oversee branch details and Branch Manager accounts."
                />
            </Card.Body>
        </Card>
    );
}

function StatCardsSection() {
    const totalBranches = MOCK_BRANCHES.length;
    const totalManagers = MOCK_BRANCH_MANAGERS.length;
    const totalAccountLimits = MOCK_BRANCHES.reduce((sum, branch) => sum + branch.accountLimit, 0);
    const activeManagers = MOCK_BRANCH_MANAGERS.length;

    const StatCard = ({ title, value, icon, iconColor }: any) => (
        <Card isGlass={false} className="flex-1 min-w-[230px]">
            <Card.Body className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Icon
                        icon={icon}
                        size="bigger"
                        variant={iconColor}
                        bg={{ variant: "off-white", type: "circle", padding: "small" }}
                    />
                    <div className="flex flex-col">
                        <Text size="description" variant="slate-medium" weight="medium">
                            {title}
                        </Text>
                        <Text size="large" variant="black" weight="bold">
                            {value}
                        </Text>
                    </div>
                </div>
                <Icon icon={ChevronRightIcon} size="medium" variant="slate-medium" />
            </Card.Body>
        </Card>
    );

    return (
        <div className="flex flex-wrap gap-4 w-full">
            <StatCard title="Total Branches" value={totalBranches} icon={StorefrontOutlinedIcon} iconColor="crimson" />
            <StatCard title="Total Managers" value={totalManagers} icon={PeopleAltOutlinedIcon} iconColor="crimson" />
            <StatCard title="Active Managers" value={activeManagers} icon={HowToRegOutlinedIcon} iconColor="crimson" />
            <StatCard
                title="Total Account Limits"
                value={totalAccountLimits}
                icon={AccountBalanceWalletOutlinedIcon}
                iconColor="crimson"
            />
        </div>
    );
}

function BranchesSection({
    search,
    onSearchChange,
    locationFilter,
    onLocationChange,
    limitFilter,
    onLimitChange,
    branchLocationOptions,
    branchLimitOptions,
    filteredBranches,
    handleAdd,
    handleEdit,
    handleDelete,
}: any) {
    return (
        <Card className="overflow-visible! z-20 relative">
            <Card.Body className="py-4 px-10 border-b border-slate-dark">
                <Text weight="bold" size="big" variant="crimson">
                    Branches
                </Text>
            </Card.Body>

            <Card.Body className="py-6 px-10 overflow-visible!">
                <TableFilterBar
                    isComplex={false}
                    searchValue={search}
                    onSearchChange={(e) => onSearchChange(e.target.value)}
                    searchPlaceholder="Search by Branch ID"
                    filters={
                        <>
                            <div className="w-48">
                                <SelectInput
                                    name="branchLocationFilter"
                                    defaultValue={locationFilter}
                                    options={branchLocationOptions}
                                    onChange={(e: any) => onLocationChange(e.target.value)}
                                />
                            </div>

                            <div className="w-48">
                                <SelectInput
                                    name="branchLimitFilter"
                                    defaultValue={limitFilter}
                                    options={branchLimitOptions}
                                    onChange={(e: any) => onLimitChange(e.target.value)}
                                />
                            </div>
                        </>
                    }
                    actions={
                        <Button variant="main" size="medium" className="whitespace-nowrap" onClick={handleAdd}>
                            + Add Branch
                        </Button>
                    }
                />
            </Card.Body>

            <Card.Body className="flex flex-col gap-4 pb-6 px-10">
                <Table pagination={{ maxItems: 3 }} rounded={true} bordered={true}>
                    <Table.Row borderedBottom>
                        <Table.Header text="Branch ID" />
                        <Table.Header text="Location" />
                        <Table.Header text="Account Limit" />
                        <Table.Header text="Actions" />
                    </Table.Row>
                    {filteredBranches.length > 0 ? (
                        filteredBranches.map((branch: any) => (
                            <Table.Row key={branch.id} borderedBottom>
                                <Table.Data text={branch.id} />
                                <Table.Data text={branch.location} />
                                <Table.Data text={branch.accountLimit.toString()} />
                                <Table.Data>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="rounded-3xl! px-4!"
                                            onClick={() => handleEdit(branch.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="main"
                                            size="small"
                                            className="rounded-3xl! px-4!"
                                            onClick={() => handleDelete(branch.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </Table.Data>
                            </Table.Row>
                        ))
                    ) : (
                        <div className="p-4 text-center text-slate-500">No branches found.</div>
                    )}
                </Table>
            </Card.Body>
        </Card>
    );
}

function BranchManagersSection({
    search,
    onSearchChange,
    locationFilter,
    onLocationChange,
    managerLocationOptions,
    filteredManagers,
    handleAdd,
    handleView,
    handleEdit,
}: any) {
    return (
        <Card className="overflow-visible! z-10 relative">
            <Card.Body className="py-4 px-10 border-b border-slate-dark">
                <Text weight="bold" size="big" variant="crimson">
                    Branch Managers
                </Text>
            </Card.Body>

            <Card.Body className="py-6 px-10 overflow-visible!">
                <TableFilterBar
                    isComplex={false}
                    searchValue={search}
                    onSearchChange={(e) => onSearchChange(e.target.value)}
                    searchPlaceholder="Search Name, ID, or Email"
                    filters={
                        <div className="w-48">
                            <SelectInput
                                name="managerLocationFilter"
                                defaultValue={locationFilter}
                                options={managerLocationOptions}
                                onChange={(e: any) => onLocationChange(e.target.value)}
                            />
                        </div>
                    }
                    actions={
                        <Button variant="main" size="medium" className="whitespace-nowrap" onClick={handleAdd}>
                            + Register Manager
                        </Button>
                    }
                />
            </Card.Body>

            <Card.Body className="flex flex-col gap-4 pb-6 px-10">
                <Table pagination={{ maxItems: 5 }} rounded={true} bordered={true}>
                    <Table.Row borderedBottom>
                        <Table.Header text="User ID" />
                        <Table.Header text="Location" />
                        <Table.Header text="First Name" />
                        <Table.Header text="Last Name" />
                        <Table.Header text="Email" />
                        <Table.Header text="Actions" />
                    </Table.Row>
                    {filteredManagers.length > 0 ? (
                        filteredManagers.map((manager: any) => (
                            <Table.Row key={manager.id} borderedBottom>
                                <Table.Data text={manager.id} />
                                <Table.Data text={manager.location} />
                                <Table.Data text={manager.firstName} />
                                <Table.Data text={manager.lastName} />
                                <Table.Data text={manager.email} />
                                <Table.Data>
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="rounded-3xl! px-4!"
                                            onClick={() => handleView(manager.id)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            className="rounded-3xl! px-4!"
                                            onClick={() => handleEdit(manager.id)}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </Table.Data>
                            </Table.Row>
                        ))
                    ) : (
                        <div className="p-4 text-center text-slate-500">No managers found.</div>
                    )}
                </Table>
            </Card.Body>
        </Card>
    );
}
