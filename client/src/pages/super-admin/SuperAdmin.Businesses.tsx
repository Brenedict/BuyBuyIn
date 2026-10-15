import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Outlet } from "react-router";

export function SuperAdmin_Businesses() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>Businesses</Text>
                <Button>Button</Button>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default SuperAdmin_Businesses;
