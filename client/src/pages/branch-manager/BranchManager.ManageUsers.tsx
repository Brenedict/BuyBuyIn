// General Imports
import { useState } from "react";

// Components
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { SearchInput, SelectInput } from "../../components/Input";
import { Button } from "../../components/Button";
import Table from "../../components/Table";

// Mock Data
import { SAMPLE_USERS } from "../../TESTINGDATA/manageUsersData";

// Icons
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import PauseCircleOutlinedIcon from "@mui/icons-material/PauseCircleOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Icon from "../../components/Icon";

// SUB COMPONENTS
interface StatCardsProps {
    users: typeof SAMPLE_USERS;
}

// StatCards
interface StatCardsProps {
    users: typeof SAMPLE_USERS;
}

function StatCardsSection({ users }: StatCardsProps) {
    const total = users.length;
    const active = users.filter((u) => u.status === "Active").length;
    const suspended = users.filter((u) => u.status === "Suspended").length;
    const offline = users.filter((u) => u.status === "Offline").length;

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
    setRoleFilter: (val: string) => void;
    setBranchFilter: (val: string) => void;
    setStatusFilter: (val: string) => void;
}

function ControlsSection({
    searchQuery,
    setSearchQuery,
    setRoleFilter,
    setBranchFilter,
    setStatusFilter,
}: ControlsProps) {
    return (
        <Card isGlass={false} className="overflow-visible! z-20 relative">
            <Card.Body className="flex flex-wrap items-center justify-between gap-6 overflow-visible!">
                <div className="flex-1 min-w-[300px]">
                    <SearchInput
                        placeholder="Search by name or contact number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full!"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="w-48">
                        <SelectInput
                            name="roleFilter"
                            defaultValue="All Roles"
                            className="py-1!"
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <SelectInput.Option value="All Roles">All Roles</SelectInput.Option>
                            <SelectInput.Option value="Manager">Manager</SelectInput.Option>
                            <SelectInput.Option value="Cashier">Cashier</SelectInput.Option>
                        </SelectInput>
                    </div>

                    <div className="w-48">
                        <SelectInput
                            name="branchFilter"
                            defaultValue="All Branches"
                            className="py-1!"
                            onChange={(e) => setBranchFilter(e.target.value)}
                        >
                            <SelectInput.Option value="All Branches">All Branches</SelectInput.Option>
                            <SelectInput.Option value="Branch North, Manila">Branch North</SelectInput.Option>
                            <SelectInput.Option value="Branch West, Pasig">Branch West</SelectInput.Option>
                        </SelectInput>
                    </div>

                    <div className="w-48">
                        <SelectInput
                            name="statusFilter"
                            defaultValue="All Status"
                            className="py-1!"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <SelectInput.Option value="All Status">All Status</SelectInput.Option>
                            <SelectInput.Option value="Active">Active</SelectInput.Option>
                            <SelectInput.Option value="Offline">Offline</SelectInput.Option>
                            <SelectInput.Option value="Suspended">Suspended</SelectInput.Option>
                        </SelectInput>
                    </div>

                    <Button variant="main" size="medium" className="whitespace-nowrap">
                        + Register User
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}

// Employee List
interface EmployeeListProps {
    users: typeof SAMPLE_USERS;
}

function EmployeeListSection({ users }: EmployeeListProps) {
    return (
        <Card isGlass={false}>
            <Card.Body className="flex flex-col gap-4">
                <Text weight="bold" size="big" variant="crimson">
                    Employee List
                </Text>

                <Table pagination={{ maxItems: 3 }}>
                    <Table.Row borderedBottom>
                        <Table.Header text="Name" textVariant="crimson" bgVariant="cream" />
                        <Table.Header text="Contact No." textVariant="crimson" bgVariant="cream" />
                        <Table.Header text="Role" textVariant="crimson" bgVariant="cream" />
                        <Table.Header text="Branch" textVariant="crimson" bgVariant="cream" />
                        <Table.Header text="Status" textVariant="crimson" bgVariant="cream" />
                        <Table.Header text="Actions" textVariant="crimson" bgVariant="cream" />
                    </Table.Row>

                    {users.map((user) => (
                        <Table.Row key={user.id} borderedBottom bgVariant="cream">
                            <Table.Data text={user.name} />
                            <Table.Data text={user.contact} />
                            <Table.Data text={user.role} />
                            <Table.Data>
                                <div className="flex flex-col items-center">
                                    <Text size="normal" variant="brown" weight="medium">
                                        {user.branch.split(",")[0]}
                                    </Text>
                                    <Text size="description" variant="slate-light">
                                        {user.branch.split(",")[1]}
                                    </Text>
                                </div>
                            </Table.Data>
                            <Table.Data text={user.status} />
                            <Table.Data>
                                <div className="flex justify-center gap-2">
                                    <Button variant="secondary" size="small" className="rounded-3xl! px-4!">
                                        View
                                    </Button>
                                    <Button variant="secondary" size="small" className="rounded-3xl! px-4!">
                                        Edit
                                    </Button>
                                    <Button variant="main" size="small" className="rounded-3xl! px-4!">
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
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All Roles");
    const [branchFilter, setBranchFilter] = useState("All Branches");
    const [statusFilter, setStatusFilter] = useState("All Status");

    const filteredUsers = SAMPLE_USERS.filter((user) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            user.name.toLowerCase().includes(searchLower) || String(user.contact).toLowerCase().includes(searchLower);

        const matchesRole = roleFilter === "All Roles" ? true : user.role === roleFilter;
        const matchesBranch = branchFilter === "All Branches" ? true : user.branch === branchFilter;
        const matchesStatus = statusFilter === "All Status" ? true : user.status === statusFilter;

        return matchesSearch && matchesRole && matchesBranch && matchesStatus;
    });

    return (
        <main className="flex flex-col w-full">
            <Card>
                <Card.Body className="py-6 px-10 flex flex-col gap-6">
                    <PageHeader
                        headerText="MANAGE USERS"
                        descriptionText="Register user and give roles and permission"
                    />

                    <StatCardsSection users={SAMPLE_USERS} />

                    <ControlsSection
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setRoleFilter={setRoleFilter}
                        setBranchFilter={setBranchFilter}
                        setStatusFilter={setStatusFilter}
                    />

                    <EmployeeListSection users={filteredUsers} />
                </Card.Body>
            </Card>
        </main>
    );
}
