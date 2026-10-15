import { Outlet } from "react-router";
import { useState } from "react";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { SearchInput } from "../../components/Input";
import Icon from "../../components/Icon";

// MUI Icons
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

// --- Mock Data ---
const STAT_CARDS = [
    { label: "Total Offers In This Branch", value: "4", icon: LocalOfferOutlinedIcon, iconColor: "crimson" },
    { label: "Active Offers", value: "2", icon: EventAvailableOutlinedIcon, iconColor: "crimson" },
    { label: "Inactive / Expired", value: "1", icon: WarningAmberOutlinedIcon, iconColor: "crimson" },
    { label: "Total Branches", value: "5", icon: StorefrontOutlinedIcon, iconColor: "crimson" },
];

const OFFERS = [
    { title: "Summer Sale 2026", date: "May 1 - June 30" },
    { title: "Independence Day", date: "June 12 - June 15" },
    { title: "Black Friday", date: "Nov 24 - Nov 30" },
    { title: "Christmas Sale", date: "Dec 25 - Dec 30" },
];

export function BranchManager_BranchWideOffers() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <Card>
            <Card.Body className="py-6 px-10 flex flex-col gap-8 overflow-scroll">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-row justify-between items-center border-b-1 border-maroon pb-6">
                    <Text weight="extraBold" size="large" variant="crimson" className="uppercase drop-shadow-sm text-4xl">
                        BRANCH-WIDE OFFERS
                    </Text>
                    
                    <div className="flex flex-row gap-6 items-center">
                        <SearchInput 
                            id="searchBranch"
                            name="searchBranch"
                            label=""
                            placeholder="Search Branch" 
                            disabled={false}
                            hidden={false}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64"
                        />
                        
                        <Card isGlass={false} dropShadow={true} className="px-6 py-4 rounded-2xl bg-[#FEFCED]">
                            <Text weight="bold" size="normal" variant="black">
                                Branch Details
                            </Text>
                            <Text weight="extraBold" size="bigger" variant="crimson">
                                Branch - Caloocan
                            </Text>
                            <Text size="normal" variant="black">
                                Branch 001- 001
                            </Text>
                        </Card>
                    </div>
                </div>

                {/* --- STATS GRID SECTION --- */}
                <div className="grid grid-cols-4 gap-6">
                    {STAT_CARDS.map((stat, idx) => (
                        <Card key={idx} dropShadow={true} className="bg-[#FEFCED] rounded-2xl py-2 flex-1">
                            <Card.Body className="flex flex-col gap-2 justify-center h-full">
                                <Text size="description" variant="black" className="uppercase">
                                    {stat.label}
                                </Text>
                                <div className="flex flex-row items-center gap-4 mt-2">
                                    <Icon 
                                        icon={stat.icon} 
                                        size="bigger" 
                                        variant={stat.iconColor as any} 
                                    />
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
                        <Text weight="extraBold" size="bigger" variant="crimson" className="uppercase text-3xl">
                            OFFERS
                        </Text>
                    </Card.Header>
                    
                    <Card.Body className="px-8 pb-4">
                        <div className="border border-gray-400 rounded-3xl p-6">
                            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
                                {OFFERS.map((offer, idx) => (
                                    <Card key={idx} dropShadow={true} className="bg-[#FEFCED] rounded-2xl h-full">
                                        <Card.Body className="flex flex-col justify-between h-full min-h-[160px] gap-4">
                                            
                                            <Text weight="extraBold" size="big" variant="crimson" className="leading-tight">
                                                {offer.title}
                                            </Text>
                                            
                                            <div className="flex flex-row justify-between items-center mt-auto pt-2">
                                                <Text weight="bold" size="description" variant="maroon">
                                                    {offer.date}
                                                </Text>
                                                
                                                <div className="flex flex-row items-center gap-3">
                                                    <button className="text-gray-500 hover:text-crimson transition-colors">
                                                        <DeleteOutlineOutlinedIcon fontSize="small" />
                                                    </button>
                                                    <Button size="small" variant="main" className="rounded-full px-6">
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                            
                                        </Card.Body>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </Card.Body>

                    <Card.Footer bordered={false} className="flex justify-end gap-2 px-8 pb-8">
                        <Button variant="secondary" size="small" className="rounded-full!">Previous</Button>
                        <Button variant="main" size="small" className="rounded-full! px-4!">1</Button>
                        <Button variant="secondary" size="small" className="rounded-full! px-4!">2</Button>
                        <Button variant="secondary" size="small" className="rounded-full! px-4!">3</Button>
                        <Button variant="main" size="small" className="rounded-full! px-6!">Next</Button>
                    </Card.Footer>
                </Card>

            </Card.Body>

            <Outlet />
        </Card>
    );
}

export default BranchManager_BranchWideOffers;