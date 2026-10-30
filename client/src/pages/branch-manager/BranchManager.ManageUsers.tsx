// General Imports
import { useState } from "react";
import { Outlet, useLoaderData } from "react-router";

// Components
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import SearchInput from "../../components/inputs/SearchInput";
import SelectInput from "../../components/inputs/SelectInput";
import { Button } from "../../components/Button";
import Table from "../../components/Table";
import Icon from "../../components/Icon";

// Icons
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";

// Hooks & Routes
import useNavigatePage from "../../hooks/useNavigatePage";
import { ROUTES } from "../../routes/Routes";

// API Services
import type { RegistrationUserEntry } from "@buybuyin/shared/schema/registration";

// SUB COMPONENTS

// StatCards
function StatCardsSection({ users }: { users: RegistrationUserEntry[] }) {
    const total = users.length;
    const active = users.filter((u) => u.accountStatus === "ACTIVE").length;
    const suspended = users.filter((u) => u.accountStatus === "SUSPENDED").length;
    const offline = total - active - suspended;

    const StatCard = ({
        title,
        value,
        icon,
        iconColor,
    }: {
        title: string;
        value: number;
        icon: any;
        iconColor: any;
    }) => (
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
            <StatCard title="Total Users" value={total} icon={PersonOutlinedIcon} iconColor="crimson" />
            <StatCard title="Active Users" value={active} icon={HowToRegOutlinedIcon} iconColor="crimson" />
            <StatCard title="Suspended Users" value={suspended} icon={PersonOffOutlinedIcon} iconColor="crimson" />
            <StatCard title="Offline Users" value={offline} icon={PauseCircleOutlinedIcon} iconColor="crimson" />
        </div>
    );
}

// Controls
interface ControlsProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    setBranchFilter: (val: string) => void;
    setStatusFilter: (val: string) => void;
    uniqueBranches: string[];
    uniqueStatuses: string[];
    onAddUser: () => void;
}

function ControlsSection({
    searchQuery,
    setSearchQuery,
    setBranchFilter,
    setStatusFilter,
    uniqueBranches,
    uniqueStatuses,
    onAddUser,
}: ControlsProps) {
    return (
        <Card isGlass={false} className="overflow-visible! z-20 relative">
            <Card.Body className="flex flex-wrap items-center justify-between gap-6 overflow-visible!">
                <div className="flex-1 min-w-[300px]">
                    <SearchInput
                        placeholder="Search by name or email"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full!"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-48">
                        <SelectInput
                            name="branchFilter"
                            defaultValue="All Branches"
                            className="py-1!"
                            onChange={(e) => setBranchFilter(e.target.value)}
                            options={{
                                "All Branches": "All Branches",
                                ...Object.fromEntries(uniqueBranches.map((branch) => [branch, branch] as const)),
                            }}
                        />
                    </div>

                    <div className="w-48">
                        <SelectInput
                            name="statusFilter"
                            defaultValue="All Status"
                            className="py-1!"
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={{
                                "All Status": "All Status",
                                ...Object.fromEntries(uniqueStatuses.map((status) => [status, status] as const)),
                            }}
                        />
                    </div>

                    <Button variant="main" size="medium" className="whitespace-nowrap" onClick={onAddUser}>
                        + Register User
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

// Employee List
function EmployeeListSection({ users }: { users: RegistrationUserEntry[] }) {
    return (
        <Card isGlass={false}>
            <Card.Body>
                <Text weight="bold" size="big" variant="crimson">
                    Employee List
                </Text>
            </Card.Body>

            <Card.Body className="flex flex-col gap-4" removePadding bordered={false}>
                <Table pagination={{ maxItems: 3 }} rounded={false} bordered={false}>
                    <Table.Row borderedBottom>
                        <Table.Header text="Name" />
                        <Table.Header text="Email" />
                        <Table.Header text="Branch" />
                        <Table.Header text="Status" />
                        <Table.Header text="Actions" />
                    </Table.Row>

                    {users.map((user) => (
                        <Table.Row key={user.id} borderedBottom>
                            <Table.Data text={`${user.firstName} ${user.lastName}`} />
                            <Table.Data text={user.email} />
                            <Table.Data text={user.branch?.location ?? "—"} />
                            <Table.Data text={user.accountStatus} />
                            <Table.Data>
                                <div className="flex justify-center gap-2">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        leftIcon={VisibilityOutlinedIcon}
                                        className="rounded-3xl! px-4!"
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        leftIcon={DriveFileRenameOutlineOutlinedIcon}
                                        className="rounded-3xl! px-4!"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="main"
                                        size="small"
                                        leftIcon={DeleteForeverOutlinedIcon}
                                        className="rounded-3xl! px-4!"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Table.Data>
                        </Table.Row>
                    ))}
                </Table>
            </Card.Body>
        </Card>
    );
}

// MAIN COMPONENT
export default function BranchManager_ManageUsers() {
    const navigate = useNavigatePage();

    const cashiers = useLoaderData<RegistrationUserEntry[]>();

    const [searchQuery, setSearchQuery] = useState("");
    const [branchFilter, setBranchFilter] = useState("All Branches");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const handleAddUser = () => navigate(ROUTES.BRANCH_MANAGER.manageUsersAddCashier, true);

    const uniqueBranches = Array.from(new Set(cashiers.map((user) => user.branch?.location).filter(Boolean))) as string[];
    const uniqueStatuses = Array.from(new Set(cashiers.map((user) => user.accountStatus)));

    const filteredUsers = cashiers.filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower);

        const matchesBranch =
            branchFilter === "All Branches" ? true : user.branch?.location === branchFilter;
        const matchesStatus = statusFilter === "All Status" ? true : user.accountStatus === statusFilter;

        return matchesSearch && matchesBranch && matchesStatus;
    });

    return (
        <main className="flex flex-col w-full">
            <Card>
                <Card.Body className="py-6 px-10 flex flex-col gap-6">
                    <PageHeader
                        headerText="MANAGE USERS"
                        descriptionText="Register user and give roles and permission"
                    />

                    <StatCardsSection users={cashiers} />

                    <ControlsSection
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setBranchFilter={setBranchFilter}
                        setStatusFilter={setStatusFilter}
                        uniqueBranches={uniqueBranches}
                        uniqueStatuses={uniqueStatuses}
                        onAddUser={handleAddUser}
                    />

                    <EmployeeListSection users={filteredUsers} />
                </Card.Body>
            </Card>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </main>
    );
}