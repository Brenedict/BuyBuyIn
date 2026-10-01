// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Outlet } from "react-router";

export function BranchManager_BranchWideOffers() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Branch Manager Offers</Text>
                <Button>Button</Button>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default BranchManager_BranchWideOffers;
