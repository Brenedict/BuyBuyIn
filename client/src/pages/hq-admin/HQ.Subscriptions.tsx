import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Outlet } from "react-router";

export function HQ_Subscriptions() {
    return (
        <Card>
            <Card.Body className="flex flex-col gap-6">
                <Text>HQ Admin Subscriptions</Text>
                <Button>Button</Button>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default HQ_Subscriptions;
